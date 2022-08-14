class CardMatchUp {
  defendingCard:Card;
  attackingCard:Card;
}

class GameRunner {
    currentPlayer: Player
    players: Array<Player>
    GAME_PHASES: Array<string> =  [
      "pregame",
      "draw",
      "play card",
      "choose attackers",
      "choose defenders",
      "fight",
      "final play card",
      "change players"
    ]
    gamePhase = "pregame"

    private lastEarnedStreetCred: number
    private selectedCard: Card
    private attackers: Array<Card> = []
    private defenders: Array<CardMatchUp> = []
    private lastSelectedDefender: Card

    constructor() {
        this.players = [
            new Player(1),
            new Player(2)
        ]
        this.currentPlayer = this.players[0]
        let button
        button = createButton('Next')
        button.position(windowWidth-100, windowHeight-150)
        button.mousePressed(()=>{
            this.goToNextPhase()
        });
        document.addEventListener('click', this.mousePressedHandler.bind(this))
        document.addEventListener('dblclick', this.doubleClickHandler.bind(this))
        console.log("Game constructed")
    }

    get otherPlayer() {
      if(this.currentPlayer == this.players[0]) {
        return this.players[1]
      } else {
        return this.players[0]
      }
    }

    goToNextPhase() {
      if(this.GAME_PHASES.indexOf(this.gamePhase)+1 < this.GAME_PHASES.length)
        this.gamePhase = this.GAME_PHASES[this.GAME_PHASES.indexOf(this.gamePhase)+1]
      else
        this.gamePhase = this.GAME_PHASES[1]

      if(this.gamePhase == "draw") {
        this.currentPlayer.drawACard()
        this.attackers = []
        this.defenders = []
        this.lastEarnedStreetCred = this.currentPlayer.rollForStreetCred()
        this.goToNextPhase()
      }else if(this.gamePhase == "play card") {
        // Waiting for user to play any cards they can then move on
        if(this.currentPlayer.streetCred == 0)
          this.goToNextPhase()
      }else if(this.gamePhase == "choose attackers") {
        // Waiting for user to choose attackers
      } else if(this.gamePhase == "choose defenders") {
        if(this.attackers.length <= 0)
          this.goToNextPhase()
      }else if(this.gamePhase == "fight") {
        this.fight()
      }else if(this.gamePhase == "final play card") {
        if(this.currentPlayer.streetCred == 0)
          this.goToNextPhase()
      } else if(this.gamePhase == "change players") {
        // Clear summoning sickness from current players cards
        this.currentPlayer.board.forEach(card => card.summoningSickness = false)
        
        // switch to other player active
        this.currentPlayer = this.otherPlayer;

        // for the new active player untap all their cards
        this.currentPlayer.board.forEach(card => card.tapped = false)
        this.goToNextPhase()
      }
      console.log(this.gamePhase)
    }

    startGame() {
        this.players.forEach(player => player.drawAHandOfCards())
        this.gamePhase = "draw"
    }

    handleSelectCard() {
      this.currentPlayer.hand.forEach(card => {
        if(card.checkMouseIsOver()) {
          this.selectedCard = card;
        }
      })
    }
    playCardToBoard() {
      if(this.gamePhase == "play card" || this.gamePhase == "final play card") {
        if(this.selectedCard && this.currentPlayer.hand.indexOf(this.selectedCard)!=-1 && this.selectedCard.canBePlayed(this.currentPlayer.board, this.currentPlayer)) {
          this.currentPlayer.board.push(this.selectedCard)
          this.selectedCard.summoningSickness = true
          this.currentPlayer.streetCred -= this.selectedCard.calculateCost()
          this.currentPlayer.hand.splice(this.currentPlayer.hand.indexOf(this.selectedCard), 1)
          this.selectedCard = null
        }
      }
    }

    chooseAttackers() {
      if(this.currentPlayer.board.length > 0) {
        this.currentPlayer.board.forEach(card => {
          if(card.checkMouseIsOver() && this.attackers.indexOf(card) == -1 && card.canAttack()) {
            this.attackers.push(card)
            card.tapped = true
          }
        })
      } else {
        this.goToNextPhase()
      }
    }

