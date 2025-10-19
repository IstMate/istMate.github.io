//a tool for drawing straight lines to the screen. Allows the user to preview
//the a line to the current mouse position before drawing the line to the 
//pixel array.
function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";
	this.brushSizeSlider = null;

	let startMouseX = -1;
	let startMouseY = -1;
	let drawing = false;

	this.populateOptions = function(){
		  // get .options div
		let optionsDiv = select('.options');
        if (optionsDiv) {
            //position relative to .options div
            let sliderX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let sliderY = 10;

            if (!this.brushSizeSlider) {
                this.brushSizeSlider = createSlider(2, 50, 5);
                this.brushSizeSlider.parent(optionsDiv);
                this.brushSizeSlider.position(sliderX, sliderY); // slider position inside .options
                this.brushSizeSlider.size(150);
            } else {
                this.brushSizeSlider.position(sliderX, sliderY); //update position if window resize
                this.brushSizeSlider.show();
            }
        }
	}

	this.unselectTool = function() {	//for tool swizching
		// remove slider
		if (this.brushSizeSlider) this.brushSizeSlider.hide();
		startMouseX = -1;
        startMouseY = -1;
        drawing = false;
	}

	//draws the line to the screen 
	this.draw = function(){
		// check if the cursor is on the canvas
		if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
			startMouseX = -1;
			startMouseY = -1;
			drawing = false;
			return;
		}
		stroke(currentColor);
		if(this.brushSizeSlider){
			strokeWeight(this.brushSizeSlider.value());
		}
		//only draw when mouse is clicked
		if(mouseIsPressed && mouseButton === LEFT && this.brushSizeSlider){
			//if it's the start of drawing a new line
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				//save the current pixel Array
				loadPixels();
			}

			else{
				//update the screen with the saved pixels to hide any previous
				//line between mouse pressed and released
				updatePixels();
				//draw the line
				line(startMouseX, startMouseY, mouseX, mouseY);
			}
		}

		else if(drawing){
			//save the pixels with the most recent line and reset the
			//drawing bool and start locations
			loadPixels();
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};

	this.mouseReleased = function(){
		saveState();
	};
}
