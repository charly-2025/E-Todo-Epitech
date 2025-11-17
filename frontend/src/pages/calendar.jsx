import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';

import getRandomInt from '../utils/randomint';
import { colors } from '@mui/material';

const localizer = momentLocalizer(moment);


export function ETodoCalendar() {
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([])

    const getcolor = (id) => {
        let colors = [ '#EF4444', '#F97316','#F59E0B', '#EAB308',   '#84CC16',
            '#22C55E', '#10B981',   '#14B8A6',   
            '#06B6D4',   '#0EA5E9',  '#3B82F6',   
            '#6366F1',   '#8B5CF6',   '#A855F7',   
            '#D946EF',   '#EC4899',   '#F43F5E'];
        const index = id % colors.length;
        if (index > colors.length){
            return colors[getRandomInt(17)];
        }
        else{
            return colors[index];
        }
    };

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
            const Events = event.map(todos => {
                return {
                    id: todos.id,
                    title: todos.title,
                    start: new Date(todos.created_at),
                    end: new Date(todos.due_time),
                    colorEvento: getcolor(todos.id),
                    color: 'white'
                };
            });
            setEvents(Events);

            console.log(Events)
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserTodo();
    }, []);   

    return (
        <div style={{ height: '80vh', width: '80vw'}}>
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
                BackgroundWrapper = "red"
                eventPropGetter={(events) => {
                    const backgroundColor = events.colorEvento ;
                    const color = events.color;
                    return { style: { backgroundColor ,color} }
                }}
            />
        </div>
    );
}


