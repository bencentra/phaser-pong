(function(Phaser) {
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  var game = new Phaser.Game(config);
  var redPaddle; // AI paddle
  var redScore = 0;
  var redScoreText;
  var redPaddleSpeed = 150;
  var bluePaddle; // Player paddle
  var blueScore = 0;
  var blueScoreText;
  var ball;
  var cursors;

  var ballDirectionX;
  var ballDirectionY;
  var ballSpeedX;
  var ballSpeedY;

  function preload() {
    this.load.image('ball', './assets/ball.png');
    this.load.image('red-paddle', './assets/red-paddle.png');
    this.load.image('blue-paddle', './assets/blue-paddle.png');
  }

  function create() {
    // Create the sprites
    redPaddle = this.physics.add.sprite(30, 300, 'red-paddle');
    redPaddle.setData('name', 'red-paddle');
    redPaddle.setCollideWorldBounds(true);
    redPaddle.setImmovable(true);
    bluePaddle = this.physics.add.sprite(770, 300, 'blue-paddle');
    bluePaddle.setData('name', 'blue-paddle');
    bluePaddle.setCollideWorldBounds(true);
    bluePaddle.setImmovable(true);
    ball = this.physics.add.sprite(0, 0, 'ball');
    ball.setCollideWorldBounds(true);
    resetBall();
    // Set the ball's physics
    ball.setBounce(1);
    ball.setVelocityX(ballSpeedX);
    ball.setVelocityY(ballSpeedY);
    // Make the ball collide with the paddles
    this.physics.add.collider(redPaddle, ball, handleBounce, null, this);
    this.physics.add.collider(bluePaddle, ball, handleBounce, null, this);
    // Allow simple arrow key input
    cursors = this.input.keyboard.createCursorKeys();
    // Display the scores
    redScoreText = this.add.text(100, 30, 'Score: ' + redScore, { color: 'red' });
    blueScoreText = this.add.text(600, 30, 'Score: ' + redScore, { color: 'blue' });


  }

  function update() {
    // Move the player
    if (cursors.up.isDown) {
      bluePaddle.setVelocityY(-250);
    } else if (cursors.down.isDown) {
      bluePaddle.setVelocityY(250);
    } else {
      bluePaddle.setVelocityY(0);
    }
    // Move the AI
    if (redPaddle.body.position.y >= ball.body.position.y) {
      redPaddle.setVelocityY(redPaddleSpeed * -1);
    } else if (redPaddle.body.position.y < ball.body.position.y) {
      redPaddle.setVelocityY(redPaddleSpeed);
    } else {
      redPaddle.setVelocityY(0);
    }
    // Score
    if (ball.body.position.x > 770) {
      resetBall();
      redScore++;
      redScoreText.setText('Score: ' + redScore);
    } else if (ball.body.position.x < 30) {
      resetBall();
      blueScore++;
      blueScoreText.setText('Score: ' + blueScore);
      redPaddleSpeed += 50;
    } else {
      if (redScore === 10 || blueScore === 10) {
        this.physics.pause();
      }
    }
  }

  function resetBall() {
    ball.setPosition(400, 300);
    ballDirectionX = (Math.random() > 0.5) ? 1 : -1;
    ballDirectionY = (Math.random() > 0.5) ? 1 : -1;
    ballSpeedX = 200 * ballDirectionX;
    ballSpeedY = 100 * ballDirectionY;
    ball.setVelocity(ballSpeedX, ballSpeedY);
  }

  function handleBounce(paddle) {
    // Increase the ball speed
    var tmpSpeedX = ball.body.velocity.x;
    if (tmpSpeedX < 0) {
      tmpSpeedX -= 50;
    } else {
      tmpSpeedX += 50;
    }
    ball.setVelocityX(tmpSpeedX);
    // Add some "spin"
    var tmpSpeedY = ball.body.velocity.y;
    if (ball.body.position.y < paddle.body.position.y) {
      tmpSpeedY -= 50;
    } else {
      tmpSpeedY += 50;
    }
    ball.setVelocityY(tmpSpeedY);
  }
})(Phaser);
