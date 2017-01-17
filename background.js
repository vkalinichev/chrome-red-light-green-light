( function () {

    const GET_STATE = 'GET_STATE'
    const SET_ACTIVE = 'SET_ACTIVE'
    const SCHEDULE = {
        2: {
            1: [ [ "9:00", "9:15" ], [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
            2: [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ] ],
            3: [ [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
            4: [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ] ],
            5: [ [ "9:45", "10:00" ], [ "10:30", "10:45" ], [ "11:15", "11:30" ], [ "12:00", "12:15" ], [ "12:45", "13:00" ], [ "13:30", "13:45" ], [ "14:15", "14:30" ], [ "15:00", "15:15" ], [ "15:45", "16:00" ], [ "16:30", "16:45" ], [ "17:15", "17:30" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ]
        },
        3: {
            1: [ [ "9:00", "9:15" ], [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
            2: [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ] ],
            3: [ [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
            4: [ [ "10:15", "10:30" ], [ "11:15", "11:30" ], [ "12:15", "12:30" ], [ "13:15", "13:30" ], [ "14:15", "14:30" ], [ "15:15", "15:30" ], [ "16:15", "16:30" ], [ "17:15", "17:30" ], [ "18:15", "18:30" ] ],
            5: [ [ "10:00", "10:15" ], [ "11:00", "11:15" ], [ "12:00", "12:15" ], [ "13:00", "13:15" ], [ "14:00", "14:15" ], [ "15:00", "15:15" ], [ "16:00", "16:15" ], [ "17:00", "17:15" ], [ "18:00", "18:15" ], [ "18:45", "19:00" ] ],
        }
    }

    bindEvents()

    function parseData( data ) {
        const parsedData = data.split( '-' )
        return {
            building: parsedData[ 0 ],
            floor: parsedData[ 1 ]
        }
    }

    function bindEvents() {
        chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ) {
            switch ( request.type ) {
                case GET_STATE: {
                    const { building, floor } = parseData( request.data )
                    const ranges = SCHEDULE[ building ][ floor ]

                    return sendResponse( isTimeInRanges( new Date, ranges ) )
                }
                case SET_ACTIVE: {
                    break
                }
                default:
            }
        } )
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

    function isTimeInRange( time, range ) {
        const { startHours, startMinutes, endHours, endMinutes } = parseRange( range )

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const date = now.getDate()

        const startTime = new Date( year, month, date, startHours, startMinutes, 0 )
        const endTime = new Date( year, month, date, endHours, endMinutes, 0 )

        return time > startTime && time < endTime
    }

    function isTimeInRanges( time, ranges ) {
        let isInRange = false

        ranges.forEach( range => isInRange ? false : isInRange = isTimeInRange( time, range ) )

        return isInRange
    }

} )()