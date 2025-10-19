function KaleidoscopeTool(){
    this.name = "kaleidoscopeTool";
    this.icon = "assets/kaleidoscope.jpg";
    this.symmetryCount = null; //control number symmetry segments
    this.kaleidoCenterX = 0;
    this.kaleidoCenterY = 0;
    this.isDraggingCenter = false; // check if user dragging the center point
    this.previousMouseX = -1;
    this.previousMouseY = -1;

    this.initializeCenter = function() { //initialize kaleido center point
        if (this.kaleidoCenterX === 0 && this.kaleidoCenterY === 0) {
            this.kaleidoCenterX = width / 2;
            this.kaleidoCenterY = height / 2;
        }
    };

    this.populateOptions = function() {
          // get .options div + show and hide slider + place slider in .options
        let optionsDiv = select('.options');
        if (optionsDiv) {
            //position relative to .options div
            let sliderX = Math.min(optionsDiv.width - 165, window.innerWidth - 200);
            let sliderY = 10; 

            if (!this.symmetryCount) {
                this.symmetryCount = createSlider(2, 12, 6, 2);
                this.symmetryCount.parent(optionsDiv);
                this.symmetryCount.position(sliderX, sliderY); // position inside .options
                this.symmetryCount.size(150);
                this.symmetryCount.input(function() {
                });
            } else {
                this.symmetryCount.position(sliderX, sliderY); // update position if resize
                this.symmetryCount.show();
            }
        }
    };
    //for switching tools, reset current states
    this.unselectTool = function() {
        if (this.symmetryCount) this.symmetryCount.hide();
        this.isDraggingCenter = false;
        this.previousMouseX = -1;
        this.previousMouseY = -1;
        saveState();
    };

    this.draw = function() {
        //check if the cursor is on canvas
    if (!(mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height)) {
        this.previousMouseX = -1;
        this.previousMouseY = -1;
        return;
    }
        this.initializeCenter();

        if (!mouseIsPressed) {
            this.isDraggingCenter = false;
            return;
        }

        // check if user is dragging the center point
        if (dist(mouseX, mouseY, this.kaleidoCenterX, this.kaleidoCenterY) < 10) {
            this.isDraggingCenter = true;
        }

        if (this.isDraggingCenter) {
            this.kaleidoCenterX = constrain(mouseX, 0, width);
            this.kaleidoCenterY = constrain(mouseY, 0, height);
            return;
        }

        // drawing logic
        let segmentCount = this.symmetryCount.value(); //symmetry number based on slider
        let angleIncrement = TWO_PI / segmentCount; //calculate angles between segments

        let dx = mouseX - this.kaleidoCenterX;
        let dy = mouseY - this.kaleidoCenterY;
        let radius = dist(0, 0, dx, dy); //distance from center to mouse
        let baseAngle = atan2(dy, dx); //angle of the mouse relative to center point
        //eliminate overdrawing
        let distanceMoved = dist(this.previousMouseX, this.previousMouseY, mouseX, mouseY);
        if (distanceMoved < 5 && this.previousMouseX !== -1) return; 

        push();
        stroke(currentColor);
        strokeWeight(2);
        for (let i = 0; i < segmentCount; i++) { //loop for drawing symmetric lines
            let currentAngle = baseAngle + i * angleIncrement; //current segment angle
            //current point's position
            let x = this.kaleidoCenterX + radius * cos(currentAngle);
            let y = this.kaleidoCenterY + radius * sin(currentAngle);
            //previous point's position
            let prevX = this.kaleidoCenterX + radius * cos(currentAngle - angleIncrement / segmentCount);
            let prevY = this.kaleidoCenterY + radius * sin(currentAngle - angleIncrement / segmentCount);

            if (this.prevX !== -1 && this.prevY !== -1) {
                line(prevX, prevY, x, y);
                // mirror across the center
                let mirrorX = this.kaleidoCenterX - (x - this.kaleidoCenterX);
                let mirrorY = this.kaleidoCenterY - (y - this.kaleidoCenterY);
                let mirrorPrevX = this.kaleidoCenterX - (prevX - this.kaleidoCenterX);
                let mirrorPrevY = this.kaleidoCenterY - (prevY - this.kaleidoCenterY);
                line(mirrorPrevX, mirrorPrevY, mirrorX, mirrorY);
            };
        };
        pop();

        this.previousMouseX = mouseX;
        this.previousMouseY = mouseY;
    }

    //stop drawing
    this.mouseReleased = function() {
        saveState();
        this.isDraggingCenter = false;
        this.previousMouseX = -1;
        this.previousMouseY = -1;
    };
}