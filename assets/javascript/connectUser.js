

window.onload = function () {


    $(`#user-you`).on(`click`, function () {
    var synthPad = new SynthPad();


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

        var remoteAudioParams = database.ref(`/audioContexts`);

        // When the client's connection state changes...
        connectedRef.on("value", function (snapshot) {

            // Create unique ID --- SHOULD BE LONGER
            var uid = Math.floor(Math.random() * 1001) + 1000;

            // If they are connected..
            if (snapshot.val()) {

                // Add user to the connections list.
                var connection = connectionLog.push({
                    uid: uid
                });

                // If first user...create Firebase /audioContexts folders and 8 audioContext objects and add created uid and map touchpad parameters to the first audioContext object.

                // Else...find first Firebase audioContext with a null uid and add created uid and map touchpad parameters to it.

                // Remove user from the connection list when they disconnect.

                connection.onDisconnect().remove()

                //...and set uid and touchpad paraemeters to null in Firebase audioConext object.
            }
        });
    })

}