import Login from "./components/Login";
import Navbar from "./components/Navbar";
import History from "./components/History";
import { useState } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";

import "./App.css";

function App(){


    return (
        <div>
            <Navbar />
            {/* <History /> */}
            <Login />
        </div>
    );
}

export default App;
