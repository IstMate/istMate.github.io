function MagnifierTool(){
    this.name = "Magnifier";
    this.icon = "assets/magnifier.jpg";
    this.zoomLevels = [0.5, 1, 2, 3];
    this.currentZoomIndex = 0;
    this.zoomSize = 45;
    this.active = false;
     // set zoom level based on dropdown selection
    this.setZoomLevel = function(level){
        let index = this.zoomLevels.indexOf(level);
        if(index !== -1){
            this.currentZoomIndex = index;
        };
    };
    //create a dropdown menu in .options div for selecting zoom levels
    this.populateOptions = function(){
          // get .options div
        let optionsDiv = select('.options');
        if (optionsDiv) {
            //calculate position relative to .options div
            let dropdownX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let dropdownY = 10;

            if (!this.magnifyingOptions) {
                this.magnifyingOptions = createSelect();
                this.magnifyingOptions.parent(optionsDiv);
                this.magnifyingOptions.position(dropdownX, dropdownY); 

                for (let i = 0; i < this.zoomLevels.length; i++) {
                    this.magnifyingOptions.option(this.zoomLevels[i]);
                }

                this.magnifyingOptions.selected(this.zoomLevels[this.currentZoomIndex]);

                let self = this;
                this.magnifyingOptions.changed(function() {
                    let selectedValue = parseInt(self.magnifyingOptions.value());
                    self.setZoomLevel(selectedValue);
                });
            } else {
                this.magnifyingOptions.position(dropdownX, dropdownY); //update position if resize
                this.magnifyingOptions.show();
            }
        }
    };
    //deactivate tool and handle canvas restoration
    this.unselectTool = function(){
        this.active = false;
        if (this.magnifyingOptions){
            this.magnifyingOptions.hide();
        };
        if (undoMemory.length > 0) {
            clear();
            image(undoMemory[undoMemory.length - 1], 0, 0);
        }
    };
    //draw the magnifier around the mouse cursor
    this.draw = function(){
        // check if the cursor is on canvas
    if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
        return;
    }

        if (!this.active){
            return;
        };

        if(!mouseIsPressed){
            return;
        }

        let zoomFactor = this.zoomLevels[this.currentZoomIndex];
        let magnifyingSize = this.zoomSize;
        let areaSize = magnifyingSize * 3; 
        let sourceSize = Math.max(1, magnifyingSize / zoomFactor);

        //magnifier position
        let magnifyStartX = floor(constrain(mouseX - magnifyingSize / 2, 0, width - magnifyingSize));
        let magnifyStartY = floor(constrain(mouseY - magnifyingSize / 2, 0, height - magnifyingSize));
        let displayX = floor(constrain(mouseX - areaSize / 2, 0, width - areaSize));
        let displayY = floor(constrain(mouseY - areaSize / 2, 0, height - areaSize));

        clear();
        if (undoMemory.length > 0) {
            image(undoMemory[undoMemory.length - 1], 0, 0);
        }

        push();

        let magnifiedArea = get(magnifyStartX, magnifyStartY, sourceSize, sourceSize);
        magnifiedArea.loadPixels();

        if (magnifiedArea.width > 0 && magnifiedArea.height > 0) {
            //graphics buffer for the magnified area
            let magnifierBuffer = createGraphics(areaSize, areaSize);
            magnifierBuffer.clear();

            //draw magnified area into the buffer
            magnifierBuffer.image(magnifiedArea, 0, 0, areaSize, areaSize);
                magnifierBuffer.loadPixels();
                let pixels = magnifierBuffer.pixels;
                let centerX = areaSize / 2;
                let centerY = areaSize / 2;
                let radius = areaSize / 2;
                //loop over frames to create a mask
                for (let y = 0; y < areaSize; y++) {
                    for (let x = 0; x < areaSize; x++) {
                        //calculate distance from center to magnified area
                        let d = dist(centerX, centerY, x, y);
                        if (d > radius) {
                            let index = (y * areaSize + x) * 4; //calculate pixel index
                            pixels[index + 3] = 0; //set alpha channel to transparent
                        }
                    }
                }
                //update modified pixels for the circular mask
                magnifierBuffer.updatePixels();

            //draw the masked magnified area
            image(magnifierBuffer, displayX, displayY);

            //optional semi-transparent background for contrast
            fill(255, 255, 255, 10);
            noStroke();
            ellipse(displayX + areaSize / 2, displayY + areaSize / 2, areaSize, areaSize);

            //border for visibility
            noFill();
            stroke(0);
            strokeWeight(1);
            ellipse(displayX + areaSize / 2, displayY + areaSize / 2, areaSize, areaSize);
        }

        pop();
    };
    //activate magnifier upon left mouse button click
    this.mousePressed = function(){
        if(mouseButton === LEFT && !this.active && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height){
           this.active = true;
        }
    };
    //deactivate magnifier and restore canvas state
    this.mouseReleased = function(){
        if(this.active){
            this.active = false;
            if (undoMemory.length > 0) {
                clear();
                image(undoMemory[undoMemory.length - 1], 0, 0);
            }
        }
    };
}

