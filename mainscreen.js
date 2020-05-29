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
        this.load.spritesheet('colortrack', 'assets/images/colortrack.png', {
            frameWidth: 133,
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

        // color track
        var posXColorTrack = 357;
        var posYColorTrack = 488;
        this.arrayColorTrack = new Array('colortrack');
        for (let i=0; i<5; ++i) {
            this.arrayColorTrack[i] = this.add.sprite(posXColorTrack += 127, posYColorTrack, 'colortrack').setOrigin(0, 0);
        }


        this.initial();

        // drag object
		this.input.on('pointerdown', this.startDrag, this);

    }

    initial() {
        this.time.addEvent({
			delay: 0,
			callback: () => {
                //header
                this.header = this.add.text(284, 85, "Order the train cars from smaller to greater", { 
                    color: '#000000',
                    fontSize: '45px',
                    fontFamily: 'PT Sans'
                });

				// The number of turns it takes for a green ball to run to the right
				this.count = 0;
				// if checkFalse = true green ball can run to the left else green ball can't run to the left
				this.checkFalse = true;
                // track 
                for (let i=0; i<5; ++i) {
                    this.arrayColorTrack[i].setFrame(2);
                }
				//status track
				/*
				trạng thái của các đường ray
				nếu là true thì đường ray hiện tại cần được thêm toa tàu 
				false thì ngược lại
                */
                for (let i=0; i<5; ++i) {
                    this.arrayColorTrack[i].status = false;
                }
	
				// // number of train body
				// this.number1 = Phaser.Math.Between(1, 4); // số ngẫu nhiên trong khoảng từ 1 đến 4
				// this.number2 = Phaser.Math.Between(5, 8); // số ngẫu nhiên trong khoảng từ 5 đến 8
				// this.number3 = Phaser.Math.Between(9, 12); // số ngẫu nhiên trong khoảng từ 9 đến 12
				// this.number4 = Phaser.Math.Between(13, 16); // số ngẫu nhiên trong khoảng từ 13 đến 16
				// this.number5 = Phaser.Math.Between(17, 20); // số ngẫu nhiên trong khoảng từ 17 đến 20

				// // train body
				// /*
				// phan hard code bên dưới là khoảng vị trí ngẫu nhiên mà các toa tàu sẽ xuất hiện
				// */
				// this.trainBody5 = this.add.image(Phaser.Math.Between(414, 626), Phaser.Math.Between(200, 220), "body-train" + this.number5).setInteractive({cursor:'pointer'});
				// this.trainBody4 = this.add.image(Phaser.Math.Between(626, 838), Phaser.Math.Between(400, DEFAULT_HEIGHT/2+30), "body-train" + this.number4).setInteractive({cursor:'pointer'});
				// this.trainBody3 = this.add.image(Phaser.Math.Between(838, 1050), Phaser.Math.Between(200, 220), "body-train" + this.number3).setInteractive({cursor:'pointer'});
				// this.trainBody2 = this.add.image(Phaser.Math.Between(1050, 1262), Phaser.Math.Between(400, DEFAULT_HEIGHT/2+30), "body-train" + this.number2).setInteractive({cursor:'pointer'});
				// this.trainBody1 = this.add.image(Phaser.Math.Between(202, 414), Phaser.Math.Between(400, DEFAULT_HEIGHT/2+30), "body-train" + this.number1).setInteractive({cursor:'pointer'});
				// this.trainBody1.setScale(0.8);
				// this.trainBody2.setScale(0.8);
				// this.trainBody3.setScale(0.8);
				// this.trainBody4.setScale(0.8);
				// this.trainBody5.setScale(0.8);

				//train head
				this.head = this.add.image(this.cameras.main.centerX-313, this.cameras.main.centerY+83, 'head');
				
				//background bonus
				//this.backgroundBonus = this.add.image(0, 360, "backgroundBonus").setOrigin(0, 0).setScale(0.78);

				this.end = false;
			},
			loop: false
		});
        
    }

    startDrag(pointer, targets) {

    }

    update() {

    }
}