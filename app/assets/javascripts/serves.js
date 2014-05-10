var currentServe = null;
var videoPlayer = null;
var pauseCheck = null;
var pauseTime = 0;
var extraTime = 0;

$(document).ready(function(){
  if($('.question-container').length > 0){
    videoPlayer = $('video').get(0);
    videoPlayer.playbackRate = 0.5;
    $(videoPlayer).on('canplaythrough', function(){
      $('.loading').text(' ');
      videoPlayer.play();
    });

    $(videoPlayer).on('playing', function(){
      pauseCheck = window.setInterval(function() {
        if(videoPlayer.currentTime >= pauseTime) {
          console.log(videoPlayer.currentTime);
          videoPlayer.pause();
          window.clearInterval(pauseCheck);
          $('.answer-choices').stop().fadeIn();
        }
      }, 50);
    });

    $('.show-extra').click(function(){
      pauseTime = extraTime;
      if(videoPlayer.currentTime <= extraTime){
        videoPlayer.play();
      }else{
        videoPlayer.currentTime = 0;
        videoPlayer.play();
      }
    });

    $('.answer-choices li').click(function(){
      $(this).parent().find('.toggled').removeClass('toggled');
      $(this).addClass('toggled');
    });

    loadNextQuestion();
  }
});


function loadNextQuestion(){
  $('.answer-choices').fadeOut();
  $('.answer-choices .toggled').removeClass('toggled');
  pauseTime = 0;
  extraTime = 0;
  $.get('/next').done(function(serve){
    currentServe = serve;
    $('.question-data').html('<div><p>Serve #' + serve.id + '</p><p><strong>Serving Player: </strong>' + serve.player_name + '</p></div>');
    $('.loading').text('Loading...');
    videoPlayer.src = serve.video;
    pauseTime = serve.time_1;
    extraTime = serve.time_2;
  });
}

