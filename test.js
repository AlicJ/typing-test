
var timer = document.getElementById("timer");
var timeRemaining = 0;
var testPara = document.getElementById("testPara");
var textArea = document.getElementById("textArea");
var newTestWindow = document.getElementById("newTestWindow");
var newTestButton = document.getElementById("newTestButton");
var score = 0;
var stop = false;

var KEYBOARD = ["O", "S", "T"];
var PENALTY = [0, 4.5, 9];
var TESTCASES = [];
var USERS = [];

for (var i = 0; i < KEYBOARD.length; i++) {
	for (var j = 0; j < PENALTY.length; j++) {
		console.log(i, j)
		TESTCASES.push({id: i * 3 + j, keyboard: KEYBOARD[i], penalty: PENALTY[j] })
	}
}

for (var i = 0; i < 9; i++) {
	USERS.push({id: i, testcases: []});
	for (var j = i; j < i+5; j++) {
		if (j < TESTCASES.length) {
			USERS[i]['testcases'].push(TESTCASES[j]);
		} else {
			USERS[i]['testcases'].push(TESTCASES[j-9]);
		}
	}
}

var generatePassage = function(){

	paraContainer.style.display = "inline-block";
	textArea.style.display = "inline-block";
	// testPara.innerHTML = "Friends are flowers in the garden of life.";
	testPara.innerHTML = "Friends are great.";
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
			//subtract 20ms per character?

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