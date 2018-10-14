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

    var myConnectionKey = connectionLog.push().key;

    var type = "sine";
    
    $(`.type`).click(function(){
        type = $(this).val();
        // $(this).attr(`class`, `type-active`);
    })

    var createButtons = function () {

        database.ref(`/connectedUsers/${myConnectionKey}/`).set({
            touch_Status: false,
            param1: "",
            param2: "",
            osc_type: "sine"
        });

        database.ref(`/connectedUsers/${myConnectionKey}/`).onDisconnect().remove()


        connectionLog.on(`child_added`, function (childSnapshot) {

            var connectionKey = childSnapshot.key;

            console.log(connectionKey);

            if (myConnectionKey === connectionKey) {

                var button = $(`<a>`).css(`margin-left`, `10px`);
                button.attr(`class`, `btn-floating btn-large waves-effect pulse waves-light green`)
                    .attr(`id`, `play-${connectionKey}`)
                    .attr(`value`, connectionKey)
                    .html(`
                        <i class="material-icons">
                        play_circle_outline</i>
                        `);

                $(`#user-buttons`).append(button);

            }

            else {
                var button = $(`<a>`).css(`margin-left`, `10px`);
                button.attr(`class`, `btn-floating btn-large waves-effect waves-light green`)
                    .attr(`id`, `play-${connectionKey}`)
                    .attr(`value`, connectionKey)
                    .html(`
                        <i class="material-icons">
                        play_circle_outline</i>
                        `);

                $(`#user-buttons`).append(button);
            }


            $(`#play-${connectionKey}`).on(`click`, function () {

                var connectionKey = $(this).attr(`value`);

                if (myConnectionKey === connectionKey) {

                    $(this).attr(`class`, `btn-floating btn-large waves-effect pulse waves-light red`)
                        .attr(`id`, `pause-${connectionKey}`)
                        .html(`
                            <i class="material-icons">
                            pause_circle_outline</i>
                            `);

                } else {

                    $(this).attr(`class`, `btn-floating btn-large waves-effect waves-light red`)
                        .attr(`id`, `pause-${connectionKey}`)
                        .html(`
                            <i class="material-icons">
                            pause_circle_outline</i>
                            `);

                }

                var SynthPad = (function () {

                    if (myConnectionKey === connectionKey) {


                        var myCanvas;
                        var frequencyLabel;
                        var volumeLabel;

                        var myAudioContext;
                        var oscillator;
                        var gainNode;
                        var touchStatus = false;


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

                            document.addEventListener('touchmove', function (event) {
                                event.preventDefault();
                            }, false);

                            myCanvas.addEventListener('mousedown', SynthPad.playSound);
                            myCanvas.addEventListener('touchstart', SynthPad.playSound);

                            myCanvas.addEventListener('mouseup', SynthPad.stopSound);
                            myCanvas.addEventListener('mouseleave', SynthPad.stopSound);
                            myCanvas.addEventListener('touchend', SynthPad.stopSound);

                        };

                        // Play a note.
                        SynthPad.playSound = function (event) {
                            touchStatus = true;

                            oscillator = myAudioContext.createOscillator();
                            gainNode = myAudioContext.createGain();

                            oscillator.type = type;

                            gainNode.connect(myAudioContext.destination);
                            oscillator.connect(gainNode);


                            oscillator.start(0);

                            myCanvas.addEventListener('mousemove', SynthPad.updateFrequency);
                            myCanvas.addEventListener('touchmove', SynthPad.updateFrequency);
                            myCanvas.addEventListener('touchend', SynthPad.stopSound);
                            myCanvas.addEventListener('mouseout', SynthPad.stopSound);

                            SynthPad.updateFrequency(event);


                        };

                        // Stop the audio.
                        SynthPad.stopSound = function (event) {

                            touchStatus = false;

                            oscillator.stop(0);

                            SynthPad.calculateFrequency();


                            myCanvas.removeEventListener('mousemove', SynthPad.updateFrequency);
                            myCanvas.removeEventListener('touchmove', SynthPad.updateFrequency);
                            myCanvas.removeEventListener('touchend', SynthPad.stopSound);
                            myCanvas.removeEventListener('mouseout', SynthPad.stopSound);

                            SynthPad.updateFrequency(event);
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

                            var noteValue = SynthPad.calculateNote(x);
                            var volumeValue = SynthPad.calculateVolume(y);

                            oscillator.frequency.value = noteValue;
                            gainNode.gain.value = volumeValue;

                            frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
                            volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';

                            database.ref(`/connectedUsers/${connectionKey}`).set({
                                touch_Status: touchStatus,
                                param1: noteValue,
                                param2: volumeValue,
                                type: type,
                            });
                        };

                        // Update the note frequency.
                        SynthPad.updateFrequency = function (event) {

                            if (event.type == 'mousedown' || event.type == 'mousemove') {
                                // touchStatus = true;
                                SynthPad.calculateFrequency(event.x, event.y);
                            }

                            else if (event.type == 'touchstart' || event.type == 'touchmove') {
                                // touchStatus = true;
                                var touch = event.touches[0];
                                SynthPad.calculateFrequency(touch.pageX, touch.pageY);
                            }

                            else {
                                touchStatus = false;
                                SynthPad.calculateFrequency(0, 0);
                            }

                        };
                        return SynthPad;
                    }

                    else {

                        var remoteNoteValue;
                        var remoteVolumeValue;
                        var remoteTouchStatus;
                        var remoteAudioContext;
                        var remoteType;
                        var remoteOscillator;
                        var remoteGainNode;
                        var playStatus = false;

                        // Constructor
                        var SynthPad = function () {
                            window.AudioContext = window.AudioContext || window.webkitAudioContext;
                            remoteAudioContext = new window.AudioContext();

                            database.ref(`/connectedUsers/${connectionKey}`).on(`value`, function (snapshot) {

                                remoteNoteValue = snapshot.val().param1;
                                remoteVolumeLevel = snapshot.val().param2;
                                remoteTouchStatus = snapshot.val().touch_Status;
                                remoteType = snapshot.val().osc_type;

                                if (playStatus === false && remoteTouchStatus === true) {
                                    playStatus = true;
                                    SynthPad.playSound();                                    
                                } else if (playStatus === true && remoteTouchStatus === true) {
                                    SynthPad.updateFrequency()                                    
                                } else {
                                    SynthPad.stopSound();
                                };
                            });
                        };

                        SynthPad.buildOscillator = function () {
                            remoteOscillator = remoteAudioContext.createOscillator();
                            remoteGainNode = remoteAudioContext.createGain();
                            remoteOscillator.type = remoteType;
                            remoteGainNode.connect(remoteAudioContext.destination);
                            remoteOscillator.connect(remoteGainNode);
                        };

                        SynthPad.playSound = function () {
                            SynthPad.buildOscillator();
                            remoteOscillator.start(0);
                        };

                        // Stop the audio.
                        SynthPad.stopSound = function () {
                            playStatus = false;
                            remoteOscillator.stop(0);
                        };

                        // Update the note frequency.
                        SynthPad.updateFrequency = function () {
                            remoteOscillator.frequency.value = remoteNoteValue;
                            remoteGainNode.gain.value = remoteVolumeValue;
                        };

                        // Export SynthPad.
                        return SynthPad;
                    }

                })();

                SynthPad();

                $(`#pause-${connectionKey}`).on(`click`, function () {

                    if (myConnectionKey === connectionKey) {

                        $(this).attr(`class`, `btn-floating btn-large waves-effect pulse waves-light green`)
                            .attr(`id`, `play-${connectionKey}`)
                            .html(`
                                <i class="material-icons">
                                play_circle_outline</i>
                                `);

                        // myAudioContext.close();

                    } else {

                        $(this).attr(`class`, `btn-floating btn-large waves-effect waves-light green`)
                            .attr(`id`, `play-${connectionKey}`)
                            .html(`
                                <i class="material-icons">
                                play_circle_outline</i>
                                `);
                                
                        // remoteAudioContext.close();
                    }
                });

            });

            connectionLog.on(`child_removed`, function (childSnapshot) {

                var connectionKey = childSnapshot.key;

                console.log(`Disconnected: ${connectionKey}`);

                var buttonToRemove = $(`#play-${connectionKey}`);
                var otherButtonToRemove = $(`#pause-${connectionKey}`);

                otherButtonToRemove.remove();
                buttonToRemove.remove();
            });

        });



    }
    createButtons();
};
