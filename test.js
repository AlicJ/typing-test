var KEYBOARD = ["O", "S", "T"];
var PENALTY = [0, 5, 10];
var TESTCASES = [];
var USERS = [];
var INTERVAL = 10;
var PHRASES = [
	"The squeakiest wheel always gets the grease.",
	"A bird in the hand is worth two in the bush.",
	"Do not count the chickens before they hatch.",
	"The sharper the berry, the sweeter the wine.",
	"A weed is no more than a flower in disguise.",
	"We will cross the bridge when we come to it.",
	"The grass is always green on the other side.",
	"The stronger the wind the stronger the tree.",
	"Do I look like a turnip from a turnip truck?"
]

var userId = 0;
var userCases = [];
var errorCount = 0;
var penalty = 0;
var currentPhrase = "";

var timeCount = 0;
var gameRunning = true;
var blocked = false;
var gameLoop;


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
	// testPara.innerHTML = "Friends are flowers in the garden of life.";
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
			var cpm = currentPhrase.length / totalTime * 1000 * 60
			$("#finalScore").append("<br/> wpm: " + wpm);
			$("#finalScore").append("<br/> cpm: " + cpm);

			$("#newTestWindow").show();
			//subtract 20ms per character?
		}
	}, INTERVAL);

	// only call display time once
	$(document).off("keydown", "#textArea", displayTime);
};

function block(timeout) {
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
	event.preventDefault();
	console.log(event);
	console.log(event.key, event.keyCode);

	if (!gameRunning) {
		return;
	}
	if (penalty > 0 && blocked) {
		return;
	}

	if (event.key.length == "1") { // if pressed a valid character key
		var textArea = $("#textArea").val();
		var curPosition = textArea.length;
		var input = event.key
		var target = currentPhrase[curPosition];
		if (!blocked) {


			console.log(input, target)
			console.log(event.keyCode)

			if (input == target) {
				$("#textArea").val(textArea + input);
			} else {
				errorCount += 1
				if (penalty > 0) {
					block(penalty) //TODO change this to dynamic
				} else {
					pause();
				}
			}
		} else {
			if (input == target) {
				console.log(input)
				blocked = false;
				$("#textArea").val(textArea + input);
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


$(document).on("keydown", "#textArea", typeListener);

init();

generatePhrase();

newTestButton.addEventListener("click", function() {
	window.location.reload();
});