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
  $('.show-extra').hide();
  $('.replay-video').hide();
  $('.right').removeClass('right');
  $('.wrong').removeClass('wrong');
  $('.faded').removeClass('faded');
  $('.result-success, .result-failure').hide();
  $('.answer-choices .toggled').removeClass('toggled');
  $('.show-answer').attr('disabled', 'disabled');
  pauseTime = 0;
  extraTime = 0;
  state = 0;
  $('.loading').show();
}

function initializeServeDisplay(serve){
  currentServe = serve;
  $('.question-data').html('<p>Serve #' + serve.id + ' in our database, by player ' + serve.player_name + '</p>');
  videoPlayer.src = serve.video;
  pauseTime = serve.time_1;
  extraTime = serve.time_2;
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


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-47486818-2', 'rohitnair.net');
ga('send', 'pageview');
