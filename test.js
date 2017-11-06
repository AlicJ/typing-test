
var timer = document.getElementById("timer");
var timeRemaining = 0;
var testPara = document.getElementById("testPara");
var textArea = document.getElementById("textArea");
var newTestWindow = document.getElementById("newTestWindow");
var newTestButton = document.getElementById("newTestButton");
var score = 0;
var stop = false;

var generatePassage = function(){

	paraContainer.style.display = "inline-block";
	textArea.style.display = "inline-block";
	// testPara.innerHTML = "Friends are flowers in the garden of life.";
	testPara.innerHTML = "F";
};

var displayTime = function () {

	var getTime = setInterval(function() {
		timeRemaining += 10;
		timer.innerHTML = "Time Spent: " + timeRemaining + "s";

		if(stop){
			clearInterval(getTime);

			var wrapper = document.getElementById("wrapper");

			document.body.appendChild(newTestWindow);
			document.getElementById("finalScore").innerHTML = "Your took: " + timeRemaining + " milliseconds";
			newTestWindow.style.display = "block";
			
		} else{
			if(testPara.innerHTML == textArea.value){
				stop = true;
			}
		}
	}, 10);

	textArea.removeEventListener("keydown", displayTime);
};

var test = function() {

	timer.innerHTML = "Time Spent: 0s";
	timer.style.display = "block";

	textArea.addEventListener("keydown", displayTime);

	generatePassage();

};



//THIS SEEMS TO BE THE ENTRY POINT OF THE PROGRAM

test();

newTestButton.addEventListener("click", function(){
	window.location.reload();
});