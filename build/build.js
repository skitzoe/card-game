var allCards = [
    "1club.png",
    "1heart.png",
    "1spade.png",
    "1diamond.png"
];
var Card = (function () {
    function Card() {
        this.streetCredCost = Math.ceil(Math.random() * 4);
        this.x = 0;
        this.y = 0;
        this.cardImage = loadImage("images/" + allCards[Math.floor(allCards.length * Math.random())]);
    }
    Card.prototype.draw = function () {
        push();
        image(this.cardImage, this.x, this.y);
        pop();
    };
    return Card;
}());
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
        if (this.gamePhase != "pregame") {
            this.currentPlayer.draw();
            this.board.forEach(function (card) { return card.draw(); });
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
    return GameRunner;
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
    Player.prototype.drawAHandOfCards = function () {
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
    Player.prototype.draw = function () {
        var _this = this;
        this.hand.forEach(function (card) {
            card.x = windowWidth / 2 + _this.hand.indexOf(card) * 100 - _this.hand.length / 2 * 100;
            card.y = windowHeight - 200;
            card.draw();
        });
    };
    return Player;
}());
var game;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    game = new CryptoHomieGame();
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER).noFill().frameRate(30);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(0);
    game.draw();
}
//# sourceMappingURL=build.js.map