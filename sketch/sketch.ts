
let game:CryptoHomieGame;

// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");
  game = new CryptoHomieGame();
  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(30);
  ImagePreloader.loadImages();
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  
   // CLEAR BACKGROUND
  background(125);
  game.draw()
}