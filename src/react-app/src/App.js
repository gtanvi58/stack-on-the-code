import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import { useState } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";

import "./App.css";

function App(){


    return (
        <div>
            <Navbar />
            <Login />
        </div>
    );
}

export default App;
