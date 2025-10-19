function SprayCanTool(){
	this.name = "sprayCanTool";
	this.icon = "assets/sprayCan.jpg";
	this.spraySizeSlider = null;
	var points = 12; //number of spray points per frame
	var spread = 15; //spread radius

	this.populateOptions = function(){
		  // get .options div
		let optionsDiv = select('.options');
        if (optionsDiv) {
            //calculate position relative to .options div
            let sliderX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let sliderY = 10;

            if (!this.spraySizeSlider) { //slider DOM element
                this.spraySizeSlider = createSlider(2, 50, 5);
                this.spraySizeSlider.parent(optionsDiv);
                this.spraySizeSlider.position(sliderX, sliderY); //position inside .options
                this.spraySizeSlider.size(150);
            } else {
                this.spraySizeSlider.position(sliderX, sliderY); //update position on resize
                this.spraySizeSlider.show();
            }
        }
	};
	//hide slider if switch in tools
	this.unselectTool = function() {
		if (this.spraySizeSlider) this.spraySizeSlider.hide();
	}

	this.draw = function(){
		//check if the cursor is on canvas
		if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
			return;
		}
		stroke(currentColor);
		if(this.spraySizeSlider){
			strokeWeight(this.spraySizeSlider.value());
		}
		//generates random values for spraycan effect
		if(mouseIsPressed && mouseButton === LEFT ){
			for(var i = 0; i < points; i++){
				point(random(mouseX-spread, mouseX + spread), random(mouseY-spread, mouseY+spread));
			}
		}
	};
	//save canvas state for undo function
	this.mouseReleased = function(){
		saveState();
	};
}