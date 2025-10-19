/*

The Game Project

Final

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var gameChar_world_x;

var groundX = -3000;
var groundY = 435;
var groundWidth = 30000;
var groundHeight = 50;

var isLeft;
var isRight;
var isPlummeting;
var isFalling;

var trees_x;
var treePos_y;
var clouds;
var cloud_y;
var cloud_size;

var collectables;
var canyons;
var platforms;

var cameraPosX;
var game_score;
var flagpole;
var lives;

var jumpSound;
var deathSound;
var backgroundMusic;
var pickupSound;



function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/bitjump.mp3');
    jumpSound.setVolume(0.07);

    deathSound = loadSound('assets/deathsound.mp3');
    deathSound.setVolume(0.1);

    backgroundMusic = loadSound('assets/white.mp3');
    backgroundMusic.setVolume(0.05);
   
    pickupSound = loadSound('assets/pickup.mp3');
    pickupSound.setVolume(0.5);
}

function Particle(x, y, ySpeed, xSpeed, size, color)
{
	this.x = x;
	this.y = y;
	this.ySpeed = ySpeed;
	this.xSpeed = xSpeed;
	this.size = size;
	this.color = color;
	this.age = 0;
	this.isOnGround = false; // Track if particle touched the ground

	this.drawParticle = function()
	{
		fill(this.color);
		noStroke();
		ellipse(this.x, this.y, this.size);
	}
	this.updateParticle = function(){
		if(!this.isOnGround){
			this.x += this.xSpeed;
			this.y += this.ySpeed;
			
            // Check if particle touched the ground rectangle
            if (this.y + this.size / 2 > groundY && this.x > groundX && this.x < groundX + groundWidth) 
				{
                this.y = groundY - this.size / 2;
                this.isOnGround = true; // Stop further movement
            	}
			// Check if the particle is on canyon top
            var inCanyon = false;
            for (var i = 0; i < canyons.length; i++) 
				{
                var canyon = canyons[i];
				if (this.y + this.size / 2 > floorPos_y - canyon.depth && this.y - this.size / 2 < floorPos_y &&
					this.x > canyon.x_pos && this.x < canyon.x_pos + canyon.width) 
					{
					inCanyon = true; // Particle is in a canyon area
					break;
					}
            	}
			if (inCanyon) {
                this.isOnGround = false; // Continue falling if in a canyon area
				this.xSpeed = 0;
            }
		}
		this.age++;	
	}
}

function Emitter(x,y, ySpeed, xSpeed, size, color)
{
	this.x = x;
	this.y = y;
	this.ySpeed = ySpeed;
	this.xSpeed = xSpeed;
	this.size = size;
	this.color = color;
	this.startParticles = 0;
	this.lifetime = 0;

	this.particles = []
	this.addParticle = function(){
		var p = new Particle(random(this.x - 5000, this.x + 5000), 
							random(this.y - 10, this.y - 20),  
							random(this.ySpeed - 1, this.ySpeed + 1), 
							random(this.xSpeed - 1, this.xSpeed + 1),
							random(this.size - 4, this.size + 4),
							this.color
		);
		return p;
	}
	this.startEmitter = function(startParticles, lifetime)
		{
			this.startParticles = startParticles;
			this.lifetime = lifetime;
			//start emitter with initial particles
			for(var i = 0; i < startParticles; i++)
			{
				this.particles.push(this.addParticle());
			}
		}
		this.updateParticles = function(){
			//iterate through particles and draw
			var deadParticles = 100
			for(var i = this.particles.length - 1; i >= 0; i--){
				this.particles[i].drawParticle();
				this.particles[i].updateParticle();

				if(this.particles[i].age > random(0, this.lifetime) && !this.particles[i].isOnGround)
				{
					this.particles.splice(i, 1);
				}
			}
			if(deadParticles > 0)
			{
				for(var i = 0; i < deadParticles; i++)
				{
					this.particles.push(this.addParticle());
				}
			}
		}
}

var emit;

function setup()
{
	createCanvas(1024, 576);
    backgroundMusic.loop();

	//x,y, ySpeed, xSpeed, size, color)
    emit = new Emitter(width/2, - 50, 1, 0.5, 4, color(255));
	emit.startEmitter(8000,8000);

	lives = 3;
	startGame();
}

function startGame()
{
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	cameraPosX = 0;
	gameChar_world_x = gameChar_x - cameraPosX;

	isLeft = false;
	isRight = false;
	isPlummeting = false;
	isFalling = false;

	collectables = 
	[
		{x_pos: -130, y_pos: 350, size: 35, isFound: false},
		{x_pos: 300, y_pos: 390, size: 35, isFound: false},
		{x_pos: 940, y_pos: 190, size: 35, isFound: false},
		{x_pos: 650, y_pos: 350, size: 35, isFound: false},
		{x_pos: 900, y_pos: 390, size: 35, isFound: false},
		{x_pos: 480, y_pos: 70, size: 30, isFound: false},
		{x_pos: 50, y_pos: 30, size: 30, isFound: false},
		{x_pos: 1700, y_pos: 300, size: 100, isFound: false}
	];

	canyons = 
	[
		{x_pos: 300, width: 100, depth: height - floorPos_y},
		{x_pos: 600, width: 140, depth: height - floorPos_y},
		{x_pos: 900, width: 80, depth: height - floorPos_y},
		{x_pos: 1500, width: 300, depth: height - floorPos_y}
	];

	platforms = [];
		platforms.push(createPlatforms(-20,floorPos_y - 120,130));
		platforms.push(createPlatforms(150,floorPos_y - 240,197));
		platforms.push(createPlatforms(425,floorPos_y - 320,100));
		platforms.push(createPlatforms(920,floorPos_y - 130,50));
		platforms.push(createPlatforms(1560,floorPos_y - 40,150));
	
	trees_x = [100, 430, 750, 1000, 1200, 2000, 1400, 2600];
	treePos_y = floorPos_y - 150;
	clouds_x = [200, 610, 1000, 1600];
	cloud_y = 120;
	cloud_size = 50;

	cameraPosX = 0;
	game_score = 0;
	flagpole = {isReached: false, x_pos: 1100}
}

function draw()
{
	cameraPosX = gameChar_x - width / 2;
	
	///////////DRAWING CODE////////// 
	for (var i = 0; i <= height; i++) 
	{
		var inter = map(i, 0, height, 0, 1);
		stroke(lerpColor(color(100, 150, 200), color(195, 226, 235), inter));
		line(0, i, width, i);
	}
	//background(195, 226, 235);

	noStroke();
	fill(34, 139, 34);
	rect(0, floorPos_y, width, height - floorPos_y);

	//scenery beginning
	push();
	translate(- cameraPosX, 0);
	drawClouds();
	drawMountains();
	drawTrees();

	emit.updateParticles();

	for(var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}

	for (var i = 0; i < collectables.length; i++) 
	{
        drawCollectable(collectables[i]);
        checkCollectable(collectables[i]);
		noStroke();
    }

	for (var i = 0; i < canyons.length; i++) 
	{
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	renderFlagpole();
	checkPlayerDie();
	drawGameChar();

	pop();

	fill(0);
	noStroke(1);
	text("score: " + game_score, 20, 32);

	if (lives < 1) 
{
    fill(255, 0, 0);
    textSize(32);
    text("Game over. Press R to restart.", width / 2 - 180, height / 2);
    noLoop();  // Stop the game loop
    return; 
}

if (flagpole.isReached) 
{
    fill(0, 255, 0);
    textSize(32);
    text("Level complete. Press R to restart level.", width / 2 - 240, height / 2);
    noLoop();  // Stop the game loop
    return; 
}

	drawLives();

	//Character movement set
	if (isLeft)
	{
		gameChar_x -= 4;
	}
	else
	{
		cameraPosX += 4
	}

	if (isRight)
		{
			gameChar_x += 4;
		}
		else
		{
			cameraPosX -= 4;
		}
	

	if(gameChar_y < floorPos_y)
		{
		var isContact = false;
		for(var i = 0; i < platforms.length; i++){
			if(platforms[i].checkContact(gameChar_x, gameChar_y))
			{
				isContact = true;
				break;
			}
		}
		if(!isContact)
		{
		gameChar_y += 4;
		isFalling = true;
		}
	}
	else
	{
		isFalling = false;
	}

	if(isPlummeting)
	{
		gameChar_y += 5;
	}

	if (!flagpole.isReached) 
	{
	checkFlagpole();
	}
}
	
	///////////INTERACTION CODE//////////
function keyPressed() {
    // Handle restart if game is over or level complete
    if (flagpole.isReached || lives < 1) {
        if (keyCode == 82) {  // R key
            if (lives < 1) {
                lives = 3;  // Reset lives for a new game
            }
            startGame();
            loop();  // Resume drawing
        }
        return;  // Ignore all other keys in end states
    }

    // Normal gameplay input
    if (keyCode == 32 && !isFalling && !isPlummeting && gameChar_y <= floorPos_y + 2) {
        if (!isFalling) {
            gameChar_y -= 170;
        }
        jumpSound.play();
    }
    if (keyCode == 37) {
        isLeft = true;
    }
    if (keyCode == 39) {
        isRight = true;
    }
}

function keyReleased()
{
	if (keyCode == 37)
	{
		isLeft = false;
	}

	else if(keyCode == 39)
	{
		isRight = false;
	}
}

function checkPlayerDie() 
{
    if (gameChar_y > height) 
    {  //Character falls below the canvas
        lives -= 1;
        deathSound.play();
        
        if (lives > 0) 
        {
            startGame();  // Restart the game
        }
        // Removed: else { noLoop(); } – handled in draw() now
    }
}

function drawGameChar()
{
	noStroke();

	if(isLeft && isFalling) //jumping-left code
	{                  
	fill(204, 153, 102);
	ellipse(gameChar_x, gameChar_y - 60, 22);

	fill(0, 0, 139);
	rect(gameChar_x - 9 , gameChar_y - 50, 18, 40);
	
	fill(200,130,40);
	rect(gameChar_x - 11, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 2, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x - 17, gameChar_y - 40, 10, 10);

	fill(200,130,40);
	rect(gameChar_x - 17, gameChar_y - 37, 6, -15);
	}
	else if(isRight && isFalling) //jumping-right code
	{               
	fill(204, 153, 102);
	ellipse(gameChar_x, gameChar_y - 60, 22);

	fill(0, 0, 139);
	rect(gameChar_x - 9 , gameChar_y - 50, 18, 40);
	
	fill(200,130,40);
	rect(gameChar_x - 11, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 2, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 7, gameChar_y - 40, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 11, gameChar_y - 37, 6, -15);
	}
	else if(isLeft)//walking left code
	{                
	fill(204, 153, 102);
	ellipse(gameChar_x, gameChar_y - 60, 22);

	fill(0, 0, 139);
	rect(gameChar_x - 9 , gameChar_y - 50, 18, 40);
	
	fill(200,130,40);
	rect(gameChar_x - 8, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x - 2, gameChar_y - 10, 10, 10);

	push();

	stroke(200,130,40);
  	strokeWeight(7);
	line(gameChar_x - 16, gameChar_y - 20, gameChar_x - 5, 
		gameChar_y - 37, gameChar_x + 100, gameChar_y - 1);
	
	pop();
	}

	else if(isRight)// walking right code
	{               
	fill(204, 153, 102);
	ellipse(gameChar_x, gameChar_y - 60, 22);

	fill(0, 0, 139);
	rect(gameChar_x - 9 , gameChar_y - 50, 18, 40);
	
	fill(200,130,40);
	rect(gameChar_x - 8, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x- 2, gameChar_y - 10, 10, 10);

	push();

	stroke(200,130,40);
  	strokeWeight(7);
	line(gameChar_x + 16, gameChar_y - 20, gameChar_x + 5, gameChar_y - 37, 
		gameChar_x + 1, gameChar_y - 1);
	
	pop();
	}
	else if(isFalling || isPlummeting) //jumping facing forwards code
	{                    
	fill(204, 153, 102);
	ellipse(gameChar_x, gameChar_y - 60, 22);

	fill(0, 0, 139);
	rect(gameChar_x - 12.5 , gameChar_y - 50, 25, 40);
	
	fill(200,130,40);
	rect(gameChar_x - 12, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 2, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 10, gameChar_y - 40, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 14, gameChar_y - 37, 6, -15);

	fill(200,130,40);
	rect(gameChar_x - 20, gameChar_y - 40, 10, 10);
	
	fill(200,130,40);
	rect(gameChar_x -20, gameChar_y - 20, 6, -10);
	}
	else //standing front facing code
	{	       
	fill(204, 153, 102);
	ellipse(gameChar_x, gameChar_y - 60, 22);

	fill(0, 0, 139);
	rect(gameChar_x - 12.5 , gameChar_y - 50, 25, 40);
	
	fill(200,130,40);
	rect(gameChar_x - 12, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 2, gameChar_y - 10, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 10, gameChar_y - 40, 10, 10);

	fill(200,130,40);
	rect(gameChar_x + 14, gameChar_y - 40, 6, 20);

	fill(200,130,40);
	rect(gameChar_x - 20, gameChar_y - 40, 10, 10);
	
	fill(200,130,40);
	rect(gameChar_x -20, gameChar_y - 20, 6, -10);
	}
}

function drawClouds()
{
	// drawing clouds loop
	for(var i = 0; i < clouds_x.length; i++)
	{
		fill(255, 255, 255);
		ellipse(clouds_x[i], cloud_y, cloud_size, cloud_size);
		ellipse(clouds_x[i] - 20, cloud_y, cloud_size * 0.75, cloud_size * 0.75);
		ellipse(clouds_x[i] + 20, cloud_y, cloud_size * 0.75, cloud_size * 0.75);
		ellipse(clouds_x[i] - 40, cloud_y + 30, cloud_size, cloud_size);
		ellipse(clouds_x[i], cloud_y + 30, cloud_size, cloud_size);
		ellipse(clouds_x[i] + 40, cloud_y + 30, cloud_size, cloud_size);
	}
}

function drawMountains() 
{
    var mountains = 
	[
		{ x: 100, size: 350 },
		{ x: 300, size: 130 },
		{ x: 500, size: 440 },
		{ x: 700, size: 280 },
		{ x: 900, size: 250 },
		{ x: 1100, size: 160 },
		{ x: 1300, size: 190 }
    ];

    //Mountain loop
    for (var i = 0; i < mountains.length; i++) 
	{
        var mtn = mountains[i];
        var mtnBaseWidth = mtn.size;
        var mtnHeight = mtn.size;

        // Draw the mountain
        fill(90, 70, 110);
        triangle(
            mtn.x, floorPos_y, // Base left
            mtn.x + mtnBaseWidth / 2, floorPos_y - mtnHeight, // Peak
            mtn.x + mtnBaseWidth, floorPos_y // Base right
        );
        // Draw snowcap
        fill(255, 255, 255);
        beginShape();
        vertex(mtn.x + mtnBaseWidth / 2, floorPos_y - mtnHeight); // Peak
        vertex(mtn.x + mtnBaseWidth / 3, floorPos_y - mtnHeight / 1.5); // Left side snowcap
        vertex(mtn.x + mtnBaseWidth / 2, floorPos_y - mtnHeight / 1.3); // Middle point
        vertex(mtn.x + 3 * mtnBaseWidth / 4.5, floorPos_y - mtnHeight / 1.5); // Right side snowcap
        endShape(CLOSE);
    }
}

function drawTrees()
{
	//Drawing trees + branches loop
	for(var i = 0; i < trees_x.length; i++)
	{
		fill(139, 69, 19);
		rect(trees_x[i], treePos_y, 60, 150);

		fill(0, 128, 0);
		triangle(trees_x[i] - 50, treePos_y + 50, trees_x[i] + 30, treePos_y - 50, trees_x[i] + 110, treePos_y + 50);
		triangle(trees_x[i] - 50, treePos_y, trees_x[i] + 30, treePos_y - 100, trees_x[i] + 110, treePos_y);
	}
}

function drawCanyon(t_canyon)
{
	checkCanyon(t_canyon);

	push();

	fill(101, 67, 33);
	noStroke();
	rect(t_canyon.x_pos, floorPos_y, t_canyon.width, t_canyon.depth);

	// Draw flames behind the ground
    drawFlames(t_canyon.x_pos - 150, t_canyon.width + 300 , t_canyon.depth - 380);

	pop();
}

function checkCanyon(t_canyon)
{
	if (gameChar_x > t_canyon.x_pos && gameChar_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) 
	{
        isPlummeting = true;
		isLeft = false;  
        isRight = false; 
    }

   		 //Control plummeting
    if (isPlummeting) 
	{
        gameChar_y += 0.8;
    }
}

function drawFlames(canyonXPos, canyonWidth, canyonDepth) 
{
    fill(255, 69, 0); // Base color for flames (Red-Orange)
    stroke(255, 0, 0); // Outline color for flames
    
    // Draw a simple flame shape
    beginShape();
    vertex(canyonXPos + canyonWidth * 0.4, floorPos_y - canyonDepth * 0.6);
    vertex(canyonXPos + canyonWidth * 0.45, floorPos_y - canyonDepth * 0.5 + random(-10, 10)); // Adding slight rumble
    vertex(canyonXPos + canyonWidth * 0.5, floorPos_y - canyonDepth * 0.55 + random(-10, 10)); // Adding slight rumble
    vertex(canyonXPos + canyonWidth * 0.55, floorPos_y - canyonDepth * 0.5 + random(-10, 10)); // Adding slight rumble
    vertex(canyonXPos + canyonWidth * 0.6, floorPos_y - canyonDepth * 0.6);
    vertex(canyonXPos + canyonWidth * 0.55, floorPos_y - canyonDepth * 0.65 + random(-10, 10)); // Adding slight rumble
    vertex(canyonXPos + canyonWidth * 0.45, floorPos_y - canyonDepth * 0.65 + random(-10, 10)); // Adding slight rumble
    endShape(CLOSE);
}

function drawCollectable(t_collectable) 
{
    checkCollectable(t_collectable);

	if (t_collectable.isFound == false) 
	{
        noStroke();
		// Draw the gift box
        fill(255, 0, 0);
        rect(t_collectable.x_pos - t_collectable.size / 2, t_collectable.y_pos - t_collectable.size / 2, t_collectable.size, t_collectable.size);

        // Draw the ribbon (horizontal)
        fill(255, 215, 0); 
        rect(t_collectable.x_pos - t_collectable.size / 2, t_collectable.y_pos - t_collectable.size / 10, t_collectable.size, t_collectable.size / 5);

        // Draw the ribbon (vertical)
        rect(t_collectable.x_pos - t_collectable.size / 10, t_collectable.y_pos - t_collectable.size / 2, t_collectable.size / 5, t_collectable.size);

        // Draw the bow on top
        fill(255, 215, 0);
        ellipse(t_collectable.x_pos, t_collectable.y_pos - t_collectable.size / 2, t_collectable.size / 3, t_collectable.size / 5);
        ellipse(t_collectable.x_pos, t_collectable.y_pos - t_collectable.size / 2 + 10, t_collectable.size / 3, t_collectable.size / 5);
    }
}

function checkCollectable(t_collectable) 
{
    var collectableRadius = t_collectable.size / 2;
    var characterWidth = 20; 
    var characterHeight = 70; 
	//Overlapping with character
    if (!t_collectable.isFound &&
        gameChar_x + characterWidth / 2 > t_collectable.x_pos - collectableRadius &&
        gameChar_x - characterWidth / 2 < t_collectable.x_pos + collectableRadius &&
        gameChar_y > t_collectable.y_pos - collectableRadius &&
        gameChar_y - characterHeight < t_collectable.y_pos + collectableRadius)
    {
        t_collectable.isFound = true;
		game_score += 1;
        pickupSound.play();
    }
}

function renderFlagpole()
{
	push();
	strokeWeight(5);
	stroke(169, 169, 169);
 	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 120);

	fill(255, 0, 0);
	noStroke();

	if(flagpole.isReached)
	{
		rect(flagpole.x_pos, floorPos_y - 120, 60, 40);
	}
	else
	{
		rect(flagpole.x_pos, floorPos_y - 50, 60, 40);
	}
	pop();
}

function checkFlagpole()
{

	var d = abs(gameChar_x - flagpole.x_pos);
	if (d < 25 && !flagpole.isReached && gameChar_y > floorPos_y - 120) 
	{ 
        flagpole.isReached = true;
    }
}

function drawLives() 
{		//lives following camera movement
    var lifeSize = 30;
    var lifeSpacing = 40;
    var startX = 30;
    var startY = 65;

    // Draw lives
    for (var i = 0; i < lives; i++) 
	{
        drawHeart(startX + i * lifeSpacing, startY, lifeSize);
    }
}

function drawHeart(x, y, size) 
{
    fill(255, 0, 0);
    stroke(0);
    strokeWeight(1);

    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 4, x, y + size);
    bezierVertex(x + size, y + size / 4, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}

function createPlatforms(x, y, length)
{
	var p = 
	{
		x: x,
		y: y,
		length: length,
		draw: function()
		{
			fill(128, 128, 128);
			stroke(96, 96, 96);
			strokeWeight(2);
			rect(this.x, this.y, this.length, 20);
				// Draw the edges
			noFill();
			rect(this.x_pos, this.y_pos, this.width, this.height);
			line(this.x_pos, this.y_pos, this.x_pos + this.width, this.y_pos);
			line(this.x_pos, this.y_pos + this.height, this.x_pos + this.width, this.y_pos + this.height);
		},
		checkContact: function(gc_x, gc_y)
		{
			if(gc_x > this.x && gc_x < this.x + this.length)
			{
				var d = this.y - gc_y;
				if(d > 0 && d < 5)
				{
					isFalling = false;
					return true;
				}
			}
			return false;
		}
	};
	return p;
}