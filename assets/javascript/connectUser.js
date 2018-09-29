window.onload = function () {


    $(`#user-you`).click(function () {


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

        // var remoteAudioParams = database.ref(`/audioContexts`);

        // When the client's connection state changes...
        connectedRef.on("value", function (snapshot) {

            console.log(snapshot.key);
            console.log(connectionLog);

            // If they are connected..
            if (snapshot.val()) {

                // Add user to the connections list.
                var connection = connectionLog.push(true);
                console.log(snapshot.id);
                console.log(snapshot);


                // Remove user from the connection list when they disconnect.
                connection.onDisconnect().remove();
            }
        });
    })
}