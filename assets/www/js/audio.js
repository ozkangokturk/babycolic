var clock;
var my_media = null;
var mediaTimer = null;
var isTimerOn=0;
var isPaused=0;

$("body").delegate("#babyModeListPage", "pageshow", function(event) {
	isTimerOn=0;
	stopAudio();
});

$("body").delegate("#babyAudioListPage", "pageshow", function(event) {
	var parameters = $(this).data("url").split("?")[1];;
    var mode = parameters.replace("mode=","");
    window.localStorage.setItem("mode", mode);
	clock = $('.flip-counter').FlipClock(0, {
		countdown : true,
		autostart : false,
		callbacks: {
			stop: function() { 
				if (isPaused==0){
					isTimerOn=0;
					stopAudio();
					$(".cp-play").show();
					$(".cp-pause").hide();					
				}				
			}
		}
	});
});

$(document).ready(function() {
	var toppos = ($(window).height() / 2) - ($("#countdown").height() / 2);
	var leftpos = ($(window).width() / 2) - 200;
	$("#countdown").css("left", leftpos);
});

// Play audio
//
function playAudio() {
	//defult audio file
	var src;
	var mode = window.localStorage.getItem("mode");
	if (mode == "colic"){ 
		src = 'file:///android_asset/www/mp3/colic.mp3';
	} else if (mode == "relax"){
		src = 'file:///android_asset/www/mp3/relax.mp3';
	} else if (mode == "nature"){
		src = 'file:///android_asset/www/mp3/nature.mp3';
	}
	isPaused=0;
	if (isTimerOn==0){
		var mode = $("#select-choice-1").val();
		if (mode == "infinite"){
			clock.setCountdown(false);
		} else if (mode == "minute15"){
			clock.setTime(15*60);
		} else if (mode == "minute30"){
			clock.setTime(30*60);
		} else if (mode == "hour1"){
			clock.setTime(60*60);
		} else if (mode == "hour2"){
			clock.setTime(2*60*60);
		} 
		clock.start();
		isTimerOn=1;
	}
	if (isTimerOn==1){
		clock.start();
	}
	$(".cp-play").hide();
	$(".cp-pause").show();
	// Create Media object from src
	my_media = new Media(src, onSuccess, onError, onStatus);

	// Play audio
	my_media.play();

	// Update my_media position every second
	if (mediaTimer == null) {
		mediaTimer = setInterval(function() {
			// get my_media position
			my_media.getCurrentPosition(
			// success callback
			function(position) {
				if (position > -1) {
					setAudioPosition((position) + " sec");
				}
			},
			// error callback
			function(e) {
				console.log("Error getting pos=" + e);
				setAudioPosition("Error: " + e);
			});
		}, 1000);
	}
}

// Pause audio
// 
function pauseAudio() {
	if (my_media) {
		my_media.pause();
		$(".cp-play").show();
		$(".cp-pause").hide();		
		isPaused=1;
		clock.stop();		
	}
}

// Stop audio
// 
function stopAudio() {
	if (my_media) {
		my_media.stop();
	}
	clearInterval(mediaTimer);
	mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
	console.log("playAudio():Audio Success");
}

// onError Callback 
//
function onError(error) {
	//alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

// Set audio position
// 
function setAudioPosition(position) {
	document.getElementById('audio_position').innerHTML = position;
}
//onStatus Callback 
function onStatus(status) {
    if( status==Media.MEDIA_STOPPED ) {
    	if (isTimerOn==1)
    		my_media.play();
    }
}

function stopTimer (){
	stopAudio();
	clock.setTime(1);
	clock.setCountdown(true);
	clock.start();
	$(".cp-play").show();
	$(".cp-pause").hide();
}

function goBackIndex (){
	isTimerOn=0;
	stopAudio();
	$.mobile.changePage('index.html', { dataUrl : "index.html", reloadPage : true, changeHash : true});
}

