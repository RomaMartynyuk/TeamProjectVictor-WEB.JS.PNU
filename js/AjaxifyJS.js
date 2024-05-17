(function (global) {
    
    const ajaxifyJS = {}

    function getRequestObject() {
        if(global.XMLHttpRequest) {
            return (new XMLHttpRequest());
        }
        else {
            global.alert("Ajax is not supported!");
            return (null);
        }
    }

    ajaxifyJS.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
        let request = getRequestObject();
        request.onreadystatechange = function() {
            handleResponse(request, responseHandler, isJsonResponse);
        };
        request.open("GET", requestUrl, true);
        request.send(null);
    }

    function handleResponse(request, responseHandler, isJsonResponse) {
        if((request.readyState === 4) && (request.status === 200)) {
            if(isJsonResponse === undefined) {
                isJsonResponse = true;
            }
            if(isJsonResponse) {
                responseHandler(JSON.parse(request.responseText));
            }
            else {
                responseHandler(request.responseText);
            }
        }
    }

    global.$ajaxifyJS = ajaxifyJS;

})(window)