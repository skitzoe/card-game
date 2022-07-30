class CryptoHomieGame {
    gameRunner:GameRunner
    constructor() {
        this.gameRunner = new GameRunner()
        this.gameRunner.startGame()
    }
    draw() {
        this.gameRunner.draw()
    }
}