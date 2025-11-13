import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect, formattedEvents } from 'react';

const localizer = momentLocalizer(moment);


export function ETodoCalendar() {
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([])
  
    useEffect(() => {
    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3001/user/todos'); 
            const data = await response.json();
            const todos = data.map(event => ({
                id: event.id,
                title: event.title,
                start: moment.utc(event.start).toDate(), 
                end: moment.utc(event.end).toDate(),
            }));

        setEvents(formattedEvents);
        } catch (error) {
            console.error('Error :', error);
        }
        };

        fetchEvents();
    }, []);

    return (
        <div style={{ height: '80vh', width: '80vw' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={currentView}
                date={currentDate}
                onView={setCurrentView}
                onNavigate={setCurrentDate}
                views={['month', 'week', 'day', 'agenda']} // Use strings, not Views enum
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
}   