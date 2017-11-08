
var timeCount = 0;
var gameRunning = true;
var gameTime;
var currentPhrase = "";
var lastInput = "";

var KEYBOARD = ["O", "S", "T"];
var PENALTY = [0, 4.5, 9];
var TESTCASES = [];
var USERS = [];

function initTestCases(){
	for (var i = 0; i < KEYBOARD.length; i++) {
		for (var j = 0; j < PENALTY.length; j++) {
			TESTCASES.push({id: i * 3 + j, keyboard: KEYBOARD[i], penalty: PENALTY[j] })
		}
	}
}

function initUsers() {
	for (var i = 0; i < 9; i++) {
		USERS.push({id: i, testcases: []});
		for (var j = i; j < i+5; j++) {
			if (j < TESTCASES.length) {
				USERS[i]["testcases"].push(TESTCASES[j]);
			} else {
				USERS[i]["testcases"].push(TESTCASES[j-9]);
			}
		}
	}
}

function generatePhrase (){
	// testPara.innerHTML = "Friends are flowers in the garden of life.";
	currentPhrase = "F";
	$("#testPhrase").html(currentPhrase);
};

function displayTime() {
	console.log("displayTime")
	gameTime = setInterval(function() {
		timeCount += 10;
		$("#timer_count").html(timeCount);

		if(gameRunning){
			if($("#testPhrase").html() == textArea.value){
				gameRunning = false;
			}

		} else{
			clearInterval(gameTime);

			$("#finalScore").html("Your took: " + timeCount + " milliseconds");
			$("#newTestWindow").show();
			//subtract 20ms per character?
		}
	}, 10);

	// only call display time once
	$(document).off("keydown", "#textArea", displayTime);
};

function block(timeout) {
	$("#textArea").attr("disabled","disabled");
	$("#block").show();
	$("#countdown").html(timeout/1000);
	var count = timeout;

	var countdown = setInterval(function(){
		count -= 1000;
		$("#countdown").html(count/1000);
	}, 1000);

	setTimeout(function(){
		$("#block").hide();
		$("#textArea").removeAttr("disabled");
		$("#textArea").focus();
		clearInterval(countdown);
	}, timeout);


}


//THIS SEEMS TO BE THE ENTRY POINT OF THE PROGRAM

$(document).on("keydown", "#textArea", displayTime);


$(document).on("keyup", "#textArea", function(event) {
	var input = $("#textArea").val();

	if (lastInput >= input) { //delete key pressed
		console.log("delete");
	}else{
		var curChar = input[input.length-1];
		var testChar = currentPhrase[input.length-1];
		console.log(curChar, testChar)
		if (curChar != testChar) {
			block(3000) //TODO change this to dynamic
		}
	}
	lastInput = input;

});

initTestCases();
initUsers();

generatePhrase();

newTestButton.addEventListener("click", function(){
	window.location.reload();
});