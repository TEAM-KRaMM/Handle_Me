'use strict';

var app = app || {};

(function (module){

  const words = {};
  
  words.formResult = []
  var values = [];
  console.log(values);
  $('Form').submit(function() {
      event.preventDefault()
      $.each($('Form').serializeArray(), function(i, field) {
        values.push(field.value) 
        console.log("values",values)
      })
    
    values.forEach(function(each){
      console.log(each)
      if(each){
        words.answersArray.push(each)
      }
    });
    page('/gen');
});



  // this array will contain 3 arrays of data from API
  words.genArray = []

// Array of values from the survey submited by the user 
 words.answersArray = []



  words.requestWords = function (callback){
    console.log("answersArray",words.answersArray.length)
    words.genArray = [];
    words.answersArray.forEach(function(value){
      console.log('inside for each')
      $.get('/datamuse/api/' + value)
        .then ( function(data) {
        //Clear existing genArray before repopulating
        console.log("data:",data);
        words.genArray.push(data);
        console.log("genArray:",words.genArray);
        
        if (words.genArray.length === 3 ) {
          callback(); 
          }
        })
     })
   }


  //Array of three words appended to slots
  words.slotArray = [];

  //Takes object of all possible words for all three slots. Returns an array containing a randomly selected word for each slot
  words.randomizeAll = function () {
    //resets words.slotArray to empty string so it can be repopulated when re-rolling the Generator
    words.slotArray.length=0;
    app.words.genArray.forEach(function(array){
      //Convert string to valid array
      let possibleWords = JSON.parse(array.body);
      let randomNumber = Math.floor(Math.random() * possibleWords.length);
      words.slotArray.push(possibleWords[randomNumber].word);
    });
    console.log('your words are', words.slotArray);
  }

  
 

  module.words = words

})(app);



