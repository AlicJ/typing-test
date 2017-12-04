var KEYBOARD = ["QWERTY", "Swype", "One-handed QWERTY"];
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
var TRIAL_REPEAT = 5;

var userId = 0;
var userCases = [];
var errorCount = 0;
var penalty;
var currentPhrase = "";
var currentTrialNum = 0;
var currentRepeatTime = 0;
var currentTrial;

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
	console.log("display")
	gameLoop = setInterval(function() {
		console.log("game loop running")
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
			$("#finalScore").append("<br/><br/> Keyboard: " + currentTrial.keyboard);
			$("#finalScore").append("<br/> Penalty Rate: " + currentTrial.penalty);
			$("#finalScore").append("<br/> wpm: " + wpm.toFixed(2));
			$("#finalScore").append("<br/> cpm: " + cpm.toFixed(2));

			$("#newTestWindow").show();
			//subtract 20ms per character?
		}
	}, INTERVAL);

	// only call display time once
	$(document).off("input", "#textArea", displayTime);
};

function typeListener(event) {
	console.log("type")
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
	// var target = lastCorrectInput + currentPhrase[curPosition-1];
	var target = currentPhrase.slice(0, curPosition)

	if (!blocked) {
		if (input == target) {
			$("#textArea").val(textArea);
			lastCorrectInput = target;
		} else {
			errorCount += 1
			if (penalty > 0) {
				block(penalty, target.substring(0,curPosition-1));
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

function clearStatus() {
	errorCount = 0;
	timeCount = 0;
	gameRunning = true;
	blocked = false;
	currentPhrase = "";
	lastCorrectInput = "";
	$("#timer_count").html("");
	$("#testPhrase").html("")
	$("#textArea").val("");
	currentTrial = null;
}

function loadTrial() {
	clearStatus();

	currentTrial = userCases[currentTrialNum];

	currentPhrase = currentTrial["phrase"];
	penalty = currentTrial["penalty"] * 1000;
	$("#testPhrase").html(currentPhrase);
	$("#keyboard").html(currentTrial["keyboard"]);
	$("#penalty").html(currentTrial["penalty"]);
}

function nextTrial() {
	currentTrialNum ++;

	if (currentTrialNum >= 9) {
		$("#newTestWindow").hide();
		$("#finishWindow").show();
		return;
	}
	loadTrial();
}

function next(){
	currentRepeatTime ++;
	$("#newTestWindow").hide();
	$(document).on("input", "#textArea", displayTime);
	$("#textArea").focus();

	if (currentRepeatTime < TRIAL_REPEAT) {
		loadTrial();
	}else{
		currentRepeatTime = 0;
		nextTrial();
	}
}

$(document).on("input", "#textArea", displayTime);

$(document).on("input", "#textArea", typeListener);

$(document).on('click', '#newTestButton', function(event) {
	next();
});



init();

loadTrial();
