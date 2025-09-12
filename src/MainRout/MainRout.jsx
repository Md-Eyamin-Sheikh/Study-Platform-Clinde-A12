import React from 'react';
import { Outlet } from "react-router-dom"
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const MainRout = () => {
    return (
        <div>
            <Navbar className="mb-20px"/>
            <Outlet className='pt-20'/>
            <Footer/>
            
        </div>
    );
};

export default MainRout;