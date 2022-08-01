class Player {
    life: number = 20
    decks: Array<Deck>
    hand: Array<Card>
    handLimit: number = 7
    selectedDeck: Deck = new Deck()
    streetCred: number = 0;
    graveYard: Array<Card>;
    constructor(public playerNumber:number) {
        this.selectedDeck.cards = Deck.makeDeck()
    }

    drawACard() {
        this.hand.push(this.selectedDeck.cards.pop());
    }

    drawAHandOfCards(drawOnTop = false) {
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

    draw(drawOnTop = false) {
        this.hand.forEach(card => {
            card.x = windowWidth/2 + this.hand.indexOf(card)*100 - this.hand.length/2 * 100
            if(drawOnTop) {
                card.y = 100;
            } else {
                card.y = windowHeight - 400;
            }
            card.draw()
        })
    }
}