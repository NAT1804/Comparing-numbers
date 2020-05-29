var sceneConfig = {
    key: 'mainScreen',
    pack: {
        files: [{
            type: 'plugin',
            key: 'rexwebfontloaderplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js',
            start: true
        }]
    }
};

class MainScreen extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);

        var configFont = {
            google: {
                families: ['PT Sans', 'Noto Sans']
            }
        };
        this.load.rexWebFont(configFont);

        // load images
        this.load.image('mainBox', 'assets/images/mainBox.png');
        this.load.image('greenBall', 'assets/images/greenBall.png');
        this.load.image('bar', 'assets/images/bar.png');
        this.load.image('head', 'assets/images/head.png');
        this.load.image('body', 'assets/images/body.png');
        this.load.image('track', 'assets/images/track.png');
        this.load.image('circle', 'assets/images/circle.png');
        this.load.image('elip', 'assets/images/elip.png');
        this.load.spritesheet('colortracck', 'asssets/images/colortrack.png', {
            frameWidth: 118,
            frameHeight: 26
        })
       
    }

    create() {
        // box 
        this.box = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY-75, 'mainBox');

        // back button
        this.backButton = this.add.text(277, 23, 'Back', {
            fontFamily: 'Noto Sans',
            color: '#5280b7',
            fontSize: '18px'
        });
        var color1 = '#83d5d4';
        var color2 = '#5280b7';
        this.backButton.on('pointerover', () => { this.backButton.setColor(color1); }).setInteractive({cursor: 'pointer'});
        this.backButton.on('pointerout', () => { this.backButton.setColor(color2); }).setInteractive({cursor: 'pointer'});

        // bar
        this.bar = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY-356, 'bar');

        // green ball
        var posXGreenBall1 = 479;
        var posYGreenBall = 21;
        this.arrayGreenBall = new Array('greenBall');
        for (let i=0; i<3; ++i) {
            this.arrayGreenBall[i] = this.add.image(posXGreenBall1 += 23, posYGreenBall, 'greenBall').setOrigin(0, 0);
        }

        // language
        this.language = this.add.text(1110, 23, 'English', {
            fontFamily: 'Noto Sans',
            color: '#5280b7',
            fontSize: '18px'
        });
        this.language.on('pointerover', () => { this.language.setColor(color1); }).setInteractive({cursor: 'pointer'});
        this.language.on('pointerout', () => { this.language.setColor(color2); }).setInteractive({cursor: 'pointer'});

        //track
        this.track1 = this.add.image(this.cameras.main.centerX-180, this.cameras.main.centerY+120, 'track');
        this.track2 = this.add.image(this.cameras.main.centerX+183, this.cameras.main.centerY+120, 'track');

        this.initial();

        // drag object
		this.input.on('pointerdown', this.startDrag, this);

    }

    initial() {
        this.head = this.add.image(this.cameras.main.centerX-313, this.cameras.main.centerY+83, 'head');
    }

    update() {

    }
}