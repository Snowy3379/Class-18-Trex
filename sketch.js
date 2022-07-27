var score = 0
var trex, ground
var trexImg
var groundImg
var invisibleGround
var cloud
var cloudImg
var obstacle
var ob1, ob2, ob3, ob4, ob5, ob6
var cloudGroup, obstacleGroup
var PLAY = 1
var END = 0
var gameState = PLAY
var trexdeadImg
var gameOver, gameOverImg
var restart, restartImg
var dieSound, jumpSound

function preload() {
    trexImg = loadAnimation("trex1.png", "trex3.png", "trex4.png");
    groundImg = loadImage("ground2.png")
    cloudImg = loadImage("cloud.png")
    ob1 = loadImage("obstacle1.png")
    ob2 = loadImage("obstacle2.png")
    ob3 = loadImage("obstacle3.png")
    ob4 = loadImage("obstacle4.png")
    ob5 = loadImage("obstacle5.png")
    ob6 = loadImage("obstacle6.png")
    trexdeadImg = loadImage("trex_collided.png")
    gameOverImg = loadImage("gameOver.png")
    restartImg = loadImage("restart.png")
    dieSound = loadSound("die.mp3")
    jumpSound = loadSound("jump.mp3")
}

function setup() {
    createCanvas(windowWidth, windowHeight)

    trex = createSprite(50, height - 120, 20, 50)
    trex.addAnimation("tr", trexImg)
    trex.addAnimation("td", trexdeadImg)
    trex.scale = 0.6

    gameOver = createSprite(300, 75)
    gameOver.addImage(gameOverImg)
    gameOver.scale = 1.8

    restart = createSprite(300, 120)
    restart.addImage(restartImg)
    restart.scale = 0.5

    ground = createSprite(width / 2, height - 100, width, 20)
    ground.addImage("g", groundImg)

    invisibleGround = createSprite(width / 2, height - 95, width, 20)
    invisibleGround.visible = false

    var r = Math.round(random(10, 55))
    console.log(r)

    cloudGroup = new Group()
    obstacleGroup = new Group()
}

function draw() {
    background(150)
    fill("blue")
    textSize(15)
    text("Score:" + score, 520, 20)
    trex.collide(invisibleGround)

    if (gameState == PLAY) {
        ground.velocityX = -2
        score = score + 1

        if (ground.x < 0) {
            ground.x = ground.width / 2
        }
        if (touches.length > 0 || keyDown("space") && trex.y > height - 140) {
            trex.velocityY = -10
            // console.log(trex.y)
            touches = [];
        }
        trex.velocityY += 0.5

        if (frameCount % 150 == 0) {
            spawnObstacles();
        }

        if (frameCount % 60 == 0) {
            spawnClouds();
        }
        if (trex.isTouching(obstacleGroup)) {
            gameState = END
            dieSound.play()
        }
        gameOver.visible = false;
        restart.visible = false;
    } else if (gameState == END) {
        ground.velocityX = 0;
        obstacleGroup.setVelocityXEach(0);
        cloudGroup.setVelocityXEach(0);
        trex.changeAnimation("td")
        obstacleGroup.setLifetimeEach(-1)
        cloudGroup.setLifetimeEach(-1)
        gameOver.visible = true;
        restart.visible = true;
        if (mousePressedOver(restart)) {
            restartGame()
        }
    }
    //trex.debug = true;
    trex.setCollider("circle", 0, 0, 30);
    // Adding AI

    drawSprites();
}

function spawnClouds() {
    cloud = createSprite(width, 100, 40, 20)
    cloud.addImage(cloudImg)
    cloud.velocityX = -3
    cloud.scale = 0.75
    cloud.y = Math.round(random(10, 60))
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1
    cloud.lifetime = -width / cloud.velocityX;
    cloudGroup.add(cloud)
}

function spawnObstacles() {
    obstacle = createSprite(width, height - 90, 40, 10)
    var r = Math.round(random(1, 6))
    obstacle.scale = 0.6
    switch (r) {
        case 1:
            obstacle.addImage(ob1);
            console.log("1")
            break;
        case 2:
            obstacle.addImage(ob2);
            console.log("2")
            obstacle.scale = 0.58
            break;
        case 3:
            obstacle.addImage(ob3)
            console.log("3")
            obstacle.scale = 0.55
            break;
        case 4:
            obstacle.addImage(ob4)
            console.log("4")
            break;
        case 5:
            obstacle.addImage(ob5)
            console.log("5")
            break;
        case 6:
            obstacle.addImage(ob6)
            console.log("6")
            obstacle.scale = 0.4
            break;
    }
    obstacle.velocityX = -3
    obstacle.lifetime = -width / obstacle.velocityX;
    obstacleGroup.add(obstacle)
}

function restartGame() {
    gameState = PLAY
    gameOver.visible = false
    restart.visible = false
    obstacleGroup.destroyEach()
    cloudGroup.destroyEach()
    trex.changeAnimation("tr")
    score = 0
}
