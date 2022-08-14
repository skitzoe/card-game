var Card = (function () {
    function Card() {
        this.streetCredCost = Math.ceil(Math.random() * 4);
        this.x = 0;
        this.y = 0;
        this.summoningSickness = true;
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
        return mouseX > this.x && mouseX < this.x + this.cardImage.width * Card.SCALE && mouseY > this.y && mouseY < this.y + this.cardImage.height * Card.SCALE;
    };
    Card.prototype.canAttack = function () {
        return !this.tapped && !this.summoningSickness;
    };
    Card.prototype.canBePlayed = function (currentBoard, player) {
        if (player.streetCred < this.calculateCost()) {
            return false;
        }
        else
            return true;
    };
    Card.prototype.drawBackgroundOfCard = function (highlighted) {
        if (highlighted === void 0) { highlighted = false; }
        this.cardImage.background("#ff7f0f");
        this.cardImage.noFill();
        this.cardImage.strokeWeight(10);
        highlighted ? this.cardImage.stroke(0, 200, 255) : this.cardImage.stroke(0);
        this.cardImage.rect(0, 0, this.cardImage.width, this.cardImage.height);
    };
    Card.prototype.draw = function (highlighted) {
        if (highlighted === void 0) { highlighted = false; }
        this.drawBackgroundOfCard(highlighted);
        this.cardImage.stroke(0);
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
        scale(Card.SCALE);
        image(this.cardImage, this.x / Card.SCALE, this.y / Card.SCALE);
        pop();
    };
    Card.SCALE = .25;
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
        var myWeapon = new WeaponCard();
        newDeck.push(myWeapon);
        return newDeck;
    };
    return Deck;
}());
var CardMatchUp = (function () {
    function CardMatchUp() {
    }
    return CardMatchUp;
}());
var GameRunner = (function () {
    function GameRunner() {
        var _this = this;
        this.GAME_PHASES = [
            "pregame",
            "draw",
            "play card",
            "choose attackers",
            "choose defenders",
            "fight",
            "final play card",
            "change players"
        ];
        this.gamePhase = "pregame";
        this.attackers = [];
        this.defenders = [];
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
        document.addEventListener('click', this.mousePressedHandler.bind(this));
    }
    Object.defineProperty(GameRunner.prototype, "otherPlayer", {
        get: function () {
            if (this.currentPlayer == this.players[0]) {
                return this.players[1];
            }
            else {
                return this.players[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    GameRunner.prototype.goToNextPhase = function () {
        if (this.GAME_PHASES.indexOf(this.gamePhase) + 1 < this.GAME_PHASES.length)
            this.gamePhase = this.GAME_PHASES[this.GAME_PHASES.indexOf(this.gamePhase) + 1];
        else
            this.gamePhase = this.GAME_PHASES[1];
        if (this.gamePhase == "draw") {
            this.currentPlayer.drawACard();
            this.attackers = [];
            this.defenders = [];
            this.lastEarnedStreetCred = this.currentPlayer.rollForStreetCred();
            this.goToNextPhase();
        }
        else if (this.gamePhase == "play card") {
        }
        else if (this.gamePhase == "choose attackers") {
        }
        else if (this.gamePhase == "choose defenders") {
        }
        else if (this.gamePhase == "fight") {
            this.fight();
        }
        else if (this.gamePhase == "final play card") {
        }
        else if (this.gamePhase == "change players") {
            console.log("Changing players");
            this.currentPlayer.board.forEach(function (card) { return card.summoningSickness = false; });
            this.currentPlayer = this.players[0] == this.currentPlayer ? this.players[1] : this.players[0];
            this.currentPlayer.board.forEach(function (card) { return card.tapped = false; });
        }
        console.log(this.gamePhase);
    };
    GameRunner.prototype.startGame = function () {
        this.players.forEach(function (player) { return player.drawAHandOfCards(); });
        this.gamePhase = "draw";
    };
    GameRunner.prototype.draw = function () {
        if (this.gamePhase == "play card") {
            if (this.selectedCard && this.currentPlayer.hand.indexOf(this.selectedCard) != -1 && this.selectedCard.canBePlayed(this.currentPlayer.board, this.currentPlayer)) {
                this.currentPlayer.board.push(this.selectedCard);
                this.currentPlayer.streetCred -= this.selectedCard.calculateCost();
                this.currentPlayer.hand.splice(this.currentPlayer.hand.indexOf(this.selectedCard), 1);
                this.selectedCard = null;
            }
        }
        if (this.gamePhase != "pregame") {
            this.drawBoard();
            this.drawPlayersHand(this.players[0]);
            this.drawPlayersHand(this.players[1], true);
            this.drawGameText();
        }
    };
    GameRunner.prototype.drawGameText = function () {
        fill(255);
        text(this.gamePhase, windowWidth - 200, windowHeight - 100);
        text("Player " + this.currentPlayer.playerNumber, windowWidth - 200, 30);
        text("Life: " + this.currentPlayer.life, windowWidth - 200, 50);
        text("Street Cred: " + this.currentPlayer.streetCred, windowWidth - 200, 70);
        text("Graveyard Size: " + this.currentPlayer.graveYard.length, windowWidth - 200, 90);
        if (this.gamePhase == "roll for cred") {
            text("New Street Cred Earned: " + this.lastEarnedStreetCred, windowWidth - 200, windowHeight - 120);
        }
    };
    GameRunner.prototype.drawBoard = function () {
        this.drawPlayersBoard(this.players[0]);
        this.drawPlayersBoard(this.players[1], true);
    };
    GameRunner.prototype.drawPlayersBoard = function (player, drawOnTop) {
        var _this = this;
        if (drawOnTop === void 0) { drawOnTop = false; }
        player.board.forEach(function (card) {
            var yOffset = drawOnTop ? -100 : 100;
            card.y = windowHeight / 2 + yOffset;
            card.x = windowWidth / 2 + player.board.indexOf(card) * 100 - player.board.length / 2 * 100;
            card.draw(_this.attackers.indexOf(card) != -1);
        });
    };
    GameRunner.prototype.handlePlayCard = function () {
        var _this = this;
        this.currentPlayer.hand.forEach(function (card) {
            if (card.checkMouseIsOver()) {
                _this.selectedCard = card;
            }
        });
    };
    GameRunner.prototype.handleChoosingAttackers = function () {
        var _this = this;
        if (this.currentPlayer.board.length > 0) {
            this.currentPlayer.board.forEach(function (card) {
                if (card.checkMouseIsOver() && _this.attackers.indexOf(card) == -1 && card.canAttack()) {
                    _this.attackers.push(card);
                    card.tapped = true;
                }
            });
        }
        else {
            this.gamePhase = "final play card";
        }
    };
    GameRunner.prototype.handleChooseDefenders = function () {
        var _this = this;
        if (this.attackers.length > 0 && this.otherPlayer.board.length > 0) {
            this.otherPlayer.board.forEach(function (card) {
                if (card.checkMouseIsOver() && _this.defenders.filter(function (defenderMatch) { return defenderMatch.defendingCard == card; }).length == 0) {
                    _this.lastSelectedDefender = card;
                }
            });
            this.attackers.forEach(function (card) {
                if (_this.lastSelectedDefender && card.checkMouseIsOver()) {
                    _this.defenders.push({
                        attackingCard: card,
                        defendingCard: _this.lastSelectedDefender
                    });
                }
            });
        }
        else {
            this.goToNextPhase();
        }
    };
    GameRunner.prototype.mousePressedHandler = function () {
        if (this.gamePhase == "play card" || this.gamePhase == "final play card") {
            this.handlePlayCard();
        }
        else if (this.gamePhase == "choose attackers") {
            this.handleChoosingAttackers();
        }
        else if (this.gamePhase == "choose defenders") {
            this.handleChooseDefenders();
        }
    };
    GameRunner.prototype.fight = function () {
        var _this = this;
        if (this.attackers.length > 0) {
            this.attackers.forEach(function (attackCard) {
                attackCard.blocked = false;
                var blockers = _this.defenders.filter(function (defendingPair) { return defendingPair.attackingCard == attackCard; });
                if (blockers.length > 0) {
                    blockers.forEach(function (blocker) {
                        attackCard.blocked = true;
                        attackCard.defense -= blocker.defendingCard.attack;
                        blocker.defendingCard.defense -= attackCard.attack;
                        if (blocker.defendingCard.defense <= 0) {
                            _this.otherPlayer.board.splice(_this.otherPlayer.board.indexOf(blocker.defendingCard), 1);
                            _this.otherPlayer.graveYard.push(blocker.defendingCard);
                        }
                        if (attackCard.defense <= 0) {
                            _this.currentPlayer.board.splice(_this.currentPlayer.board.indexOf(attackCard), 1);
                            _this.currentPlayer.graveYard.push(attackCard);
                        }
                    });
                }
                if (attackCard.defense > 0 && !attackCard.blocked) {
                    _this.otherPlayer.life -= attackCard.attack;
                }
            });
        }
        else {
            this.goToNextPhase();
        }
    };
    GameRunner.prototype.drawPlayersHand = function (player, drawOnTop) {
        var _this = this;
        if (drawOnTop === void 0) { drawOnTop = false; }
        player.hand.forEach(function (card) {
            card.x = windowWidth / 2 + player.hand.indexOf(card) * 100 - player.hand.length / 2 * 100;
            if (drawOnTop) {
                card.y = 100;
            }
            else {
                card.y = windowHeight - 300;
            }
            var highlighted = false;
            if (_this.selectedCard == card) {
                card.y -= 100;
                highlighted = true;
            }
            card.draw(highlighted);
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
        this.graveYard = [];
        this.board = [];
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var WeaponCard = (function (_super) {
    __extends(WeaponCard, _super);
    function WeaponCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WeaponCard.prototype.calculateCost = function () {
        return 0;
    };
    return WeaponCard;
}(Card));
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