class Player {
    life: number = 20
    decks: Array<Deck>
    hand: Array<Card>
    handLimit: number = 7
    selectedDeck: Deck = new Deck()
    streetCred: number = 0;
    constructor(public playerNumber:number) {
        this.selectedDeck.cards = Deck.makeDeck()
    }

    drawACard() {
        this.hand.push(this.selectedDeck.cards.pop());
    }
    drawAHandOfCards() {
        this.hand = []
        for (let i = 0; i < 7; i++) {
            this.drawACard()
        }
    }

    rollForStreetCred() {
        const newStreetCred = Math.floor(Math.random()*5)
        this.streetCred += newStreetCred
        return newStreetCred
    }

    draw() {
        this.hand.forEach(card => {
            card.x = windowWidth/2 + this.hand.indexOf(card)*100 - this.hand.length/2 * 100
            card.y = windowHeight - 200;
            card.draw()
        })
    }
}