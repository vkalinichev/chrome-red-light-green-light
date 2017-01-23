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
        const id = target.dataset.id

        if ( !id ) return

        saveActive( id, function () {
            setActiveButton( target )
            getState( id, updateIcon )
            setTimeout( window.close, 150 )
        } )
    }

    function getState( data, callback ) {
        chrome.runtime.sendMessage( { type: GET_STATE, data }, callback )
    }

    function updateIcon( occupied ) {
        chrome.browserAction.setIcon({
            path: `./images/icon_32${ occupied ? '_occupied' : ''}.png`
        })
    }

    function getInitialStates() {
        chrome.storage.sync.get( ( { active } ) => {
            document.body.querySelectorAll( '[data-id]' ).forEach( element =>
                getState( element.dataset.id, function ( occupied ) {
                    element.classList.toggle( 'floor_active', element.dataset.id === active )
                    element.classList.toggle( 'floor_occupied', occupied )
                } )
            )
        } )
    }

    function saveActive ( active, callback ) {
        chrome.storage.sync.set( { active }, callback )
    }

    function setActiveButton( activeElement ) {
        document.body.querySelectorAll( '.floor_active' ).forEach( element =>
            element.classList.remove( 'floor_active' )
        )
        activeElement.classList.add( 'floor_active' )
    }

} )()