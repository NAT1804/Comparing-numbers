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

var arrayBody;
var arrayElip;
var arrayNumber;
var arrContainer;
var containerHead;

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
            frameHeight: 33
        });
        this.load.image('khungfinish', 'assets/images/finishbutton.png');
        this.load.spritesheet('finishbutton', 'assets/images/finishbutton.png', {
            frameWidth: 492,
            frameHeight: 87
        });
        this.load.spritesheet("explosion", "assets/images/explosion.png", {
			frameWidth: 16,
			frameHeight: 16
        });
        this.load.image('cell', 'assets/images/background4.png');
        this.load.image('color', 'assets/images/background3.png');
        this.load.image('grad', 'assets/images/background1.jpg');
        this.load.image('stuff', 'assets/images/background2.png');
        this.load.spritesheet('start', 'assets/images/buttonStart.png', {
            frameWidth: 112,
            frameHeight: 113
        });
    }

    create() {
        // background
        var grad = this.add.image(0, 0, 'grad').setOrigin(0, 0).setScale(3.0);
        for (let i=0; i<2; ++i) {
            for (let j=0; j<2; ++j) {
                var color = this.add.image(0+1000*j, 0+1000*i, 'color').setOrigin(0, 0);
            }
        }
        for (let i=0; i<30; ++i) {
            for (let j=0; j<16; ++j) {
                var cell = this.add.image(50*j, 50*i, 'cell').setOrigin(0, 0);
            }
        }

        for (let i=0; i<8; ++i) {
            for (let j=0; j<8; ++j) {
                var stuff = this.add.image(250*j, 150*i, 'stuff').setOrigin(0, 0);
            }
        }

        // box 
        this.box = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY-75, 'mainBox');

        // back button
        this.backButton = this.add.text(277, 23, '< Back', {
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
        var posXGreenBall1 = 468;
        var posYGreenBall = 21;
        this.arrayGreenBall = new Array('greenBall');
        for (let i=0; i<3; ++i) {
            this.arrayGreenBall[i] = this.add.image(posXGreenBall1 += 23, posYGreenBall, 'greenBall').setOrigin(0, 0);
        }

        // status green ball
        for (let i=0; i<2; ++i) {
            this.arrayGreenBall[i].statusRight = false;
            this.arrayGreenBall[i].statusLeft = false;
        }
        this.arrayGreenBall[2].statusRight = true;
        this.arrayGreenBall[2].statusLeft = false;

        // language
        this.language = this.add.text(1110, 23, 'English', {
            fontFamily: 'Noto Sans',
            color: '#5280b7',
            fontSize: '18px'
        });
        this.language.on('pointerover', () => { this.language.setColor(color1); }).setInteractive({cursor: 'pointer'});
        this.language.on('pointerout', () => { this.language.setColor(color2); }).setInteractive({cursor: 'pointer'});
        
        // init
        this.initial();

        // drag object
        this.input.on('pointerdown', this.startDrag, this);
        
        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // });

        // explosion animation 
        this.anims.create({
			key: "explode",
			frames: this.anims.generateFrameNumbers("explosion"),
			frameRate: 5, // 5 frames per second
			repeat: 0,
			hideOnComplete: true
        });
        
        //disable interactive object
		this.time.addEvent({
			delay: 0,
			callback: () => {
				for (let i=0; i<5; ++i) {
                    arrContainer[i].disableInteractive();
                }
			}
		});

        // start button
        this.time.addEvent({
            delay: 0,
            
			callback: () => {
                var graphics = this.add.graphics();
                //var circle = new Phaser.Geom.Circle(700, 400, 200);
                graphics.fillStyle(0xfdf8fc, 0.7);
                graphics.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY-90, 160);
                graphics.fillStyle(0xf8e5f5, 0.7);
                graphics.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY-90, 120);
                // var color = '#fdf8fc'
                // var circle1 = this.add.circle(this.cameras.main.centerX, this.cameras.main.centerY-90, 150, color);
                // circle1.tint = 0xfdf8fc;
                // var circle2 = this.add.circle(this.cameras.main.centerX, this.cameras.main.centerY-90, 130, '#f8e5f5');

                this.startButton = this.add.sprite(this.cameras.main.centerX+20, this.cameras.main.centerY-90, 'start').setInteractive({
                    cursor: 'pointer',
                    hitArea: new Phaser.Geom.Circle(0, 0, 160),
                    hitAreaCallback: Phaser.Geom.Circle.Contains
                });
                this.textStart = this.add.text(this.cameras.main.centerX-20, this.cameras.main.centerY-100, 'start', {
                    fontFamily: 'Noto Sans',
                    color: '#ffffff',
                    fontSize: '18px'
                });
                
		
				this.startButton.on('pointerover', () => {
                    graphics.clear();
                    this.startButton.setFrame(1);
                    graphics.fillStyle(0xfdf8fc, 0.7);
                    graphics.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY-90, 170);
                    graphics.fillStyle(0xf8e5f5, 0.7);
                    graphics.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY-90, 130);
                });
				this.startButton.on('pointerout', () => {
                    graphics.clear();
                    this.startButton.setFrame(0);
                    graphics.fillStyle(0xfdf8fc, 0.7);
                    graphics.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY-90, 160);
                    graphics.fillStyle(0xf8e5f5, 0.7);
                    graphics.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY-90, 120);
                });
				this.startButton.on('pointerdown', () => {
                    graphics.clear();
					this.textStart.destroy();
					this.startButton.destroy();
					for (let i=0; i<5; ++i) {
                        arrContainer[i].setInteractive(new Phaser.Geom.Circle(50, 50, 60), Phaser.Geom.Circle.Contains);
                    }
				});
			}
		});

    }

    initial() {
        this.time.addEvent({
			delay: 0,
			callback: () => {
                //header
                var header = this.add.text(333, 72, "Put the train cars from smaller to greater", { 
                    color: '#000000',
                    fontSize: '45px',
                    fontFamily: 'PT Sans'
                });

				// The number of turns it takes for a green ball to run to the right
				this.count = 0;
				// if checkFalse = true green ball can run to the left else green ball can't run to the left
                this.checkFalse = true;
                
                //track
                this.track1 = this.add.image(this.cameras.main.centerX-180, this.cameras.main.centerY+120, 'track');
                this.track2 = this.add.image(this.cameras.main.centerX+180, this.cameras.main.centerY+120, 'track');

                // color track 
                var posXColorTrack = 357;
                var posYColorTrack = 488;
                this.arrayColorTrack = new Array('colortrack');
                for (let i=0; i<5; ++i) {
                    this.arrayColorTrack[i] = this.add.sprite(posXColorTrack += 127, posYColorTrack, 'colortrack').setOrigin(0, 0);
                }
                this.arrayColorTrack[0].setFrame(0);
                for (let i=1; i<5; ++i) {
                    this.arrayColorTrack[i].setFrame(2);
                }
				//status color track
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
                arrayBody = new Array('body');
                for (let i=0; i<5; ++i) {
                    arrayBody[i] = this.add.image(40, 82, 'body');
                }

                // elip of train body
                arrayElip = new Array('elip');
                for (let i=0; i<5; ++i) {
                    arrayElip[i] = this.add.image(40, 22, 'elip');
                }
            
                // number of train body
                arrayNumber = [];
                for (let i=0; i<5; ++i) {
                    arrayNumber[i] = this.add.text(0, 0, Phaser.Math.Between(100+100*i, 200+100*i), {
                        color: '#000000',
                        fontSize: '45px',
                        fontFamily: 'PT Sans'
                    })
                }

                // container
                var posXContainer = 150;
                var posYContainer = 100;
                arrContainer = new Array();
                for (let i=4; i>=0; --i) {
                    arrContainer[i] = this.add.container(posXContainer += 180, posYContainer += 50, [arrayBody[i], arrayElip[i], arrayNumber[i]] );
                    arrContainer[i].setInteractive(new Phaser.Geom.Circle(50, 50, 60), Phaser.Geom.Circle.Contains); 
                    this.input.setDraggable(arrContainer[i]);
                }
                // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                //     gameObject.x = dragX;
                //     gameObject.y = dragY;
                // });

				//train head
				var head = this.add.image(-8, 85, 'head');
                var circle = this.add.image(10, 22, 'circle');
                var headNumber = this.add.text(0, 0, '0', {
                    color: '#000000',
                    fontSize: '45px',
                    fontFamily: 'PT Sans'
                });
                containerHead = this.add.container(424, 387, [head, circle, headNumber]);
                // containerHead.setInteractive(new Phaser.Geom.Circle(50, 50, 60), Phaser.Geom.Circle.Contains);
                // containerHead.setInteractive({cursor: 'pointer'});
                // this.input.setDraggable(containerHead);

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

		this.checkResult();
	}

    changeColor() {
		if (this.dragObject != null) {
            for (let i=0; i<5; ++i) {
                if (this.arrayColorTrack[i].status == true) {
                    if (this.dragObject.x >= 435+135*i && this.dragObject.x <= 570+135*i && this.dragObject.y > 350 && this.dragObject.y < 520) {
                        this.arrayColorTrack[i].setFrame(1);
                    } 
                    else {
                        this.arrayColorTrack[i].setFrame(0);    
                    }
                }
            }
		}
	}

    checkResult() {
		if (this.dragObject != null) {
            for (let i=0; i<5; ++i) {
                
                if (this.dragObject.x >= 435+135*i && this.dragObject.x <= 570+135*i && this.dragObject.y > 350 && this.dragObject.y < 520 && this.arrayColorTrack[i].status == true) {
                    if (i != 4) {
                        this.checkTurn(i+1, arrContainer[i], this.arrayColorTrack[i], this.arrayColorTrack[i+1]);
                    }
                    else {
                        if (this.count > 0) this.count--;
                        this.checkFalse = true;
                        this.arrayColorTrack[i].setFrame(0);
                        arrContainer[i].x = 1003; 
                        arrContainer[i].y = 390;
                        
                        arrContainer[i].disableInteractive();
                        this.arrayColorTrack[i].status = false;
                        this.explosion = this.add.sprite(362, 400,"explosion").setScale(2.0);
                        this.explosion.play('explode');
                        this.time.addEvent({
                            delay: 1000,
                            callback: () => {
                                for (let i=0; i<5; ++i) {
                                    this.arrayColorTrack[i].destroy();
                                }
                            
                                if (this.count == 0) {
                                    for (let i=0; i<3; ++i) {
                                        if (this.arrayGreenBall[i].statusRight) {
                                            if (i ==0) {
                                                this.greenBallMoveRight(this.arrayGreenBall[i], i);
                                                this.arrayGreenBall[i].statusRight = false;
                                                this.arrayGreenBall[i].statusLeft = true;
                                                this.end = true;
                                                this.time.addEvent({
                                                    delay: 5000,
                                                    callback: () => {
                                                        this.scene.start('mainScreen');
                                                    }
                                                });
                                            } else if (i == 2) {
                                                this.greenBallMoveRight(this.arrayGreenBall[i], i);
                                                this.arrayGreenBall[i].statusRight = false;
                                                this.arrayGreenBall[i].statusLeft = true;
                                                this.arrayGreenBall[i-1].statusRight = true;
                                                this.arrayGreenBall[i-1].statusLeft = false;
                                            } else {
                                                this.greenBallMoveRight(this.arrayGreenBall[i], i);
                                                this.arrayGreenBall[i].statusRight = false;
                                                this.arrayGreenBall[i].statusLeft = true;
                                                this.arrayGreenBall[i+1].statusLeft = false;
                                                this.arrayGreenBall[i-1].statusRight = true;
                                            }
                                        }
                                    }
                                }
                                this.trainMove();
                                
                            },
                            loop: false
                        });	
                        
                    }
                }
            }

		}
	}

    checkTurn(numberOfTurn, container, colorTrack, colorTrack2/*greenBall4, greenBall3, greenBall2, greenBall1*/) {
		if (this.dragObject == container) {
			colorTrack.setFrame(0);
			container.x = 503 + 125*(numberOfTurn-1); // vị trí của toa tàu được đạt vào đường ray khi chọn đúng toa tàu
			container.y = 390;
			container.disableInteractive();
			colorTrack2.setFrame(0);
			colorTrack.status = false;
			colorTrack2.status = true;
		} else {
			if (this.count == 0) this.count+=2;
			if (this.checkFalse == true) {
                for (let i = 2; i>=1; --i) {
                    if (this.arrayGreenBall[i].statusLeft) {
                        this.greenBallMoveLeft(this.arrayGreenBall[i], i);
                        this.arrayGreenBall[i].statusLeft = false;
                        this.arrayGreenBall[i].statusRight = true;
                        this.arrayGreenBall[i-1].statusRight = false;
                    }
                }
				
				this.checkFalse = false; // sai nhieu lan trong 1 luot nhung chi co 1 qua bong xanh bi di chuyen tu trai sang phai
			}
			colorTrack.setFrame(3);
			this.dragObject.x = 503 + 125*(numberOfTurn-1);
			this.dragObject.y = 390;

			var objectTurnBack = this.time.addEvent({
				delay: 1000,
				callback: () => {
                    this.dragObject.y -= 150; // toa tàu bị sai vị trí được dịch chuyển lên trên
                    colorTrack.setFrame(0);
				},
				loop: false
			});

		}
	}

    trainMove() {
		var move = this.time.addEvent({
			delay: 0,
			callback: () => {
				if (arrContainer[4].x < -100) {
					move.remove();
					this.stopTrain();
				}
				containerHead.x -= 5;   // 5 la van toc di chuyen 
				arrContainer[0].x -= 5; // 5 la van toc di chuyen
				arrContainer[1].x -= 5; // 5 la van toc di chuyen
				arrContainer[2].x -= 5; // 5 la van toc di chuyen
				arrContainer[3].x -= 5; // 5 la van toc di chuyen
				arrContainer[4].x -= 5; // 5 la van toc di chuyen
			},
			loop: true
		});
	}

	stopTrain() {
		containerHead.destroy();
		arrContainer[0].destroy();
		arrContainer[1].destroy();
		arrContainer[2].destroy();
		arrContainer[3].destroy();
		arrContainer[4].destroy();
		if(this.end == false) this.initial();
	}

    greenBallMoveRight(ball, i){
		var run = this.time.addEvent({
			delay: 0,
			callback: () => { 
				if (i == 2) {
					if (ball.x > 909) run.remove(); // giới hạn dừng lại của quả bóng xanh
				}
				else if (i == 1) {
					if (ball.x > 886) run.remove(); // giới hạn dừng lại của quả bóng xanh
				}
				else if (i == 0) {
					if (ball.x > 863) run.remove(); // giới hạn dừng lại của quả bóng xanh
				}
				ball.x += 10;
			},
			loop: true
		});
	}

	greenBallMoveLeft(ball, i){
		var run = this.time.addEvent({
			delay: 0,
			callback: () => {
				if (i == 2) {
					if (ball.x < 556) run.remove(); // giới hạn dừng lại của quả bóng xanh
				}
				else if (i == 1) {
					if (ball.x < 533) run.remove(); // giới hạn dừng lại của quả bóng xanh
				}
				
				ball.x -= 10;
			},
			loop: true
		});
	}

    update() {

    }
}
