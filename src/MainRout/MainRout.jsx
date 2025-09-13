import React from 'react';
import { Outlet } from "react-router-dom"
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const MainRout = () => {
    return (
        <div>
            <Navbar />
                <div className='pt-12'>
                <Outlet />

                </div>
           
            <Footer/>
            
        </div>
    );
};

export default MainRout;