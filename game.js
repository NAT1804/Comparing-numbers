const config = {
    type: Phaser.AUTO,
    width: 1457.6,
    height: 774.4,    
    backgroundColor: '#ffffff',
    scene: [MainScreen],
    parent: 'phaser-example',
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    }
  }
  
  var game = new Phaser.Game(config);