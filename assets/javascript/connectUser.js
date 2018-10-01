

window.onload = function () {

    var uid = Math.floor(Math.random() * 1001) + 1000;

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


        // When the client's connection state changes...
        connectedRef.on("value", function (snapshot) {

            // Create unique ID --- SHOULD BE LONGER

            // If they are connected..
            if (snapshot.val()) {

                // Add user to the connections list.
                var connection = connectionLog.push({
                    uid: uid,
                    param1: "",
                    param2: "",

                });

                connection.onDisconnect().remove()

            }
        });

    })

}