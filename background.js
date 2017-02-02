( function () {

    const GET_STATE = 'GET_STATE'
    const SET_ACTIVE = 'SET_ACTIVE'
    const SCHEDULE = {
        "2-1": [ [ "9:00", "9:15" ], [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
        "2-2": [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ] ],
        "2-3": [ [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
        "2-4": [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ], [ "20:00", "22:00" ] ],
        "2-5": [ [ "9:45", "10:00" ], [ "10:30", "10:45" ], [ "11:15", "11:30" ], [ "12:00", "12:15" ], [ "12:45", "13:00" ], [ "13:30", "13:45" ], [ "14:15", "14:30" ], [ "15:00", "15:15" ], [ "15:45", "16:00" ], [ "16:30", "16:45" ], [ "17:15", "17:30" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
        "3-1": [ [ "9:00", "9:15" ], [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
        "3-2": [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ] ],
        "3-3": [ [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
        "3-4": [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ] ],
        "3-5": [ [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
    }

    function getNow() {
        // return Date.now()
        return +new Date( '2017/02/02 11:15:01' )
    }

    bindEvents()
    getActiveFloor()
        .then( floor => {
            const occupiedRange = getFloorRange( floor )

            if ( occupiedRange && occupiedRange[1] ) {

                const freeTime = occupiedRange[ 1 ]
                const [ freeHour, freeMinutes ] = freeTime.split( ':' )

                const now = new Date( getNow() )

                const freeDate = new Date( now.getFullYear(), now.getMonth(), now.getDate(), freeHour, freeMinutes )

                const minutesLeft = getMinutesLeft( freeDate )

                setBadge( {
                    text: minutesLeft,
                    color: '#000'
                } )
                setIcon( true )
            } else {
                setBadge( { text: '' } )
                setIcon( false )
            }
        })


    function getMinutesLeft( time ) {
        const minutesLeft = ( time - getNow() ) / 60 / 1000
        if ( minutesLeft < 10 ) {
            return Math.ceil( minutesLeft ) + 'm'
        } else if ( minutesLeft < 60 ) {
            return Math.ceil( minutesLeft ) + 'm'
        } else {
            return '>1h'
        }
    }

    function bindEvents() {
        chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ) {
            switch ( request.type ) {
                case GET_STATE: {
                    return sendResponse( getFloorRange( request.data ) )
                }
                case SET_ACTIVE: {
                    break
                }
                default:
            }
        } )
    }

    function setBadge( { color, text } ) {
        if ( text !== undefined ) {
            chrome.browserAction.setBadgeText( { text } )
        }
        if ( color !== undefined ) {
            chrome.browserAction.setBadgeBackgroundColor( { color } )
        }
    }

    function setIcon( occupied ) {
        const iconName = occupied ? 'icon_32_occupied.png' : 'icon_32.png'
        chrome.browserAction.setIcon({ path: `./images/${ iconName }` })
    }

    function getActiveFloor() {
        return new Promise( resolve => chrome.storage.sync.get( res => resolve( res[ 'active' ])))
    }

    function getFloorRange( floor ) {
        const ranges = SCHEDULE[ floor ]
        return ranges.find( isTimeInRange( getNow() ) )
    }

    function parseRange( [ start, end ] ) {
        const [ startHours, startMinutes ] = start.split(':')
        const [ endHours, endMinutes ] = end.split(':')

        return {
            startHours: +startHours,
            startMinutes: +startMinutes,
            endHours: +endHours,
            endMinutes: +endMinutes
        }
    }

    function isTimeInRange( time ) {
        return function ( range ) {
            const { startHours, startMinutes, endHours, endMinutes } = parseRange( range )

            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth()
            const date = now.getDate()

            const startTime = new Date( year, month, date, startHours, startMinutes, 0 )
            const endTime = new Date( year, month, date, endHours, endMinutes, 0 )

            return time > startTime && time < endTime
        }
    }

} )()