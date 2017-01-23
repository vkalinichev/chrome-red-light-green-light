( function () {

    const GET_STATE = 'GET_STATE'
    const SET_ACTIVE = 'SET_ACTIVE'

    if ( !chrome ) return

    localize()
    bindEvents()

    setTimeout( getInitialStates, 0 ) // because of async nature of chrome message API

    function localize() {
        if ( !chrome.i18n ) return

        document.documentElement.lang = chrome.i18n.getUILanguage()
        document.body.querySelectorAll( '[data-i18n]' ).forEach( element =>
            element.textContent = chrome.i18n.getMessage( element.dataset.i18n )
        )
    }

    function bindEvents() {
        document.body.addEventListener( 'click', onFloorSelect )
    }

    function onFloorSelect( { target } ) {
        if ( target.dataset.id ) {
            setActiveButton( target )
            saveActive( target.dataset.id )
        }
    }

    function getState( data, callback ) {
        chrome.runtime.sendMessage( { type: GET_STATE, data }, callback )
    }

    function getInitialStates() {
        document.body.querySelectorAll( '[data-id]' ).forEach( element =>
            getState( element.dataset.id, function ( occupied ) {
                if ( occupied ) {
                    element.classList.add( 'floor_occupied' )
                } else {
                    element.classList.remove( 'floor_occupied' )
                }
            } )
        )
    }

    function saveActive ( data, callback ) {
        chrome.runtime.sendMessage( { type: SET_ACTIVE, data }, callback )
    }

    function setActiveButton( activeElement ) {
        document.body.querySelectorAll( '.floor_active' ).forEach( element =>
            element.classList.remove( 'floor_active' )
        )
        activeElement.classList.add( 'floor_active' )
    }

} )()