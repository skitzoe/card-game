
class Card {
    id: number
    type: number
    card_name: string
    description: number
    streetCredCost: number = Math.ceil(Math.random() *4)
    x: number = 0
    y: number = 0
    cardImage: p5.Graphics
    tapped: boolean
    summoningSickness: boolean = false
    blocked: boolean

    face = Math.floor(random(0,6))
    brow = Math.floor(random(0,3))
    glasses = Math.floor(random(0,10))
    mouth = Math.floor(random(0,5))
    shirt = Math.floor(random(0,9))
    hair = Math.floor(random(0,25))
    attack = Math.floor(random(1,6))
    defense = Math.floor(random(1,6))
    static SCALE = .25

    constructor() {
        this.cardImage = createGraphics(540,760)
    }
    calculateCost() {
        return this.attack + this.defense
    }
    checkMouseIsOver() {
        return mouseX > this.x && mouseX < this.x+this.cardImage.width *Card.SCALE && mouseY > this.y && mouseY < this.y + this.cardImage.height *Card.SCALE
    }
    canAttack() {
        return !this.tapped && !this.summoningSickness
    }
    canBePlayed(currentBoard: Array<Card>, player:Player):boolean {
        if(player.streetCred < this.calculateCost()) {
            return false
        } else return true
    }
    getCenter() {
        return {x: this.x +this.cardImage.width *Card.SCALE / 2, y: this.y +this.cardImage.height *Card.SCALE / 2}
    }
    drawBackgroundOfCard(highlighted = false) {
        
        this.cardImage.background("#ff7f0f")
        this.cardImage.noFill()
        this.cardImage.strokeWeight(10)
        highlighted ? this.cardImage.stroke(0, 200, 255) : this.cardImage.stroke(0)
        this.cardImage.rect(0,0,this.cardImage.width,this.cardImage.height)
        this.cardImage.stroke(0)
    }
    draw(highlighted = false) {
        this.drawBackgroundOfCard(highlighted)
        // 
        this.cardImage.rect(29,75,473,324)
        this.cardImage.strokeWeight(3)
        this.cardImage.textSize(36)
        this.cardImage.textFont("Arial")
        this.cardImage.text("Homie",40,50)
        this.cardImage.text(this.attack + "/" + this.defense + " -- " + this.calculateCost() + " cred",300,50)
        this.cardImage.image(ImagePreloader.preloadedImages['shirt'+this.shirt],-132,0)
        this.cardImage.image(ImagePreloader.preloadedImages['face'+this.face],-132,0)
        this.cardImage.image(ImagePreloader.preloadedImages['brow'+this.brow],-132,0)
        this.cardImage.image(ImagePreloader.preloadedImages['glasses'+this.glasses],-132,0)
        this.cardImage.image(ImagePreloader.preloadedImages['hair'+this.hair],-132,0)
        this.cardImage.image(ImagePreloader.preloadedImages['mouth'+this.mouth],-132,0)
        if(this.summoningSickness) {
            this.cardImage.fill(0, 0, 0, 125)
            this.cardImage.rect(0,0,this.cardImage.width, this.cardImage.height)
        }
        push()
        scale(Card.SCALE)
        image(this.cardImage, this.x/Card.SCALE,this.y/Card.SCALE)
        pop()
    }
}