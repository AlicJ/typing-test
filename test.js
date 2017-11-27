var KEYBOARD = ["O", "S", "T"];
var PENALTY = [0, 5, 10];
var TESTCASES = [];
var USERS = [];
var INTERVAL = 10;
var PHRASES = [
	"the world is a stage",
	"buckle up for safety",
	"nobody cares anymore",
	"toss the ball around",
	"join us on the patio",
	"zero in on the facts",
	"we park in driveways",
	"you have my sympathy",
	"typing is super easy"
]

var userId = 0;
var userCases = [];
var errorCount = 0;
var penalty = 3000;
var currentPhrase = "";

var timeCount = 0;
var gameRunning = true;
var blocked = false;
var gameLoop;

var newPhrase = "";

function initTestCases() {
	for (var i = 0; i < KEYBOARD.length; i++) {
		for (var j = 0; j < PENALTY.length; j++) {
			TESTCASES.push({
				id: i * 3 + j,
				keyboard: KEYBOARD[i],
				penalty: PENALTY[j]
			})
		}
	}
}

function initUsers() {
	for (var i = 0; i < 9; i++) {
		USERS.push({
			id: i,
			testcases: []
		});
		for (var j = i; j < i + 5; j++) {
			if (j < TESTCASES.length) {
				USERS[i]["testcases"].push(TESTCASES[j]);
			} else {
				USERS[i]["testcases"].push(TESTCASES[j - 9]);
			}
		}
	}
}


function generatePhrase() {
	currentPhrase = PHRASES[Math.floor(Math.random() * 9)];
	$("#testPhrase").html(currentPhrase);
};

function getUserId() {
	if (window.location.hash) {
		userId = window.location.hash.replace('#', '');
		userCases = USERS[userId].testcases;
	}
}

function init() {
	initTestCases();
	initUsers();
	getUserId();
}

function displayTime() {
	console.log("displayTime")
	gameLoop = setInterval(function() {

		if (!blocked) {
			timeCount += INTERVAL;
			$("#timer_count").html(timeCount);
		}

		if (gameRunning) {
			if ($("#testPhrase").html() == textArea.value) {
				gameRunning = false;
			}
		} else {
			clearInterval(gameLoop);
			var totalTime = timeCount + errorCount * penalty;
			$("#finalScore").html("Your took: " + totalTime + " milliseconds");
			var wpm = currentPhrase.split(" ").length / totalTime * 1000 * 60;
			var cpm = currentPhrase.length / totalTime * 1000 * 60;
			$("#finalScore").append("<br/> Error count: " + errorCount);
			//$("#finalScore").append("<br/> wpm: " + wpm);
			//$("#finalScore").append("<br/> cpm: " + cpm);

			$("#newTestWindow").show();
			//subtract 20ms per character?
		}
	}, INTERVAL);

	// only call display time once
	$(document).off("keydown", "#textArea", displayTime);
};

function block(timeout, oldText="") {
	blocked = true;
	// $("#textArea").attr("disabled", "disabled");
	$("#block").show();
	$("#countdown").html(timeout / 1000);
	var count = timeout;
	var countdown = setInterval(function() {
		count -= 1000;
		$("#countdown").html(count / 1000);
	}, 1000);

	setTimeout(function() {
		$("#block").hide();
		// $("#textArea").removeAttr("disabled");
		$("#textArea").focus();
		$("#textArea").val(oldText);
		blocked = false;
		clearInterval(countdown);
		// TODO need to consider time taken for keyboard to showup!
		// or prevent keyboard from disappearing!!!
	}, timeout);
}

function pause() {
	blocked = true;
}


function typeListener(event) {
	//http://jsfiddle.net/zminic/8Lmay/
	event.preventDefault();

	if (!gameRunning) {
		return;
	}
	if (penalty > 0 && blocked) {
		return;
	}

	var textArea = $("#textArea").val();
	var curPosition = textArea.length;
	var input = event.target.value;
	var target = newPhrase + currentPhrase[curPosition-1];


	if (!blocked) {
		if (input == target) {
			$("#textArea").val(textArea);
			newPhrase = target;
		} else {
			errorCount += 1
			if (penalty > 0) {
				block(penalty, target.substring(0,curPosition-1)); //TODO change this to dynamic
			} else {
				pause();
			}
		}
	} else {
		if(penalty == 0){
			if (input == target) {
				blocked = false;
				$("#textArea").val(textArea);
				newPhrase = target;
			} else {
				errorCount += 1;
			}
		}
	}

}

function clearStatus() {
	errorCount = 0;
	timeCount = 0;
	gameRunning = true;
	blocked = false;
	currentPhrase = "";
	lastInput = "";
}

$(document).on("keydown", "#textArea", displayTime);


$(document).on("input", "#textArea", typeListener);

init();

generatePhrase();

newTestButton.addEventListener("click", function() {
	window.location.reload();
});