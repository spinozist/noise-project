

window.onload = function () {

    $(`#user-you`).on(`click`, function () {

        // When the client's connection state changes...
        connectedRef.on("value", function (snapshot) {

            // If they are connected..
            if (snapshot.val()) {

                // Add user to the connections list.
                var connection = connectionLog.push({
                    uid: uid,
                    param1: "test1",
                    param2: "test2",

                });

                // console.log(connectedRef.param1);
                // console.log(connectionLog.push().key);
                console.log(connectionLog);

                connectionKey = connectionLog.push().key;
                console.log(connectionKey);
                // return connectionKey;
                
                var synthPad = new SynthPad();

                connection.onDisconnect().remove()

            }
        });

    })

};