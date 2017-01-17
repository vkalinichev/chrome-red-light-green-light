( function () {

    if ( !chrome || !chrome.i18n ) return

    document.documentElement.lang = chrome.i18n.getUILanguage()
    document.body.querySelectorAll( '[data-i18n]').forEach( function ( element ) {
        const key = element.dataset.i18n
        element.textContent = chrome.i18n.getMessage( key )
    } )

} )()