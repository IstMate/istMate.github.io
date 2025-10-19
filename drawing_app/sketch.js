//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var helpers = null;
var stamps = {};
var currentColor = "#000000";
var undoMemory = [];

function preload() {
	//preload stamp images
	stamps["smiley"] = loadImage('assets/stamps/smiley.png');
	stamps["empire"] = loadImage('assets/stamps/empire.png');
  	stamps["star"] = loadImage('assets/stamps/star.png');
}

function setup() {

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");

	//create helper functions and the colour palette
	helpers = new HelperFunctions();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
	toolbox.addTool(new StampTool());
	toolbox.addTool(new RectangleTool());
	toolbox.addTool(new EraserTool());
	toolbox.addTool(new MagnifierTool());
	toolbox.addTool(new KaleidoscopeTool());

	const colorPicker = select('#colorPicker');
 	 	colorPicker.input(function() {
    	currentColor = colorPicker.value(); //update currentColor
  	});

	background(255);
	undoMemory.push(get());
}

function draw() {
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	}
}
//saves states of canvas for undo function
function saveState(){
	undoMemory.push(get());
	if(undoMemory.length > 7) undoMemory.shift(); //maximum 7 strokes can be undone
}
//change canvas to previous state
function undoStroke(){
	if(undoMemory.length > 1){
		undoMemory.pop();
		var lastState = undoMemory[undoMemory.length - 1];
		clear();
		image(lastState, 0, 0);
	}
}
//key for undo 
function keyPressed(){
	if (key === 'z' || key === 'Z'){
		undoStroke();
	}
}

function mousePressed(){
	if(toolbox.selectedTool && toolbox.selectedTool.mousePressed){
		toolbox.selectedTool.mousePressed();
	}
}

function mouseReleased(){
	if(toolbox.selectedTool && toolbox.selectedTool.mouseReleased){
		toolbox.selectedTool.mouseReleased();
	}
}
//used for .options optimization - sliders/buttons placement
function windowResized() {
    canvasContainer = select('#content');
    resizeCanvas(canvasContainer.size().width, canvasContainer.size().height);

    if (toolbox.selectedTool && toolbox.selectedTool.hasOwnProperty("populateOptions")) {
        toolbox.selectedTool.populateOptions();
    }
}