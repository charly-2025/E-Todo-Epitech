import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';

const localizer = momentLocalizer(moment);


export function ETodoCalendar() {
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([])
  
    useEffect(() => {
        const fetchUserTodo = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:3001/user/todos", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " +token,
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                console.error("Error:", response.status, response.statusText);
                return;
            }
            const data = await response.json();
            const event = Array.isArray(data) ? data : [];
            const Events = event.map(todos => ({
                id: todos.id,
                title: todos.title,
                start: new Date(todos.created_at),
                end: new Date(todos.due_time)
                
            }));
            setEvents(Events);
            console.log(Events)
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserTodo();
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
                views={['month', 'week', 'day', 'agenda']} 
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
}   