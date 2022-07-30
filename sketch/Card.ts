const allCards = [
    "1club.png",
    "1heart.png",
    "1spade.png",
    "1diamond.png"
]

class Card {
    id: number;
    type: number;
    card_name: string;
    strength: number;
    defense: number;
    description: number;
    streetCredCost: number = Math.ceil(Math.random() *4)
    x: number = 0;
    y: number = 0;
    cardImage: p5.Image
    constructor() {
        this.cardImage = loadImage(`images/${allCards[Math.floor(allCards.length*Math.random())]}`)
    }
    draw() {
        push()
        image(this.cardImage, this.x, this.y)
        pop()
    }
}