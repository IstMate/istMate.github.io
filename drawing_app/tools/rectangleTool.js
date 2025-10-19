function RectangleTool() {
    this.name = "rectangleTool";
    this.icon = "assets/rectangleTool.jpg";
    this.brushSizeSlider = null;

    var startMX = -1;
    var startMY = -1;
    var drawing = false;
    //create a slider in .options div for adjustable thickness
    this.populateOptions = function(){
          // get .options div
        let optionsDiv = select('.options');
        if (optionsDiv) {
            //calculate position relative to .options div
            let sliderX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let sliderY = 10;

            if (!this.brushSizeSlider) {
                this.brushSizeSlider = createSlider(2, 50, 5);
                this.brushSizeSlider.parent(optionsDiv);
                this.brushSizeSlider.position(sliderX, sliderY); //position inside .options
                this.brushSizeSlider.size(150);
            } else {
                this.brushSizeSlider.position(sliderX, sliderY); //update position if resize
                this.brushSizeSlider.show();
            }
        }
	}
    //deactivate the tool and reset drawing state upon tool switch
	this.unselectTool = function() {
		if (this.brushSizeSlider) this.brushSizeSlider.hide();
        startMX = -1;
        startMY = -1;
        drawing = false;
	}
    //draw rectangle and commit on mouse button release
    this.draw = function(){
        //check if the cursor is on canvas
    if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
        startMX = -1;
        startMY = -1;
        drawing = false;
        return;
    }
        stroke(currentColor);
		if(this.brushSizeSlider){
			strokeWeight(this.brushSizeSlider.value());
		}
        if (mouseIsPressed && mouseButton === LEFT && this.brushSizeSlider){
            if (!drawing){
                startMX = mouseX;
                startMY = mouseY;
                drawing = true;
                loadPixels();
            } else {
                updatePixels();
                rectMode(CORNERS);
                noFill();
                rect(startMX, startMY, mouseX, mouseY);
            }
        } else if (drawing){
            drawing = false;
            startMX = -1;
            startMY = -1;
        }
    };
    //save canvas state for undo function
    this.mouseReleased = function(){
		saveState();
	};
}