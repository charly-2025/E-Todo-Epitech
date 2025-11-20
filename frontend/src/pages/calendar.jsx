import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';

import getRandomInt from '../utils/randomint';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Opacity } from '@mui/icons-material';



const localizer = momentLocalizer(moment);


export function ETodoCalendar() {
    
    const [currentView, setCurrentView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([])

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [isOpenEvent, setIsOpenEvent] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '85vw',
        maxWidth: '500px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
        maxHeight: '90vh'
    };

    const handleSelectSlot = (infos) => {
        console.log(infos)
        setSelectedDate(infos.start);
        setSelectedEvent(null);
    
    }

    const handleSelectEvent = (event) => {
        console.log(event)
        setSelectedDate(null);
        setSelectedEvent(event);
        setIsOpenEvent(true);
    }

    const getcolor = (id) => {
        let colors = [ '#2f00ffff', '#F97316','#F59E0B', '#EAB308',   '#84CC16',
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

    const planning = async () => {
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
                    description: todos.description,
                    start: new Date(todos.created_at),
                    end: new Date(todos.due_time),
                    progress: todos.status,
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
    
    useEffect(() => {
        planning(); 
    }, []);
   
    const calendarStyle = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let currentDate = `${new Date().getDate()} ${new Date().getMonth()+1} ${new Date().getFullYear()}`
        let allDate = `${date.getDate()} ${date.getMonth()+1} ${date.getFullYear()}`

        if (date < today){
            return {
                style: {
                backgroundColor: 'grey',
                opacity: '15%',
                margin: 0,
                padding: 0
                }
            }
        }
        
        if (allDate === currentDate){
            return {
                style: {
                backgroundColor: 'blue',
                opacity: '10%',
                margin: 0,
                padding: 0
                }
            }
        }
    }   
    
    return (
        
        <div style={{ height: '80vh', width: '80vw'}}>
            <Calendar
                selectable
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
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
                dayPropGetter={calendarStyle}       
            />
            {selectedEvent  && (
                <Modal  open={isOpenEvent} onClose={() => setIsOpenEvent(false)}>
                    <Box sx={style}>
                        <Typography variant="h3" sx={{textAlign: "center"}}>{selectedEvent.title}</Typography>
                        <Typography variant="h6" sx={{textAlign: "center"}}>{selectedEvent.description}</Typography>
                        <hr></hr>
                        <Typography>Start : {selectedEvent.start.toLocaleString()}</Typography>
                        <Typography>End : {selectedEvent.end.toLocaleString()}</Typography>
                        <hr></hr>
                        <Typography variant="h6" sx={{textAlign: "center"}}>Status : {selectedEvent.progress}</Typography>
                    </Box>   
                </Modal>
            )}
        </div>
    );
}


