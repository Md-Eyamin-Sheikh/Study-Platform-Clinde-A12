import React from 'react';
import { Outlet } from "react-router-dom"
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const MainRout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            <Footer/>
            
        </div>
    );
};

export default MainRout;