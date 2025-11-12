import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Height } from '@mui/icons-material';

const localizer = momentLocalizer(moment) 


const myEventsList = [
  {
    
  },
]

export function ETodoCalendar() {
    return (
        <div>
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{Height: 500}}
            />
        </div>
    )
}

