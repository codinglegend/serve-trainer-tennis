var currentServe = null;
var videoPlayer = null;
var pauseCheck = null;
var pauseTime = 0;
var extraTime = 0;

var state = 0;
/*
* 0 = pre-start
* 1 = played first segment
* 2 = played second segment
* 3 = answered
*/

var answer_length = null;
var answer_spin = null;
var answer_direction = null;

$(document).ready(function(){
  if($('.question-container').length > 0){
    videoPlayer = $('video').get(0);

    $(videoPlayer).on('canplaythrough', function(){
      $('.loading').text(' ');
      if(state === 0){
        $('.start-video').show();
      }
    });

    $(videoPlayer).on('playing', function(){
      pauseCheck = window.setInterval(function() {
        if(videoPlayer.currentTime >= pauseTime) {
          videoPlayer.pause();
          window.clearInterval(pauseCheck);
          if(state === 1){
            $('.show-extra').show();
            $('.answer-choices').stop().fadeIn();
          }
        }
      }, 50);
    });

    $('.next-question').click(function(){
      loadNextQuestion();
    })

    $('.start-video').click(function(){
      videoPlayer.play();
      $(this).hide();
      state = 1;
    });

    $('.show-extra').click(function(){
      pauseTime = extraTime;
      state = 2;
      $(this).hide();
      $('.replay-video').show();
      videoPlayer.play();
    });

    $('.replay-video').click(function(){
      videoPlayer.currentTime = 0;
      videoPlayer.play();
    });

    $('.show-answer').click(function(){
      state = 3;
      $('.show-extra, .replay-video').hide();
      pauseTime = 9999;
      videoPlayer.currentTime = 0;
      videoPlayer.play();
    });

    $(videoPlayer).on('ended', function(){
      $('.toggled').each(function(){
        switch($(this).attr('data-choice')){
          case 'length':
            if(answer_length != currentServe.serve_length){
              $(this).addClass('wrong');
            }else{
              $(this).addClass('right')
            }; break;
          case 'direction':
            if(answer_direction != currentServe.serve_direction){
              $(this).addClass('wrong');
            }else{
              $(this).addClass('right')
            }; break;
          case 'spin':
            if(answer_spin != currentServe.serve_spin){
              $(this).addClass('wrong');
            }else{
              $(this).addClass('right')
            }; break;
        }
      });

      if($('.right').length == 3){
        window.setTimeout(celebrateSuccess, 3000);
      }else{
        window.setTimeout(punishFailure, 3000);
      }

      $('.answer-choices img:not(.toggled)').addClass('faded');
    });

    $('.answer-choices img').click(function(){
      $(this).siblings('.toggled').removeClass('toggled');
      $(this).addClass('toggled');
      switch($(this).attr('data-choice')){
        case 'length': answer_length = $(this).attr('data-answer'); break;
        case 'direction': answer_direction = $(this).attr('data-answer'); break;
        case 'spin': answer_spin = $(this).attr('data-answer'); break;
      }

      if($('.toggled').length == 3){
        $('.show-answer').removeAttr('disabled');
      }
    });

    loadNextQuestion();
  }
});

function celebrateSuccess(){
  $('.answer-choices').fadeOut('slow', function(){
    $('.result-success').slideDown();
  })
}

function punishFailure(){
  $('.answer-choices').fadeOut('slow', function(){
    $('.result-failure').slideDown();
  })
}

function cleanupBeforeQuestion(){
  $('.answer-choices').hide();
  $('.right').removeClass('right');
  $('.wrong').removeClass('wrong');
  $('.faded').removeClass('faded');
  $('.result-success, .result-failure').hide();
  $('.answer-choices .toggled').removeClass('toggled');
  $('.show-answer').attr('disabled', 'disabled');
  pauseTime = 0;
  extraTime = 0;
  state = 0;
}

function loadNextQuestion(){
  cleanupBeforeQuestion();
  $.get('/next').done(function(serve){
    currentServe = serve;
    $('.question-data').html('<p>Serve #' + serve.id + ' in our database, by player ' + serve.player_name + '</p>');
    $('.loading').text('Loading...');
    videoPlayer.src = serve.video;
    pauseTime = serve.time_1;
    extraTime = serve.time_2;
  });
}
