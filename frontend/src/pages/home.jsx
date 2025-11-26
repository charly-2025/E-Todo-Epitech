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
                        <div className="name">e-ToDo</div>
                        <div className="buttonsSign">
                            <button className="btn-signin" onClick={() => navigate('/login')}>Sign in</button>
                            <button className="btn-signup" onClick={() => navigate('/register')}>Sign up</button>
                        </div>
                        <button className="menubtn" onClick ={() => setmenu(!menu)}>{menu ? '✕' : '☰'}</button>
                    </div>
                    {menu && (
                        <div className="buttonsmenu">
                            <button className="btn-signin" onClick={() => navigate('/login')}>Sign In</button>
                            <button className="btn-signup" onClick={() => navigate('/register')}>Sign Up</button>
                        </div>
                    )}
                </nav>
            </header>
            <main>
                <div className="content">
                    <h1>WELCOME TO OUR ETODO</h1>
                    <p>To discover our app, let's continue</p>
                    <button className="btn-signup" onClick={() => navigate('/login')}>Let's do it !</button>
                </div>
            </main>
        </div>  
    )
}