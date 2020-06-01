const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth);
const DEFAULT_HEIGHT = 774.4;
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT;

const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    },
    // width: 1457.6,
    // height: 774.4,    
    backgroundColor: '#ffffff',
    scene: [MainScreen],
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    }
  }
  
  var game = new Phaser.Game(config);