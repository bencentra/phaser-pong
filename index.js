(function(Phaser) {

  // Game "actors" and properties
  var game, paddleL, paddleR, ball;
  var PADDLE_W = 24;
  var PADDLE_H = 72;
  var PADDLE_Vy = 250;
  var BALL_W = 24;
  var BALL_Vx = 150;
  var BALL_Vy = 50;

  // Scores
  var scoreL = 0;
  var scoreTextL = '';
  var scoreR = 0;
  var scoreTextR = '';

  // Game instance
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

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
  	paddleL = game.add.sprite(50, (game.world.centerY) - (PADDLE_H / 2), 'red-paddle');
  	paddleR = game.add.sprite(game.world.width - PADDLE_W - 50, (game.world.centerY) - (PADDLE_H / 2), 'blue-paddle');
  	ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');

  	game.physics.arcade.enable(paddleL);
  	paddleL.body.immovable = true;
  	game.physics.arcade.enable(paddleR);
  	paddleR.body.immovable = true;
  	game.physics.arcade.enable(ball);

  	// Initial ball velocity
  	ball.body.velocity.x = BALL_Vx;
  	ball.body.velocity.y = BALL_Vy;
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    // Score text
    scoreTextL = game.add.text(game.world.centerX - 100, 20, scoreL, { font: '24pt Arial', fill: '#BC0000' });
    scoreTextR = game.add.text(game.world.centerX + 100, 20, scoreR, { font: '24pt Arial', fill: '#0000BC' });
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
  		 handleCollision(ball, paddleL);
  	}
  	if (game.physics.arcade.collide(ball, paddleR)) {
  		handleCollision(ball, paddleR);
  	}

    // Scoring
    var scored = false;
    if (ball.body.position.x < 5) {
      scoreR += 1;
      scoreTextR.setText(scoreR);
      scored = 'right';
    } else if (ball.body.position.x + ball.body.width > game.world.width - 5) {
      scoreL += 1;
      scoreTextL.setText(scoreL);
      scored = 'left';
    }
    if (scored) {
      ball.body.position.x = game.world.centerX;
      ball.body.position.y = game.world.centerY;
      ball.body.velocity.x = BALL_Vx;
    	ball.body.velocity.y = BALL_Vy;
      if (scored === 'right') ball.body.velocity.x *= -1;
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
  	} else if (paddle.y > game.world.height - paddle.body.height) {
  		paddle.body.position.y = game.world.height - paddle.body.height;
  		paddle.body.velocity.y = 0;
  	}
  }

  function handleCollision(ball, paddle) {
    // Bounce and speed up the ball
    var tmpX = ball.body.velocity.x;
    ball.body.velocity.x = tmpX > 0 ? tmpX + 20 : tmpX - 20;
    // Add some "spin"
    if (paddle.body.velocity.y > 0) {
      ball.body.velocity.y += 20;
    } else if (paddle.body.velocity.y < 0) {
      ball.body.velocity.y -= 20;
    }
  }

})(Phaser);
