'use strict';

var app = app || {};

(function (module) {

  const genView = {};

  genView.appendSocial = function () {
    app.words.checkInst()
    app.words.checkGit()
    app.words.checkTwit()
  }

  genView.init = function () {
    $('.generator').show().siblings().hide();
    genView.populateSlots();
  };

  //  This function will repopulate slots when user clicks re-roll button
  $('#re-roll').click(function () {
    app.genView.populateSlots()
  });

  // Concat options listener
  $('#concatOptions').on('change', function () {
    app.words.concatType = this.value;
    app.genView.updateCurrentHandle();
  })

  // Append our app.words.slotArray to the DOM
  genView.appendWords = function () {
    app.words.slotArray.forEach(function (arrayEle, currentIndex, array) {
      let idName = '#slot' + (currentIndex + 1);

      if ($(idName).attr('data-saved') !== 'true') { $(idName).text(arrayEle); }

      //Update currentHandle variable
      genView.updateCurrentHandle();

      //Add event listener to toggle "data-saved" status
      $(idName).off('click');
      $(idName).on('click', function () {
        $(idName).attr('data-saved') === 'true' ? $(idName).attr('data-saved', false) : $(idName).attr('data-saved', true);
        console.log(idName, 'is clicked. data-saved value is', $(idName).attr('data-saved'))
      })

    });
  }

  //Update currentHandle with current displayed handle
  genView.updateCurrentHandle = function () {
    app.words.currentHandle = '';

    //Append each slot element to current handle, based on value of concatType variable
    for (let i = 0; i < $('.slots').children().length; i++) {
      switch (app.words.concatType) {
        case 'camelCase':
          if (i > 0) {
            let newElement = $('.slots').children().eq(i).text().split('');
            newElement[0] = newElement[0].toUpperCase();
            app.words.currentHandle += newElement.join('');
            break;
          }
        case 'hyphenated':
          if (i > 0) {
            app.words.currentHandle += '-' + $('.slots').children().eq(i).text();
            break;
          }
        case 'snakeCase':
          if (i > 0) {
            app.words.currentHandle += '_' + $('.slots').children().eq(i).text();
            break;
          }
        case 'none':
          app.words.currentHandle += $('.slots').children().eq(i).text();
      }
    }

    // CurrentHandle appends to DOM
    $('#yourHandle').text(app.words.currentHandle);
  }

  // Poplate all slots
  genView.populateSlots = function () {
    app.words.randomizeAll()
    genView.appendWords()
    // TODO: Uncomment before presenting
    genView.appendSocial()
    app.words.populateFaves()
  }

  module.genView = genView

})(app);

