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
* Erik Woodworth - Firebase integration
* AJ Jordan - WebAudio ossilator and other parameter fucntions 
* Hayden Estes - visual design layout, user validation

UI/Code Logic:
* Enter name
* Click submit
    - add "hidden" class to <input> and <button id="submit button">
    - remove "hidden" class from UI container
    - initiate Firebase connection
        * create myConnectionKey variable 
    - add buttons to "button-box" for each connected user
        * add id = `play-${connectionKey}` 
        * add text with user's input name
        * add value =`${connectionKey}` value
        * add `off` status
* Click user button (if status=`off`)
    - change status to `on`
    - create audioContext = `audioCtx-${this.val()}`
    - add a listener in `audioCtx-${this.val()}` for value changes on Firebase in `/connectedUsers/${connectedUserKey}` to change parameter values in created audioContext
        * touchStatus boolean
        * oscilator params
        * audioSource params
    - if touchStatus = `true`
        * call the function audioCtx-${connectedUserKey}.play()
    - if touchStatus = `false`
        * call the function audioCtx-${connectedUserKey}.stop()
* Click user button (if status=`on`)
    - change status to `off`
    - call the function audioCtx-${connectedUserKey}.stop()
    - turn off listener to Firebase
* On mousedown or touchdown in trackpad area
    - call TouchPad function to set values on Firebase in `/connectedUsers/${connectedUserKey}`
        * SEE DIAGRAM
* On mouseup or touchup in trackpad area
    - set touchStatus = `false`
* When user disconnects
    - delete button with id = `play-${connectedUserKey}`
    - remove `/connectedUsers/${connectedUserKey}` from Firebase