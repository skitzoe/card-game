class GameRunner {
    currentPlayer: Player
    players: Array<Player>
    GAME_PHASES: Array<string> =  ["pregame", "draw", "roll for cred", "play card", "choose attackers", "attacking", "final play card"]
    gamePhase = "pregame";
    board: Array<Card> = []

    private lastEarnedStreetCred: number

    constructor() {
        this.players = [
            new Player(1),
            new Player(2)
        ]
        this.currentPlayer = this.players[0]
        let button;
        button = createButton('Next');
        button.position(windowWidth-100, windowHeight-150);
        button.mousePressed(()=>{
            this.goToNextPhase()
        });
    }

    goToNextPhase() {
      if(this.GAME_PHASES.indexOf(this.gamePhase)+1 < this.GAME_PHASES.length)
        this.gamePhase = this.GAME_PHASES[this.GAME_PHASES.indexOf(this.gamePhase)+1]
      else
        this.gamePhase = this.GAME_PHASES[1]

      if(this.gamePhase == "draw") {
        this.currentPlayer.drawACard()
      }else if(this.gamePhase == "roll for cred") {
        this.lastEarnedStreetCred = this.currentPlayer.rollForStreetCred()
      }else if(this.gamePhase == "play card") {
        // Waiting for user to play any cards they can then move on

      }else if(this.gamePhase == "choose attackers") {
        // Waiting for user to choose attackers
      }else if(this.gamePhase == "attacking") {
        // Waiting for defender to block
      }else if(this.gamePhase == "final play card") {
        console.log("Changing players")
        this.currentPlayer = this.players[0] == this.currentPlayer ? this.players[1] : this.players[0];
      }
      console.log(this.gamePhase)
    }

    startGame() {
        this.players.forEach(player => player.drawAHandOfCards())
        this.gamePhase = "draw"
    }

    draw() {
        if(this.gamePhase != "pregame") {
          this.players[0].draw()
          this.players[1].draw(true)
            
            this.board.forEach(card => card.draw())
            fill(255)
            text(this.gamePhase, windowWidth - 200, windowHeight-100)
            text("Player " + this.currentPlayer.playerNumber, windowWidth/2, 30)
            text("Life: " + this.currentPlayer.life, windowWidth/2, 50)
            text("Street Cred: " + this.currentPlayer.streetCred, windowWidth/2, 70)
            if(this.gamePhase == "roll for cred") {
              text("New Street Cred Earned: " + this.lastEarnedStreetCred, windowWidth - 200, windowHeight-120)
            }
        }
    }
}