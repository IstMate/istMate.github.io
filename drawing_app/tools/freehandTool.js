function FreehandTool(){
	//set an icon and a name for the object
	this.icon = "assets/freehand.jpg";
	this.name = "freehand";
	this.brushSizeSlider = null;

	//to smoothly draw we'll draw a line from the previous mouse location
	//to the current mouse location. The following values store
	//the locations from the last frame. They are -1 to start with because
	//we haven't started drawing yet.
	var previousMouseX = -1;
	var previousMouseY = -1;

	this.populateOptions = function(){ //create slider

       // get .options div + show and hide slider + place slider in .options
	   let optionsDiv = select('.options');
	   if (optionsDiv) {
		   //position relative to .options div
		   let sliderX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
		   let sliderY = 10;

		   if (!this.brushSizeSlider) { 
			this.brushSizeSlider = createSlider(2, 50, 5);
			this.brushSizeSlider.parent(optionsDiv);
			this.brushSizeSlider.position(sliderX, sliderY);
			this.brushSizeSlider.size(150);
			} else {
			this.brushSizeSlider.position(sliderX, sliderY); // update position if resize
			this.brushSizeSlider.show();
			}
		}
	}

	this.unselectTool = function() {
		if (this.brushSizeSlider) this.brushSizeSlider.hide(); //hide slider
		previousMouseX = -1;
        previousMouseY = -1;
	}

	this.draw = function(){
		// check if the cursor is on canvas
		if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
			previousMouseX = -1;
			previousMouseY = -1;
			return;
		}
		stroke(currentColor);
		if(this.brushSizeSlider){
			strokeWeight(this.brushSizeSlider.value());
		}
		//if the mouse is pressed
		if(mouseIsPressed && mouseButton === LEFT && this.brushSizeSlider){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else{
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}
		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		else{
			previousMouseX = -1;
			previousMouseY = -1;
		}
	};

	this.mouseReleased = function(){
		saveState();
	};
}