    handleChooseDefenders() {
      if(this.attackers.length > 0 && this.otherPlayer.board.length > 0) {
        this.otherPlayer.board.forEach(card => {
          if(card.checkMouseIsOver() && this.defenders.filter(defenderMatch => defenderMatch.defendingCard == card).length == 0 && !card.tapped) {
            this.lastSelectedDefender = card
          }
        })

        this.attackers.forEach(card => {
          if(this.lastSelectedDefender && card.checkMouseIsOver()) {
            this.defenders.push({
              attackingCard: card,
              defendingCard: this.lastSelectedDefender
            })
          }
        })
        console.log(this.defenders)
      } else {
        this.goToNextPhase()
      }
    }
    doubleClickHandler() {
      if(this.gamePhase == "play card" || this.gamePhase == "final play card") {
        this.playCardToBoard()
      }
    }
    mousePressedHandler() {
      if(this.gamePhase == "play card" || this.gamePhase == "final play card") {
        this.handleSelectCard()
      } else if(this.gamePhase == "choose attackers") {
        this.chooseAttackers()
      }else if(this.gamePhase == "choose defenders") {
        this.handleChooseDefenders()
      }
      
    }

    fight() {
      if(this.attackers.length > 0) {
        this.attackers.forEach(attackCard => {
          attackCard.blocked = false

          let blockers = this.defenders.filter(defendingPair => defendingPair.attackingCard == attackCard)
          if(blockers.length > 0) {
            blockers.forEach(blocker => {
              attackCard.blocked = true
              attackCard.defense -= blocker.defendingCard.attack
              blocker.defendingCard.defense -= attackCard.attack
  
              if(blocker.defendingCard.defense <= 0) {
                this.otherPlayer.board.splice(this.otherPlayer.board.indexOf(blocker.defendingCard), 1)
                this.otherPlayer.graveYard.push(blocker.defendingCard)
              }
  
              if(attackCard.defense <= 0) {
                this.currentPlayer.board.splice(this.currentPlayer.board.indexOf(attackCard), 1)
                this.currentPlayer.graveYard.push(attackCard)
              }
            })
          }
          if(attackCard.defense > 0 && !attackCard.blocked) {
            this.otherPlayer.life -= attackCard.attack
          }
        })
        this.defenders = []
      } else {
        this.goToNextPhase()
      }
    }

    // Graphics below here
    draw() {
        if(this.gamePhase != "pregame") {
          this.drawBoard()
          this.drawPlayersHand(this.players[0])
          this.drawPlayersHand(this.players[1], true)
          this.drawGameText()
          if(this.defenders) {
            this.drawDefenderLine()
          }
        }
    }
    drawDefenderLine() {
      this.defenders.forEach(defenderMatch => {
        let {defendingCard, attackingCard} = defenderMatch;
        let {x, y} = defendingCard.getCenter()
        let {x: x2, y: y2} = attackingCard.getCenter()
        strokeWeight(3)
        stroke(255, 0, 0)
        line(x, y, x2, y2)
        strokeWeight(0)
      })
    }
    drawGameText() {
      fill(255)
      text(this.gamePhase, windowWidth - 200, windowHeight-100)
      text("Player " + this.currentPlayer.playerNumber, windowWidth - 200, 30)
      text("Life: " + this.currentPlayer.life, windowWidth - 200, 50)
      text("Street Cred: " + this.currentPlayer.streetCred, windowWidth - 200, 70)
      text("Graveyard Size: " + this.currentPlayer.graveYard.length, windowWidth - 200, 90)
      text("New Street Cred Earned: " + this.lastEarnedStreetCred, windowWidth - 200, windowHeight-120)
    }

    drawBoard() {
      this.drawPlayersBoard(this.players[0])
      this.drawPlayersBoard(this.players[1], true)
    }

    drawPlayersBoard(player:Player, drawOnTop: boolean = false) {
      player.board.forEach(card => {
        let yOffset = drawOnTop ? -100 : 100;
        card.y = windowHeight/2 + yOffset;
        card.x = windowWidth/2 + player.board.indexOf(card)*150 - player.board.length/2 * 150
        card.draw(this.attackers.indexOf(card)!=-1)
      })
    }
    
    drawPlayersHand(player:Player, drawOnTop = false) {
      let displayArray = player.hand.slice()

      let isCardHovered = displayArray.filter(card => card.checkMouseIsOver())
      if(player == this.currentPlayer && isCardHovered.length > 0) {
        displayArray.sort((a, b) => {
          return Math.pow(b.getCenter().x - mouseX, 2) - Math.pow(a.getCenter().x - mouseX, 2)
        })
      }

      displayArray.forEach(card => {
        card.x = windowWidth/2 + player.hand.indexOf(card)*100 - player.hand.length/2 * 100
          
        card.y = drawOnTop ? 10 : windowHeight - 100;

        let highlighted = false
        if(this.selectedCard == card) {
          card.y += drawOnTop ? 100 : -100;
          highlighted = true
        }
        card.draw(highlighted)
      })
    }
}