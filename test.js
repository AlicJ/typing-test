var KEYBOARD = ["qwerty", "swype", "small"];
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
var TRIAL_REPEAT = 5

var userId = 0;
var userCases = [];
var errorCount = 0;
var penalty;
var currentPhrase = "";
var currentTrialNum = 0;
var currentRepeatTime = 0;

var timeCount = 0;
var gameRunning = true;
var blocked = false;
var gameLoop;

var lastCorrectInput = "";

function initTestCases() {
	for (var i = 0; i < KEYBOARD.length; i++) {
		for (var j = 0; j < PENALTY.length; j++) {
			TESTCASES.push({
				id: i * 3 + j,
				keyboard: KEYBOARD[i],
				penalty: PENALTY[(j + i) % 3],
				phrase: ""
			});
		}
	}
}

function initUsers() {
	for (var i = 0; i < 9; i++) {
		USERS.push({
			id: i,
			testcases: []
		});
		for (var j = i; j < i + 9; j++) {
			if (j < TESTCASES.length) {
				USERS[i]["testcases"].push($.extend(true, {}, TESTCASES[j]));
				USERS[i]["testcases"][j-i]["phrase"] = PHRASES[j];
			} else {
				USERS[i]["testcases"].push($.extend(true, {}, TESTCASES[j - 9]));
				USERS[i]["testcases"][j-i]["phrase"] = PHRASES[j - 9];
			}
		}
	}
}

function getUserId() {
	if (window.location.hash) {
		userId = window.location.hash.replace('#', '');
	}
	userCases = USERS[userId].testcases;
}

function init() {
	initTestCases();
	initUsers();
	getUserId();
}

function displayTime() {
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
		// $("#textArea").val(oldText);
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
			$("#textArea").val(lastCorrectInput);
		return;
	}

	var textArea = $("#textArea").val();
	var curPosition = textArea.length;
	var input = event.target.value;
	var target = lastCorrectInput + currentPhrase[curPosition-1];

	if (!blocked) {
		if (input == target) {
			$("#textArea").val(textArea);
			lastCorrectInput = target;
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
				lastCorrectInput = target;
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
	lastCorrectInput = "";
	$("#textArea").val("");
}

function loadTrial() {
	clearStatus();

	var currentTrial = userCases[currentTrialNum];

	currentPhrase = currentTrial["phrase"];
	penalty = currentTrial["penalty"] * 1000;
	$("#testPhrase").html(currentPhrase);
}

function nextTrial() {
	currentTrialNum ++;
	loadTrial();
}

function next(){
	currentRepeatTime ++;
	$("#newTestWindow").hide();
	$(document).on("keydown", "#textArea", displayTime);
	$("#textArea").focus();

	if (currentRepeatTime < TRIAL_REPEAT) {
		loadTrial();
	}else{
		currentRepeatTime = 0;
		nextTrial();
	}
}

$(document).on("keydown", "#textArea", displayTime);

$(document).on("input", "#textArea", typeListener);

$(document).on('click', '#newTestButton', function(event) {
	next();
});



init();

loadTrial();
