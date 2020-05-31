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
        
        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // });
    }

    initial() {
        this.time.addEvent({
			delay: 0,
			callback: () => {
                //header
                var header = this.add.text(313, 72, "Order the train cars from smaller to greater", { 
                    color: '#000000',
                    fontSize: '45px',
                    fontFamily: 'PT Sans'
                });

				// The number of turns it takes for a green ball to run to the right
				this.count = 0;
				// if checkFalse = true green ball can run to the left else green ball can't run to the left
				this.checkFalse = true;
                // track 
                this.arrayColorTrack[0].setFrame(0);
                for (let i=1; i<5; ++i) {
                    this.arrayColorTrack[i].setFrame(1);
                }
				//status track
				/*
				trạng thái của các đường ray
				nếu là true thì đường ray hiện tại cần được thêm toa tàu 
				false thì ngược lại
                */
                this.arrayColorTrack[0].status = true;
                for (let i=1; i<5; ++i) {
                    this.arrayColorTrack[i].status = false;
                }

				// train body
				/*
				phan hard code bên dưới là khoảng vị trí ngẫu nhiên mà các toa tàu sẽ xuất hiện
                */
               
                var arrayBody = new Array('body');
                for (let i=0; i<5; ++i) {
                    arrayBody[i] = this.add.image(40, 82, 'body');
                }

                // elip of train body
                // var posXElip = 0;
                // var posYElip = 0;
                var arrayElip = new Array('elip');
                for (let i=0; i<5; ++i) {
                    arrayElip[i] = this.add.image(40, 22, 'elip');
                }
            
                // number of train body
                // var posXNumber = 200;
                // var posYNumber = 100;
                var arrayNumber = [];
                for (let i=0; i<5; ++i) {
                    arrayNumber[i] = this.add.text(0, 0, Phaser.Math.Between(100, 200), {
                        color: '#000000',
                        fontSize: '45px',
                        fontFamily: 'PT Sans'
                    })
                }

                // container
                var posXContainer = 150;
                var posYContainer = 100;
                var container = new Array();
                for (let i=0; i<5; ++i) {
                    container[i] = this.add.container(posXContainer += 180, posYContainer += 50, [arrayBody[i], arrayElip[i], arrayNumber[i]] );
                    container[i].setInteractive(new Phaser.Geom.Circle(50, 50, 60), Phaser.Geom.Circle.Contains);
                    container[i].setInteractive({cursor: 'pointer'});
                    this.input.setDraggable(container[i]);
                }
                // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                //     gameObject.x = dragX;
                //     gameObject.y = dragY;
                // });

				//train head
				this.head = this.add.image(this.cameras.main.centerX-313, this.cameras.main.centerY+83, 'head');
                this.circle = this.add.image(this.cameras.main.centerX-295, this.cameras.main.centerY+20, 'circle');
                this.headNumber = this.add.text(this.cameras.main.centerX-305, this.cameras.main.centerY-2, '0', {
                    color: '#000000',
                    fontSize: '45px',
                    fontFamily: 'PT Sans'
                });

				//background bonus
				//this.backgroundBonus = this.add.image(0, 360, "backgroundBonus").setOrigin(0, 0).setScale(0.78);

				this.end = false;
			},
			loop: false
		});
        
    }

    startDrag(pointer, targets) {
		this.input.off('pointerdown', this.startDrag, this);
		this.dragObject = targets[0];
		this.input.on('pointermove', this.doDrag, this);
		this.input.on('pointerup', this.stopDrag, this);
	}

	doDrag(pointer) {
		if (this.dragObject != null) {
			this.dragObject.x = pointer.x-50;
			this.dragObject.y = pointer.y-50;
		}
		this.changeColor();
	}

	stopDrag() {
		this.input.on('pointerdown', this.startDrag, this);
		this.input.off('pointermove', this.doDrag, this);
		this.input.off('pointerup', this.stopDrag, this);

		//this.checkResult();
	}

    changeColor() {
		if (this.dragObject != null) {
            for (let i=0; i<5; ++i) {
                if (this.arrayColorTrack[i].status == true) {
                    if (this.dragObject.x >= 435+150*i && this.dragObject.x <= 570+150*i && this.dragObject.y > 350 && this.dragObject.y < 520) {
                        console.log('hello');
                        this.arrayColorTrack[i].setFrame(1);
                    } 
                    else {
                        this.arrayColorTrack[i].setFrame(0);    
                    }
                }
            }
			// // position 1
			// if (this.track2.status == true) {
			// 	if (this.dragObject.x > 350 && this.dragObject.x <= 550 && this.dragObject.y > DEFAULT_HEIGHT/2+50 && this.dragObject.y < DEFAULT_HEIGHT/4*3) {
			// 		this.track2.setFrame(2);
			// 	} 
			// 	else {
			// 		this.track2.setFrame(0);
			// 	}
			// }
			// // position 2
			// if (this.track3.status == true) {
			// 	if (this.dragObject.x > 550 && this.dragObject.x <= 725 && this.dragObject.y > DEFAULT_HEIGHT/2+50 && this.dragObject.y < DEFAULT_HEIGHT/4*3) {
			// 		this.track3.setFrame(2);
			// 	}
			// 	else {
			// 		this.track3.setFrame(0);
			// 	}				
			// }
			// // position 3
			// if (this.track4.status == true) {
			// 	if (this.dragObject.x > 725 && this.dragObject.x <= 940 && this.dragObject.y > DEFAULT_HEIGHT/2+50 && this.dragObject.y < DEFAULT_HEIGHT/4*3) {
			// 		this.track4.setFrame(2);
			// 	}
			// 	else {
			// 		this.track4.setFrame(0);
			// 	}	
			// }
			// // position 4
			// if (this.track5.status == true) {
			// 	if (this.dragObject.x > 940 && this.dragObject.x <= 1120 && this.dragObject.y > DEFAULT_HEIGHT/2+50 && this.dragObject.y < DEFAULT_HEIGHT/4*3) {
			// 		this.track5.setFrame(2);
			// 	}
			// 	else{
			// 		this.track5.setFrame(0);
			// 	}	
			// }
			// // position 5
			// if (this.track6.status == true) {
			// 	if (this.dragObject.x > 1120 && this.dragObject.x <= 1320 && this.dragObject.y > DEFAULT_HEIGHT/2+50 && this.dragObject.y < DEFAULT_HEIGHT/4*3) {
			// 		this.track6.setFrame(2);
			// 	}
			// 	else {
			// 		this.track6.setFrame(0);
			// 	}
			// }
			
		}
	}

    

    update() {

    }
}
