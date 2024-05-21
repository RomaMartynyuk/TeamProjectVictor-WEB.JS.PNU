(function (global){

    const ph = {};
    
    ph.StartGame = function () {

        document.querySelector("nav").style.display = 'none';
        document.querySelector("footer").style.display = 'none';

        const config = {
            type: Phaser.AUTO,
            width: 1280,
            height: 590,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 },
                    debug: false
                }
            },
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };
        
        let player;
        let cursors;
        let sweets;
        let bombs;
        let score = 0;
        let scoreText;
        let timerText;
        let gameOver = false;
        let startTime;
        let objectGenerator;
        
        let textTimerDel
        let gameOverText;
        let winText;
        let restartButton;
        let mainPageButton;
        
        const game = new Phaser.Game(config);
        
        function preload() {
            //this.load.image('ground', 'assets/platform.png', { frameWidth: 50, frameHeight: 50 });
            this.load.image('background', 'images/game/back.png');
            this.load.image('sweet1', 'images/game/sweet1.png');
            this.load.image('sweet2', 'images/game/sweet2.png');
            this.load.image('sweet3', 'images/game/sweet3.png');
            this.load.image('bomb', 'images/game/bomb.png');
            this.load.spritesheet('dude', 'images/game/spider-man.png', { frameWidth: 100, frameHeight: 100 });
        }
        
        function create() {
            this.add.image(640, 295, 'background');
        
            player = this.physics.add.sprite(400, 500, 'dude');
            player.setCollideWorldBounds(true);
        
            cursors = this.input.keyboard.createCursorKeys();
        
            sweets = this.physics.add.group();
            bombs = this.physics.add.group();
        
            scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '40px', fill: '#fff' });
            timerText = this.add.text(16, 50, 'Time: 0', { fontSize: '40px', fill: '#fff' });
        
            startTime = this.time.now;
        
            objectGenerator = this.time.addEvent({
                delay: 500,
                callback: addFallingObject,
                callbackScope: this,
                loop: true
            });
        
            this.physics.add.overlap(player, sweets, collectSweet, null, this);
            this.physics.add.overlap(player, bombs, hitBomb, null, this);
        }
        
        function update() {
            if (gameOver) {
                return;
            }
        
            const elapsed = Math.floor((this.time.now - startTime) / 1000);
            timerText.setText('Time: ' + elapsed);
        
            if (cursors.left.isDown) {
                player.setVelocityX(-500);
            } else if (cursors.right.isDown) {
                player.setVelocityX(500);
            } else {
                player.setVelocityX(0);
            }
        
            Phaser.Actions.Call(sweets.getChildren(), function(sweet) {
                if (sweet.y > 550) {
                    sweet.disableBody(true, true);
                    sweet.destroy();
                }
            }, this);
        
            Phaser.Actions.Call(bombs.getChildren(), function(bomb) {
                if (bomb.y > 555) {
                    bomb.disableBody(true, true);
                    bomb.destroy();
                }
            }, this);
        }
        
        function addFallingObject() {
            const x = Phaser.Math.Between(50, 1230);
            const type = Phaser.Math.Between(1, 4);
            let object;
        
            if (type === 4) {
                object = bombs.create(x, 10, 'bomb');
                object.setVelocityY(300);
            } else {
                object = sweets.create(x, 10, 'sweet' + type);
                object.setVelocityY(300);
            }
        
            object.setCollideWorldBounds(true);
            object.setBounce(0.8);
            object.setAngularVelocity(Phaser.Math.Between(-100, 100));
        }
        
        function collectSweet(player, sweet) {
            sweet.disableBody(true, true);
            score += 1;
            scoreText.setText('Score: ' + score);
        
            if (score >= 10) {
                gameOver = true;
                this.physics.pause();
                objectGenerator.remove();
                winText = this.add.text(430, 50, 'You Win!', { fontSize: '80px', fill: '#fff' });
                textTimerDel = this.add.text(430, 125, timerText.text, { fontSize: '70px', fill: '#fff' });
        
                createButtons.call(this);
            }
        }
        
        function hitBomb(player, bomb) {
            bomb.disableBody(true, true);
            score -= 5;
            scoreText.setText('Score: ' + score);
        
            if (score < 0) {
                gameOver = true;
                this.physics.pause();
                objectGenerator.remove();
                gameOverText = this.add.text(430, 100, 'Game Over', { fontSize: '80px', fill: '#fff' });
                
                createButtons.call(this);
            }
        }
        
        function createButtons() {
            restartButton = this.add.text(430, 400, 'Restart', { fontSize: '40px', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    restartGame.call(this);
                });
        
            mainPageButton = this.add.text(430, 450, 'Main Page', { fontSize: '40px', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    window.location.href = 'index.html';
                });
        }
        
        function restartGame() {
            gameOver = false;
            score = 0;
            scoreText.setText('Score: ' + score);
            startTime = this.time.now;
        
            player.setPosition(400, 550);
            player.setVelocity(0);
            player.setActive(true);
            player.setVisible(true);
        
            if (gameOverText) gameOverText.destroy();
            if (winText) winText.destroy();
            if (textTimerDel) textTimerDel.destroy();
            if (restartButton) restartButton.destroy();
            if (mainPageButton) mainPageButton.destroy();
        
            sweets.clear(true, true);
            bombs.clear(true, true);
        
            objectGenerator = this.time.addEvent({
                delay: 1000,
                callback: addFallingObject,
                callbackScope: this,
                loop: true
            });
            this.physics.resume();
        }
          
    }


    global.$ph = ph;

})(window)


