function mirrorDrawTool() {
    this.name = "mirrorDraw";
    this.icon = "assets/mirrorDraw.jpg";
    this.brushSizeSlider = null;
    this.directionButton = null;

    //which axis is being mirrored (x or y) x is default
    this.axis = "x";
    //line of symmetry - will be set dynamically in draw to avoid timing issues
    this.lineOfSymmetry = 0;  // Initial placeholder

    //this changes in the jquery click handler. So storing it as
    //a variable self now means we can still access it in the handler
    var self = this;

    //where was the mouse on the last time draw was called.
    //set it to -1 to begin with
    var previousMouseX = -1;
    var previousMouseY = -1;

    //mouse coordinates for the other side of the Line of symmetry.
    var previousOppositeMouseX = -1;
    var previousOppositeMouseY = -1;

    this.unselectTool = function() {
        //hide slider and button
        if (this.brushSizeSlider) this.brushSizeSlider.hide();
        if (this.directionButton) this.directionButton.hide();
        previousMouseX = -1;
        previousMouseY = -1;
        previousOppositeMouseX = -1;
        previousOppositeMouseY = -1;
    }

    this.draw = function() {
        // Update line of symmetry dynamically - fixes fullscreen/resize issues
        if (this.axis === "x") {
            this.lineOfSymmetry = width / 2;
        } else {
            this.lineOfSymmetry = height / 2;
        }

        //draw mirrored lines based on mouse position and symmetry axis
        if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
            previousMouseX = -1;
            previousMouseY = -1;
            return;
        }

        stroke(currentColor);
        if(this.brushSizeSlider){
            strokeWeight(this.brushSizeSlider.value());
        }

        //draw if the mouse is pressed
        if (mouseIsPressed && mouseButton === LEFT && this.brushSizeSlider) {
            //if the previous values are -1 set them to the current mouse location
            //and mirrored positions
            if (previousMouseX == -1) {
                previousMouseX = mouseX;
                previousMouseY = mouseY;
                previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
                previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
            }

            //if there are values in the previous locations
            //draw a line between them and the current positions
            else {
                line(previousMouseX, previousMouseY, mouseX, mouseY);
                previousMouseX = mouseX;
                previousMouseY = mouseY;

                //these are for the mirrored drawing the other side of the
                //line of symmetry
                var oX = this.calculateOpposite(mouseX, "x");
                var oY = this.calculateOpposite(mouseY, "y");
                line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
                previousOppositeMouseX = oX;
                previousOppositeMouseY = oY;
            }
        }
        //if the mouse isn't pressed reset the previous values to -1
        else {
            previousMouseX = -1;
            previousMouseY = -1;
            previousOppositeMouseX = -1;
            previousOppositeMouseY = -1;
        }

        //after the drawing is done save the pixel state. We don't want the
        //line of symmetry to be part of our drawing

        loadPixels();

        
    };

    /*calculate an opposite coordinate the other side of the
     *symmetry line.
     *@param n number: location for either x or y coordinate
     *@param a [x,y]: the axis of the coordinate (y or y)
     *@return number: the opposite coordinate
     */
    this.calculateOpposite = function(n, a) {
        //if the axis isn't the one being mirrored return the same
        //value
        if (a != this.axis) {
            return n;
        }

        //if n is less than the line of symmetry return a coordinate
        //that is far greater than the line of symmetry by the distance from
        //n to that line.
        if (n < this.lineOfSymmetry) {
            return this.lineOfSymmetry + (this.lineOfSymmetry - n);
        }

        //otherwise a coordinate that is smaller than the line of symmetry
        //by the distance between it and n.
        else {
            return this.lineOfSymmetry - (n - this.lineOfSymmetry);
        }
    };

    //adds a button and click handler to the options area. When clicked
    //toggle the line of symmetry between horizontal to vertical + slider creation
    this.populateOptions = function() {
          // get .options div
        let optionsDiv = select('.options');
        if (optionsDiv) {
            //calculate positions relative to .options div
            let sliderX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let sliderY = 10;
            let buttonX = 15;
            let buttonY = 10;

            //create or show the direction button
            if (!this.directionButton) {
                this.directionButton = createButton(self.axis == "x" ? "Make Horizontal" : "Make Vertical");
                this.directionButton.id("directionButton");
                this.directionButton.parent(optionsDiv);
                this.directionButton.position(buttonX, buttonY);
                this.directionButton.mouseClicked(function() {
                    var button = select("#" + this.elt.id);
                    if (self.axis == "x") {
                        self.axis = "y";
                        self.lineOfSymmetry = height / 2;
                        button.html('Make Vertical');
                    } else {
                        self.axis = "x";
                        self.lineOfSymmetry = width / 2;
                        button.html('Make Horizontal');
                    }
                });
            } else {
                this.directionButton.position(buttonX, buttonY);
                this.directionButton.show();
            }

            //create or show the brush size slider
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
    };
    //save canvas state for undo function
    this.mouseReleased = function(){
        saveState();
    };
}