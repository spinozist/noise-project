window.onload = function () {

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

    // var connectedRef = database.ref(".info/connected");

    var myConnectionKey = connectionLog.push().key;

    // var connectionKey;

    // When the client's connection state changes...

    // connectedRef.on("value", function (snapshot) {

    //     // If they are connected..
    //     if (snapshot.val()) {


    //         connectionKey = connectionLog.push().key;

    //         console.log(connectionLog);

    //         console.log(connectionKey);

    //         // var synthPad = new SynthPad();

    //         connection.onDisconnect().remove()

    //     }
    // });

    var createButtons = function () {

        database.ref(`/connectedUsers/${myConnectionKey}/`).set({
            touchStatus: false,
            param1: "",
            param2: "",
        });

        database.ref(`/connectedUsers/${myConnectionKey}/`).onDisconnect().remove()

        // connectionKeys.push(myConnectionKey);

        // for (i = 0; i < 3; i++) {

        // var firebaseRef = database.ref(`/connectedUsers/`)[i].object;

        // console.log(firebaseRef);

        // **Define by indexing through Firebase

        connectionLog.on(`child_added`, function (childSnapshot) {

            var connectionKey = childSnapshot.key;

            console.log(connectionKey);

            if (myConnectionKey === connectionKey) {

                var button = $(`<a>`).css(`margin-left`, `10px`);
                button.attr(`class`, `btn-floating btn-large waves-effect pulse waves-light red`)
                    .attr(`id`, `play-${connectionKey}`)
                    .attr(`value`, connectionKey)
                    .html(`
            <i class="material-icons">
            play_circle_outline</i>`)

                $(`#user-buttons`).append(button);

            }

            else {
                var button = $(`<a>`).css(`margin-left`, `10px`);
                button.attr(`class`, `btn-floating btn-large waves-effect waves-light red`)
                    .attr(`id`, `play-${connectionKey}`)
                    .attr(`value`, connectionKey)
                    .html(`
            <i class="material-icons">
            play_circle_outline</i>`)

                $(`#user-buttons`).append(button);
            }


            $(`#play-${connectionKey}`).on(`click`, function () {


                var connectionKey = $(this).attr(`value`);
                var myTouchStatus = false;
                var remoteNoteValue;
                var remoteVolumeLevel;
                var remoteTouchStatus = false;


                var SynthPad = (function () {

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

                        if (myConnectionKey === connectionKey) {
                            // Disables scrolling on touch devices.
                            document.body.addEventListener('touchmove', function (event) {
                                event.preventDefault();
                            }, false);

                            myCanvas.addEventListener('mousedown', SynthPad.playSound);
                            myCanvas.addEventListener('touchstart', SynthPad.playSound);

                            myCanvas.addEventListener('mouseup', SynthPad.stopSound);
                            myCanvas.addEventListener('mouseleave', SynthPad.stopSound);
                            myCanvas.addEventListener('touchend', SynthPad.stopSound);

                        }

                        else {

                            database.ref(`/connectedUsers/${connectionKey}`).on(`value`, function (childSnapshot) {
                                remoteNoteValue = childSnapshot.val().param1;
                                remoteVolumeLevel = childSnapshot.val().param2;
                                remoteTouchStatus = childSnapshot.val().touchStatus;
                            });
                        }



                    };

                    // Play a note.
                    SynthPad.playSound = function (event) {


                        if (myConnectionKey === connectionKey) {
                            myTouchStatus = true;
                            oscillator = myAudioContext.createOscillator();
                            gainNode = myAudioContext.createGain();

                            oscillator.type = 'triangle';
                            

                            gainNode.connect(myAudioContext.destination);
                            oscillator.connect(gainNode);
                            SynthPad.updateFrequency(event);
                            oscillator.start(0);

                            myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
                            myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
                            myCanvas.addEventListener('touchend', SynthPad.stopSound);
                            myCanvas.addEventListener('mouseout', SynthPad.stopSound);
                        }

                        else if (remoteTouchStatus === true) {
                            oscillator = myAudioContext.createOscillator();
                            gainNode = myAudioContext.createGain();

                            oscillator.type = 'triangle';

                            gainNode.connect(myAudioContext.destination);
                            oscillator.connect(gainNode);
                            SynthPad.updateFrequency();
                            oscillator.start(0);
                        }


                    };

                    // Stop the audio.
                    SynthPad.stopSound = function (event) {

                        myTouchStatus = false;

                        if (myConnectionKey === connectionKey) {

                            SynthPad.updateFrequency(event);
                            oscillator.stop(0);

                            myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
                            myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
                            myCanvas.removeEventListener('touchend', SynthPad.stopSound);
                            myCanvas.removeEventListener('mouseout', SynthPad.stopSound);
                        }
                        else if (remoteTouchStatus === false) {
                            SynthPad.updateFrequency();
                            oscillator.stop(0);
                        }


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

                    // Fetch the new frequency and volume LOCAL.
                    SynthPad.calculateFrequency = function (x, y) {

                        if (myConnectionKey === connectionKey) {
                            var noteValue = SynthPad.calculateNote(x);
                            var volumeValue = SynthPad.calculateVolume(y);

                            oscillator.frequency.value = noteValue;
                            gainNode.gain.value = volumeValue;

                            database.ref(`/connectedUsers/${connectionKey}`).set({
                                touchStatus: myTouchStatus,
                                param1: noteValue,
                                param2: volumeValue,
                            });

                        } else {
                            oscillator.frequency.value = remoteNoteValue;
                            gainNode.gain.value = remoteVolumeLevel;
                        }

                        frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
                        volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
                    };

                    // Update the note frequency.
                    SynthPad.updateFrequency = function (event) {
                        if (myConnectionKey === connectionKey) {
                            if (event.type == 'mousedown' || event.type == 'mousemove') {
                                SynthPad.calculateFrequency(event.x, event.y);
                            } else if (event.type == 'touchstart' || event.type == 'touchmove') {
                                var touch = event.touches[0];
                                SynthPad.calculateFrequency(touch.pageX, touch.pageY);
                            }
                        } else {
                            SynthPad.calculateFrequency();
                            //write touchStatus to Firebase
                        }
                    };
                    // Export SynthPad.
                    return SynthPad;
                })();
                var synthPad = new SynthPad();
            });
        });


        connectionLog.on(`child_removed`, function (childSnapshot) {

            var connectionKey = childSnapshot.key;

            console.log(`Disconnected: ${connectionKey}`);

            var buttonToRemove = $(`#play-${connectionKey}`);
            buttonToRemove.remove();
        });
    }
    createButtons();
};
