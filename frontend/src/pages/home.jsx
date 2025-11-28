import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../style/home.css"



export default function Home() {
    const [menu, setmenu] = useState(false);
    const navigate = useNavigate();

    return(
    
        <div className="page">
            
            <header>
                <nav className='nav'>
                    <div className="inside-nav">
                        <div className="name">e-TODO</div>
                        <div className="buttonsSign">
                            <button className="buttonhome btn-signin" onClick={() => navigate('/login')}>LOG IN</button>
                        </div>
                        <button className="menubtn" onClick ={() => setmenu(!menu)}>{menu ? '✕' : '☰'}</button>
                    </div>
                    {menu && (
                        <div className="buttonsmenu">
                            <button className="buttonhome btn-signin" onClick={() => navigate('/login')}>LOG IN</button>
                        </div>
                    )}
                </nav>
            </header>
            <main>
                <div className="content">
                    <h1 className='title'>WELCOME TO OUR e-TODO</h1>
                    <p>To discover our app, let's continue</p>
                    <button className="buttonhome" onClick={() => navigate('/register')}>GET STARTED</button>
                </div>
            </main>
        </div>  
    )
}