(function (global){

    const av = {};

    const homeHtml = "snippets/home-snippets.html";
    const gameMenuHtml = "snippets/game-snippets.html";
    const allCategoriesUrl = "data/categories.json";
    const categoryHtml = "snippets/category-snippets.html";
    const catalogItemsUrl = "data/catalog/";
    const catalogItemsTitleHtml = "snippets/catalog-items-title.html";
    const catalogItemHtml = "snippets/catalog-item.html";


    const insertHtml = function (selector, html) {
        const targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    }

    const showLoading = function (selector) {
        let html = "<div class='loader'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    }

    const insertProperty = function (string, propName, propValue) {
        const propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    const switchActive = function (activeElement) {
        
        const homeButton = document.querySelector("#navHomeButton");
        const catalogButton = document.querySelector("#navCatalogButton");
    
        if (activeElement === "catalog") {
            homeButton.classList.remove("active");
            catalogButton.classList.add("active");
        } else if (activeElement === "home") {
            catalogButton.classList.remove("active");
            homeButton.classList.add("active");
        }    
      
    }


    document.addEventListener("DOMContentLoaded", function(event) {
        
        showLoading("#main-page");
        loadHomeHtml();
        document.querySelector("#navHomeButton").addEventListener("click", loadHomeHtml);
        document.querySelector("img").addEventListener("click", function (){
            window.location.reload();
        });
    });

    av.loadHomeHtml= function () {
        $ajaxifyJS.sendGetRequest(
            homeHtml,
            function (responseText) {
                switchActive("home");

                document.querySelector("#main-page").innerHTML = responseText;
            },
            false
        );
    };
    
    av.loadCatalogCategories = function () {
        showLoading("#main-page");

        $ajaxifyJS.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML);
    };

    av.loadCatalogItems = function (categoryShort) {
        showLoading("#main-page");

        $ajaxifyJS.sendGetRequest(
            catalogItemsUrl + categoryShort + ".json",
            buildAndShowCatalogItemsHTML);
    };


    function buildAndShowCategoriesHTML (categories) {
        $ajaxifyJS.sendGetRequest(
            categoryHtml,
            function (categoryHtml) {
                switchActive("catalog");

                const categoriesViewHtml = buildCategoriesViewHtml(categories, categoryHtml);
                insertHtml("#main-page", categoriesViewHtml);
            },
            false);
    }


    function buildCategoriesViewHtml (categories, categoryHtml) {
        
        let finalHtml = "<div class='categories-page'>";
        finalHtml += "<h1 class='categories-header'>Категорії</h1>";
        finalHtml += "<div class='categories'>";

        for (let i = 0; i < categories.length; i++) {
            let html = categoryHtml;
            const full_name = "" + categories[i].full_name;
            const short_name = categories[i].short_name;
            html = insertProperty(html, "full_name", full_name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</div>";
        finalHtml += "</div>";
        return finalHtml;
    }


    function buildAndShowCatalogItemsHTML (categoryCatalogItems) {
        $ajaxifyJS.sendGetRequest(
            catalogItemsTitleHtml,
            function (catalogItemsTitleHtml) {
                $ajaxifyJS.sendGetRequest(
                    catalogItemHtml,
                    function (catalogItemHtml) {
                        switchActive("catalog");

                        const catalogItemViewHtml = buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemHtml);
                        insertHtml("#main-page", catalogItemViewHtml);
                    },
                    false);
            },
            false);
    }


    function buildCatalogItemsViewHtml (categoryCatalogItems, catalogItemsTitleHtml, catalogItemHtml) {
        
        catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "full_name", categoryCatalogItems.category.full_name);

        let finalHtml = "<div class='products-page'>";
        finalHtml += catalogItemsTitleHtml;
        finalHtml += "<div class='products'>";

        const catalogItems = categoryCatalogItems.catalog_items;
        const catShortName = categoryCatalogItems.category.short_name;

        for (let i = 0; i < catalogItems.length; i++) {
            
            let html = catalogItemHtml;
            html = insertProperty(html, "catShortName", catShortName);
            html = insertProperty(html, "short_name", catalogItems[i].short_name);
            html = insertProperty(html, "full_name", catalogItems[i].full_name);
            html = insertProperty(html, "description", catalogItems[i].description);
            html = insertProperty(html, "price", catalogItems[i].price); 
            finalHtml += html;
        }

        finalHtml += "</div>";
        finalHtml += "</div>";
        return finalHtml;
    }

    av.loadGameHtml = function () {

        $ajaxifyJS.sendGetRequest(
            gameMenuHtml,
            function (responseText) {
                document.querySelector("#main-page").innerHTML = responseText;
            },
            false
        );
    };

    global.$av = av;

})(window)

