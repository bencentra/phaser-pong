(function(Phaser) {

  // Constants
  var STAGE_W = 800;
  var STAGE_H = 600;

  // Game "actors" and properties
  var game, paddleL, paddleR, ball;
  var STAGE_W = 800;
  var STAGE_H = 600;
  var PADDLE_W = 24;
  var PADDLE_H = 72;
  var PADDLE_Vy = 250;
  var BALL_W = 24;
  var BALL_Vx = 150;
  var BALL_Vy = 50;

  // Game instance
  var game = new Phaser.Game(STAGE_W, STAGE_H, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

  /*
  * Preload game assets
  */
  function preload() {
    game.load.image('red-paddle', 'assets/red-paddle.png');
  	game.load.image('blue-paddle', 'assets/blue-paddle.png');
  	game.load.image('ball', 'assets/ball.png');
  }

  /*
  * Initialize actors and game state
  */
  function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
  	paddleL = game.add.sprite(10, (STAGE_H / 2) - (PADDLE_H / 2), 'red-paddle');
  	paddleR = game.add.sprite(STAGE_W - PADDLE_W - 10, (STAGE_H / 2) - (PADDLE_H / 2), 'blue-paddle');
  	ball = game.add.sprite(STAGE_W/2, STAGE_H/2, 'ball');

  	game.physics.arcade.enable(paddleL);
  	paddleL.body.immovable = true;
  	game.physics.arcade.enable(paddleR);
  	paddleR.body.immovable = true;
  	game.physics.arcade.enable(ball);

  	// Initial ball velocity
  	ball.body.velocity.x = BALL_Vx;
  	ball.body.velocity.y = BALL_Vy;
  }

  /*
  * Update the game state on each frame
  */
  function update() {
    // Move the paddles
  	handleInput(paddleL, Phaser.Keyboard.W, Phaser.Keyboard.S);
  	handleInput(paddleR, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN);

  	// Ball collision
  	if (game.physics.arcade.collide(ball, paddleL)) {
  		 handleCollision(ball, 'left');
  	}
  	if (game.physics.arcade.collide(ball, paddleR)) {
  		handleCollision(ball, 'right');
  	}
  }

  function handleInput(paddle, up, down) {
  	if (game.input.keyboard.isDown(up)) {
  		paddle.body.velocity.y = PADDLE_Vy * -1;
  	} else if (game.input.keyboard.isDown(down)) {
  		paddle.body.velocity.y = PADDLE_Vy;
  	} else {
  		paddle.body.velocity.y = 0;
  	}
  	if (paddle.y < 0) {
  		paddle.body.position.y = 0;
  		paddle.body.velocity.y = 0;
  	} else if (paddle.y > STAGE_H - PADDLE_H) {
  		paddle.body.position.y = STAGE_H - PADDLE_H;
  		paddle.body.velocity.y = 0;
  	}
  }

  function handleCollision(ball, direction) {
  	console.log('collision', direction);
  }

})(Phaser);
