// Initialize Firebase

var config = {
  apiKey: "AIzaSyDRol3DvQ2343emS0aQ-iJGHsaGuCGbECc",
  authDomain: "noise-manipulator.firebaseapp.com",
  databaseURL: "https://noise-manipulator.firebaseio.com",
  projectId: "noise-manipulator",
  storageBucket: "noise-manipulator.appspot.com",
  messagingSenderId: "464135295056"
};

firebase.initializeApp(config);

var database = firebase.database();

var connectionLog = database.ref(`/connectedUsers`);

var connectedRef = database.ref(".info/connected");

var uid = Math.floor(Math.random() * 1001) + 1000;
var connectionKey = "";

// synthpad function
var SynthPad = (function () {
  // Variables
  var myCanvas;
  var frequencyLabel;
  var volumeLabel;

  var myAudioContext;
  var oscillator;
  var gainNode;


  // Notes
  var lowNote = 261.63; // C4
  var highNote = 493.88; // B4



  // Constructor
  var SynthPad = function () {
    myCanvas = document.getElementById('touchpad');
    frequencyLabel = document.getElementById('frequency');
    volumeLabel = document.getElementById('volume');

    // Create an audio context.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    myAudioContext = new window.AudioContext();

    SynthPad.setupEventListeners();
  };


  // Event Listeners
  SynthPad.setupEventListeners = function () {

    // Disables scrolling on touch devices.
    document.body.addEventListener('touchmove', function (event) {
      // event.preventDefault();
    }, false);

    myCanvas.addEventListener('mousedown', SynthPad.playSound);
    myCanvas.addEventListener('touchstart', SynthPad.playSound);

    myCanvas.addEventListener('mouseup', SynthPad.stopSound);
    document.addEventListener('mouseleave', SynthPad.stopSound);
    myCanvas.addEventListener('touchend', SynthPad.stopSound);
  };


  // Play a note.
  SynthPad.playSound = function (event) {
    oscillator = myAudioContext.createOscillator();
    gainNode = myAudioContext.createGain();

    oscillator.type = 'triangle';

    gainNode.connect(myAudioContext.destination);
    oscillator.connect(gainNode);

    SynthPad.updateFrequency(event);

    oscillator.start(0);

    myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);

    myCanvas.addEventListener('mouseout', SynthPad.stopSound);
  };


  // Stop the audio.
  SynthPad.stopSound = function (event) {
    oscillator.stop(0);

    myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
    myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
  };


  // Calculate the note frequency.
  SynthPad.calculateNote = function (posX) {
    var noteDifference = highNote - lowNote;
    var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
    return lowNote + noteOffset;
  };


  // Calculate the volume.
  SynthPad.calculateVolume = function (posY) {
    var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
    return volumeLevel;
  };


  // Fetch the new frequency and volume.
  SynthPad.calculateFrequency = function (x, y) {
    var noteValue = SynthPad.calculateNote(x);
    var volumeValue = SynthPad.calculateVolume(y);

    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;

    database.ref(`/connectedUsers/${connectionKey}`).set({
      param1: noteValue,
      param2: volumeValue,
    })    

    frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';

    return noteValue, volumeValue;
  };


  // Update the note frequency.
  SynthPad.updateFrequency = function (event) {
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      SynthPad.calculateFrequency(event.x, event.y);
    } else if (event.type == 'touchstart' || event.type == 'touchmove') {
      var touch = event.touches[0];
      SynthPad.calculateFrequency(touch.pageX, touch.pageY);
    }
  };


  // Export SynthPad.
  return SynthPad;
})();


  // Initialize the page.
  // window.onload = function() {
  //   var synthPad = new SynthPad();
  // }
