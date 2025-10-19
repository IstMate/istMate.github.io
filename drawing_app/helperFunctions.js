function HelperFunctions() {

	//Jquery click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	 //event handler for the clear button event. Clears the screen
    select("#clearButton").mouseClicked(function() {
        background(255, 255, 255);
        //call loadPixels to update the drawing state
        //this is needed for the mirror tool
        loadPixels();
    });

    //event handler for the save image button. saves the canvas to the
    //local file system.
    select("#saveImageButton").mouseClicked(function() {
        try {
            // Use PNG for better quality; add timestamp to filename
            saveCanvas('myDrawing_' + new Date().getTime(), 'png');
            console.log('Image saved successfully.');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Save failed—check console for details. Try PNG format or disable browser popup blocker.');
        }
    });
}