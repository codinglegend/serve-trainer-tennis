var currentQuestion = null;
var videoPlayer = null;
var pauseCheck = null;
var pauseTime = 0;
var totalChoices = 0;

var state = 0;
/*
* 0 = pre-start
* 1 = showing first segment
* 2 = answered
*/


$(document).ready(function(){
  if($('.question-container').length > 0){

    totalChoices = $('.answer-choices > div').length;
    videoPlayer = $('video').get(0);

    $(videoPlayer).on('canplaythrough', function(){
      $('.loading').hide();
      if(state === 0){
        $('.start-video').show();
      }
    });

    $(videoPlayer).on('error', function(){
      $(videoPlayer).hide();
      $('.loading').hide();
      $('#video-error').show();
    })

    $(videoPlayer).on('playing', function(){
      pauseCheck = window.setInterval(function() {
        if(videoPlayer.currentTime >= pauseTime) {
          videoPlayer.pause();
          window.clearInterval(pauseCheck);
          if(state === 1){
            $('.replay-video').show();
            $('.answer-choices').stop().fadeIn();
          }
        }
      }, 35);
    });

    $('.next-question').click(function(){
      loadNextQuestion();
    })

    $('.start-video').click(function(){
      videoPlayer.play();
      $(this).hide();
      state = 1;
    });

    $('.replay-normal').click(function(){
      videoPlayer.currentTime = 0;
      videoPlayer.playbackRate = 1;
      videoPlayer.play();
    });

    $('.replay-slow').click(function(){
      videoPlayer.currentTime = 0;
      videoPlayer.playbackRate = 0.35;
      videoPlayer.play();
    });

    $('.show-answer').click(function(){
      state = 2;
      $('.show-answer').hide();
      $('.replay-video').show();
      pauseTime = 9999;
      videoPlayer.currentTime = 0;
      videoPlayer.play();
    });

    $(videoPlayer).on('ended', checkAndDisplayAnswers);

    $('.answer-choices img').click(function(){
      $(this).siblings('.toggled').removeClass('toggled');
      $(this).addClass('toggled');
      user_answers[$(this).attr('data-choice')] = $(this).attr('data-value');

      if($('.toggled').length == totalChoices){
        $('.show-answer').removeAttr('disabled');
      }
    });

    loadNextQuestion();
  }
});

function checkAndDisplayAnswers(){
  $('.answer-choices img').each(function(){
    // Check if selected option is correct and assign a class accordingly.
    // Also add .actual-answer to the...actual answers
    if($(this).attr('data-value') == currentQuestion[$(this).attr('data-choice')]){
      $(this).addClass('actual-answer');
      if($(this).hasClass('toggled')){
        $(this).addClass('right');
      }
    }else{
      if($(this).hasClass('toggled')){
        $(this).addClass('wrong');
      }
    }
  });

  if($('.right').length == totalChoices){
    celebrateSuccess();
  }else{
    punishFailure();
  }

  $('.answer-choices img:not(.toggled, .actual-answer)').addClass('faded');
}

function celebrateSuccess(){
  $('.result-success').slideDown();
}

function punishFailure(){
  $('.result-failure').slideDown();
}

function cleanupBeforeQuestion(){
  $('.answer-choices').hide();
  $('.replay-video').hide();
  $('.right').removeClass('right');
  $('.wrong').removeClass('wrong');
  $('.faded').removeClass('faded');
  $('.actual-answer').removeClass('actual-answer');
  $('.result-success, .result-failure').hide();
  $('.answer-choices .toggled').removeClass('toggled');
  $('.show-answer').attr('disabled', 'disabled').show();

  user_answers = new Object;
  pauseTime = 0;
  state = 0;
  $('.loading').show();
}

function initializeServeDisplay(serve){
  currentQuestion = serve;
  $('.question-data').html('<p>Serve #' + serve.id + ' in our database, by player ' + serve.player_name + '</p>');
  videoPlayer.src = serve.video;
  pauseTime = serve.time_1;
  ga('send', 'pageview', '/serve/' + serve.id);
}

function loadNextQuestion(){
  cleanupBeforeQuestion();
  $.get('/next').done(function(serve){
    initializeServeDisplay(serve)
  }).error(function(){
    loadNextQuestion();
  });
}

function loadServe(){
  serve_id = 1;
  if( parseInt($('#serve_id').val()) !== NaN && parseInt($('#serve_id').val()) > 0 ){
    serve_id = parseInt($('#serve_id').val());
  }

  cleanupBeforeQuestion();
  $.get('/question/' + serve_id + '.json').done(function(serve){
    initializeServeDisplay(serve);
  }).error(function(){
    alert("The Serve ID you typed was not found in our database. Sorry!");
  });
}

var testVideo = null;
var testPauseTime = 0;
function testPause(){
  testVideo = $('video').get(0);
  testPauseTime = $('#pause_time').val();
  testVideo.currentTime = 0;
  testPauseCheck = window.setInterval(function() {
    if(testVideo.currentTime >= testPauseTime) {
      testVideo.pause();
      window.clearInterval(testPauseCheck);
    }
  }, 35);
  testVideo.play();
}


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-47486818-2', 'rohitnair.net');
ga('send', 'pageview');
