(function() {
  
  $('.task-answer-item').click(function() {
    var $this = $(this);

    if ( $this.hasClass('block') ) return;

    $this.toggleClass('check');

    $('.task-scene').trigger('answer-change');
  });

  $('.task-submit').click(function() {
    var $this = $(this);

    if ( $this.hasClass('disable') || $this.hasClass('block') ) return;

    $('.task-scene').trigger('submit');
  });

  var $taskScene = $('.task-scene');

  $taskScene.uncheckAnswers = function() {
    $('.task-answer-item.check').removeClass('check');
    this.trigger('answer-change');
  }

  $taskScene.on('answer-change', function() {
    var checkedAnswerPresent;

    if ( $('.task-answer-item.check').length ) {
      checkedAnswerPresent = true;
    } else {
      checkedAnswerPresent = false;
    }

    if ( checkedAnswerPresent ) {
      $('.task-submit').removeClass('disable');
    } else {
      $('.task-submit').addClass('disable');
    }
  });

  $taskScene.on('submit', function() {

    $('.task-submit').addClass('block');
    $('.task-answer-item').addClass('block');
    
    var correctAnswerCheck = $('.task-answer-item.check[data-correct]').length;
    var incorrectAnswerCheck = $('.task-answer-item.check:not([data-correct])').length;
    var correctAnswerNotCheck = $('.task-answer-item[data-correct]:not(.check)').length;

    if (correctAnswerCheck && !incorrectAnswerCheck && !correctAnswerNotCheck) {
      $taskScene.trigger('success');
    } else if (correctAnswerNotCheck && !incorrectAnswerCheck) {
      $taskScene.trigger('success-partly');
    } else {
      $taskScene.trigger('failure');
    }
  });

  $taskScene.on('after-submit', function() {
    $('.task-submit').removeClass('block');
    $('.task-answer-item').removeClass('block');
  });

  $taskScene.on('success', function() {
    $('.task-submit').addClass('success');

    setTimeout(function() {
      $('.task-submit').fadeOut();
      $('.task-answers').fadeOut();
      $('.task-text').fadeOut();
      $('.task-hint').fadeOut();
    }, 1500);
  });

  $taskScene.on('success-partly', function() {
    $('.task-submit').addClass('danger');

    setTimeout(function() {
      $('.task-answer-item.check').addClass('smooth');
      $taskScene.uncheckAnswers();
      $('.task-submit').addClass('smooth').removeClass('danger');
      $('.task-hint').fadeOut('slow', function() {
        $(this).html( $(this).data('success-partly') ).fadeIn('slow');
      });

      setTimeout(function() {
        $('.task-submit').removeClass('smooth');
        $('.task-answer-item').removeClass('smooth');

        $taskScene.trigger('after-submit');
      }, 1000);
    }, 1000);

  });

  $taskScene.on('failure', function() {
    $('.task-submit').addClass('danger');
    $('.task-answer-item.check:not([data-correct])').addClass('danger');

    setTimeout(function() {
      $('.task-answer-item.check').addClass('smooth').removeClass('danger');
      $taskScene.uncheckAnswers();
      $('.task-submit').addClass('smooth').removeClass('danger');
      $('.task-hint').fadeOut('slow', function() {
        $(this).html( $(this).data('failure') ).fadeIn('slow');
      });

      setTimeout(function() {
        $('.task-submit').removeClass('smooth');
        $('.task-answer-item').removeClass('smooth');
        $taskScene.trigger('after-submit');
      }, 1000);
    }, 1000);
  });

})();