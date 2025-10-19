function StampTool() {
    this.name = "stampTool";
    this.icon = "assets/stamp.jpg";
    this.currentStamp = "smiley";
    this.stampSizeSlider = null;
    this.stampNumberSlider = null;
    this.stampOptions = null;

    this.populateOptions = function() {
          // get .options div
        let optionsDiv = select('.options');
        if (optionsDiv) {
            //calculate position relative to .options div
            let baseX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let baseY = 10; 
            //slider for size handle
            if (!this.stampSizeSlider) {
                this.stampSizeSlider = createSlider(30, 110, 30);
                this.stampSizeSlider.parent(optionsDiv); 
                this.stampSizeSlider.position(baseX, baseY); //position inside .options
                this.stampSizeSlider.size(150);
            } else {
                this.stampSizeSlider.position(baseX, baseY); //update position on resize
                this.stampSizeSlider.show();
            }
            //slider for number of stamps drawn
            if (!this.stampNumberSlider) {
                this.stampNumberSlider = createSlider(1, 20, 1);
                this.stampNumberSlider.parent(optionsDiv);
                this.stampNumberSlider.position(baseX, baseY + 30);
                this.stampNumberSlider.size(150);
            } else {
                this.stampNumberSlider.position(baseX, baseY + 30); //update position on resize
                this.stampNumberSlider.show();
            }
            //dropdown menu for stamp options
            if (!this.stampOptions) {
                this.stampOptions = createSelect();
                this.stampOptions.parent(optionsDiv); 
                this.stampOptions.position(baseX, baseY + 60);
                this.stampOptions.option("smiley");
                this.stampOptions.option("empire");
                this.stampOptions.option("star");
            } else {
                this.stampOptions.position(baseX, baseY + 60); //update position on resize
                this.stampOptions.show();
            }
        }
        var self = this;
        this.stampOptions.changed(function() {
            self.currentStamp = self.stampOptions.value();
        });
    };
    //hide UI element if tool switch
    this.unselectTool = function() {
        if (this.stampSizeSlider) this.stampSizeSlider.hide();
        if (this.stampNumberSlider) this.stampNumberSlider.hide();
        if (this.stampOptions) this.stampOptions.hide();
    };

    this.draw = function() {
        //check if the cursor is on canvas
    if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
        return;
    }
        if (mouseIsPressed && mouseButton === LEFT && this.stampSizeSlider && this.stampNumberSlider) {
            var stampSize = this.stampSizeSlider.value();
            var stampCount = this.stampNumberSlider.value();
            //randomizes stamp positions based on mouse pos
            for (var i = 0; i < stampCount; i++) {
                var stampX = random((mouseX - stampSize / 2) - 10, (mouseX - stampSize / 2) + 10);
                var stampY = random((mouseY - stampSize / 2) - 10, (mouseY - stampSize / 2) + 10);
                //draw stamp image
                image(stamps[this.currentStamp], stampX, stampY, stampSize, stampSize);
            }
        }
    };
    //save canvas state for undo function
    this.mouseReleased = function() {
        saveState();
    };
}