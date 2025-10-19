function EraserTool(){
    //set an icon and name
    this.icon = "assets/eraser.jpg";
    this.name = "eraser";
    this.brushSizeSlider = null;
    let previousMouseX = -1;
    let previousMouseY = -1;

    this.populateOptions = function(){ //create slider
        // get .options div + show and hide slider + place slider in .options
        let optionsDiv = select('.options');

        if (optionsDiv) {
            //position relative to .options div
            let sliderX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let sliderY = 10;
            
            if (!this.brushSizeSlider) {
                this.brushSizeSlider = createSlider(2, 50, 10); // tool size
                this.brushSizeSlider.parent(optionsDiv);
                this.brushSizeSlider.position(sliderX, sliderY); // position inside .options
                this.brushSizeSlider.size(150);
            } else {
                this.brushSizeSlider.position(sliderX, sliderY); // update position if resize happens
                this.brushSizeSlider.show();
            }
        }
    }
    //make tool inactive
    this.unselectTool = function() {
        if (this.brushSizeSlider) this.brushSizeSlider.hide();
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
        //eraser style
        if(this.brushSizeSlider){
            stroke(255);
            strokeWeight(this.brushSizeSlider.value());
        }

        if (mouseIsPressed && mouseButton === LEFT && this.brushSizeSlider){
            if (previousMouseX == -1){
            previousMouseX = mouseX;
            previousMouseY = mouseY;
            } else {
            line(previousMouseX, previousMouseY, mouseX, mouseY);
            previousMouseX = mouseX;
            previousMouseY = mouseY;}
        } else {
            previousMouseX = -1;
            previousMouseY = -1;
        }
    };

    this.mouseReleased = function(){
		saveState(); //save current state of canvas (for undo functionality)
	};
}