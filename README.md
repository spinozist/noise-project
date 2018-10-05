# Project1

**MULTIUSER NOISE MANIPULATOR**

Audo APIs:
* https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
* http://www.sonicapi.com/
* https://developer.spotify.com/documentation/web-api/
* https://tonejs.github.io/docs/

x,y touch interface:
* mostly touchpad
* parameter assigner (i.e. x=frequency; y=amplitude)
	
interface converter functions
* ratio of x or y of touch/click range to ratio of parameter range
	
Firebase:
* play along with other connected users 


Task assignments:
* Erik Woodworth - WebAudio source integration and other parameter functions
* AJ Jordan - WebAudio ossilator and other parameter fucntions 
* Hayden Estes - visual design layout, user validation

UI/Code Logic:
* Enter name
* Click submit
    - add "hidden" class to <input> and <button id="submit button">
    - remove "hidden" class from UI container
    - add buttons to "button-box" for each connected user (including self)
        *  add id = id 
        *  add text with user's input name
        *  add value =`${connectedUserKey}` value
        *  add `off` status
* Click user button (if status=`off`)
    - change status to `on`
    - create audioContext = `audioCtx-${this.val()}`
        * SEE Diagram
    - add listener for value change on Firebase in `/connectedUsers/${connectedUserKey}` to change parameter values in created audioContext
        * mousedown or touchdown boolean
        * oscilator params
        * audioSource params
    - if mousedown or touchdown = `true`
        * call the function audioCtx-${connectedUserKey}.play()
    - if mousedown or touchdown = `false`
        * call the function audioCtx-${connectedUserKey}.stop()
* Click user button (if status=`on`)
    - change status to `off`
    - call the function audioCtx-${connectedUserKey}.stop()
    - turn off listener to Firebase
* When user disconnects
    - delete button with id = `play-${connectedUserKey}`

