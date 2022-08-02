var Card = (function () {
    function Card() {
        this.streetCredCost = Math.ceil(Math.random() * 4);
        this.x = 0;
        this.y = 0;
        this.face = Math.floor(random(0, 6));
        this.brow = Math.floor(random(0, 3));
        this.glasses = Math.floor(random(0, 10));
        this.mouth = Math.floor(random(0, 5));
        this.shirt = Math.floor(random(0, 9));
        this.hair = Math.floor(random(0, 25));
        this.attack = Math.floor(random(1, 6));
        this.defense = Math.floor(random(1, 6));
        this.cardImage = createGraphics(540, 760);
    }
    Card.prototype.calculateCost = function () {
        return this.attack + this.defense;
    };
    Card.prototype.checkMouseIsOver = function () {
        console.log(mouseX, mouseY);
        console.log(this.x * 0.35, this.cardImage.width * 0.35);
        console.log(this.y * 0.35, this.cardImage.height * 0.35);
        return mouseX > this.x * 0.35 && mouseX < this.x * 0.35 + this.cardImage.width * 0.35 && mouseY > this.y * 0.35 && mouseY < this.y * 0.35 + this.cardImage.height * 0.35;
    };
    Card.prototype.draw = function (highlighted) {
        if (highlighted === void 0) { highlighted = false; }
        this.cardImage.background("#ff7f0f");
        this.cardImage.noFill();
        this.cardImage.strokeWeight(10);
        highlighted ? this.cardImage.stroke(125) : this.cardImage.stroke(0);
        this.cardImage.rect(0, 0, this.cardImage.width, this.cardImage.height);
        this.cardImage.rect(29, 75, 473, 324);
        this.cardImage.strokeWeight(3);
        this.cardImage.textSize(36);
        this.cardImage.textFont("Arial");
        this.cardImage.text("Homie", 40, 50);
        this.cardImage.text(this.attack + "/" + this.defense + " -- " + this.calculateCost() + " cred", 300, 50);
        this.cardImage.image(ImagePreloader.preloadedImages['shirt' + this.shirt], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['face' + this.face], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['brow' + this.brow], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['glasses' + this.glasses], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['hair' + this.hair], -132, 0);
        this.cardImage.image(ImagePreloader.preloadedImages['mouth' + this.mouth], -132, 0);
        push();
        translate(this.x, this.y);
        scale(0.35);
        image(this.cardImage, 0, 0);
        pop();
    };
    return Card;
}());
var CardTypes;
(function (CardTypes) {
    CardTypes[CardTypes["Homie"] = 0] = "Homie";
    CardTypes[CardTypes["Battlefield"] = 1] = "Battlefield";
    CardTypes[CardTypes["Weapon"] = 2] = "Weapon";
    CardTypes[CardTypes["On_The_Spot"] = 3] = "On_The_Spot";
})(CardTypes || (CardTypes = {}));
var CryptoHomieGame = (function () {
    function CryptoHomieGame() {
        this.gameRunner = new GameRunner();
        this.gameRunner.startGame();
    }
    CryptoHomieGame.prototype.draw = function () {
        this.gameRunner.draw();
    };
    return CryptoHomieGame;
}());
var Deck = (function () {
    function Deck() {
    }
    Deck.makeDeck = function () {
        var newDeck = [];
        for (var i = 0; i < 60; i++) {
            var card = new Card();
            newDeck.push(card);
        }
        return newDeck;
    };
    return Deck;
}());
var GameRunner = (function () {
    function GameRunner() {
        var _this = this;
        this.GAME_PHASES = ["pregame", "draw", "roll for cred", "play card", "choose attackers", "attacking", "final play card"];
        this.gamePhase = "pregame";
        this.board = [];
        this.players = [
            new Player(1),
            new Player(2)
        ];
        this.currentPlayer = this.players[0];
        var button;
        button = createButton('Next');
        button.position(windowWidth - 100, windowHeight - 150);
        button.mousePressed(function () {
            _this.goToNextPhase();
        });
    }
    GameRunner.prototype.goToNextPhase = function () {
        if (this.GAME_PHASES.indexOf(this.gamePhase) + 1 < this.GAME_PHASES.length)
            this.gamePhase = this.GAME_PHASES[this.GAME_PHASES.indexOf(this.gamePhase) + 1];
        else
            this.gamePhase = this.GAME_PHASES[1];
        if (this.gamePhase == "draw") {
            this.currentPlayer.drawACard();
        }
        else if (this.gamePhase == "roll for cred") {
            this.lastEarnedStreetCred = this.currentPlayer.rollForStreetCred();
        }
        else if (this.gamePhase == "play card") {
        }
        else if (this.gamePhase == "choose attackers") {
        }
        else if (this.gamePhase == "attacking") {
        }
        else if (this.gamePhase == "final play card") {
            console.log("Changing players");
            this.currentPlayer = this.players[0] == this.currentPlayer ? this.players[1] : this.players[0];
        }
        console.log(this.gamePhase);
    };
    GameRunner.prototype.startGame = function () {
        this.players.forEach(function (player) { return player.drawAHandOfCards(); });
        this.gamePhase = "draw";
    };
    GameRunner.prototype.draw = function () {
        var _this = this;
        if (this.gamePhase != "pregame") {
            this.drawPlayersHand(this.players[0]);
            this.drawPlayersHand(this.players[1], true);
            this.board.forEach(function (card) {
                if (mouseIsPressed) {
                    console.log("checking for card selection");
                    if (card.checkMouseIsOver())
                        _this.selectedCard = card;
                }
                var highlighted = false;
                if (_this.selectedCard == card)
                    highlighted = true;
                card.draw(highlighted);
            });
            fill(255);
            text(this.gamePhase, windowWidth - 200, windowHeight - 100);
            text("Player " + this.currentPlayer.playerNumber, windowWidth / 2, 30);
            text("Life: " + this.currentPlayer.life, windowWidth / 2, 50);
            text("Street Cred: " + this.currentPlayer.streetCred, windowWidth / 2, 70);
            if (this.gamePhase == "roll for cred") {
                text("New Street Cred Earned: " + this.lastEarnedStreetCred, windowWidth - 200, windowHeight - 120);
            }
        }
    };
    GameRunner.prototype.drawPlayersHand = function (player, drawOnTop) {
        var _this = this;
        if (drawOnTop === void 0) { drawOnTop = false; }
        player.hand.forEach(function (card) {
            if (mouseIsPressed) {
                console.log("checking for card selection");
                if (card.checkMouseIsOver())
                    _this.selectedCard = card;
            }
            var highlighted = false;
            if (_this.selectedCard == card)
                highlighted = true;
            card.x = windowWidth / 2 + player.hand.indexOf(card) * 100 - player.hand.length / 2 * 100;
            if (drawOnTop) {
                card.y = 100;
            }
            else {
                card.y = windowHeight - 400;
            }
            card.draw();
        });
    };
    return GameRunner;
}());
var ImagePreloader = (function () {
    function ImagePreloader() {
    }
    ImagePreloader.prototype.ImagePreloader = function () {
    };
    ImagePreloader.loadImages = function () {
        for (var index = 0; index < 4; index++) {
            ImagePreloader.preloadedImages['brow' + index] = loadImage("images/eyebrows/brow" + (index + 1) + ".png");
        }
        for (var index = 0; index < 7; index++) {
            ImagePreloader.preloadedImages['face' + index] = loadImage("images/face/face" + (index + 1) + ".png");
        }
        for (var index = 0; index < 11; index++) {
            ImagePreloader.preloadedImages['glasses' + index] = loadImage("images/glasses/glasses" + (index + 1) + ".png");
        }
        for (var index = 0; index < 20; index++) {
            ImagePreloader.preloadedImages['hair' + index] = loadImage("images/hair/hair" + (index + 1) + ".png");
        }
        for (var index = 0; index < 10; index++) {
            ImagePreloader.preloadedImages['shirt' + index] = loadImage("images/shirt/shirt" + (index + 1) + ".png");
        }
        for (var index = 0; index < 25; index++) {
            ImagePreloader.preloadedImages['hair' + index] = loadImage("images/hair/hair" + (index + 1) + ".png");
        }
        for (var index = 0; index < 6; index++) {
            ImagePreloader.preloadedImages['mouth' + index] = loadImage("images/mouth/mouth" + (index + 1) + ".png");
        }
    };
    ImagePreloader.preloadedImages = {};
    return ImagePreloader;
}());
var Keyword = (function () {
    function Keyword() {
    }
    return Keyword;
}());
var Player = (function () {
    function Player(playerNumber) {
        this.playerNumber = playerNumber;
        this.life = 20;
        this.handLimit = 7;
        this.selectedDeck = new Deck();
        this.streetCred = 0;
        this.selectedDeck.cards = Deck.makeDeck();
    }
    Player.prototype.drawACard = function () {
        this.hand.push(this.selectedDeck.cards.pop());
    };
    Player.prototype.drawAHandOfCards = function (drawOnTop) {
        if (drawOnTop === void 0) { drawOnTop = false; }
        this.hand = [];
        for (var i = 0; i < 7; i++) {
            this.drawACard();
        }
    };
    Player.prototype.rollForStreetCred = function () {
        var newStreetCred = Math.floor(Math.random() * 5);
        this.streetCred += newStreetCred;
        return newStreetCred;
    };
    Player.prototype.draw = function (drawOnTop) {
        if (drawOnTop === void 0) { drawOnTop = false; }
    };
    return Player;
}());
var game;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    game = new CryptoHomieGame();
    createCanvas(windowWidth, windowHeight);
    rectMode(CORNER).noFill().frameRate(30);
    ImagePreloader.loadImages();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(125);
    game.draw();
}
//# sourceMappingURL=build.js.map