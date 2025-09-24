import React from 'react';
import { Outlet } from "react-router-dom"
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const MainRout = () => {
    return (
        <div>
            <Navbar />
                <div className='pt-12'>
                <Outlet className='pt-12 w-full' />

                </div>
           
            <Footer/>
            
        </div>
    );
};

export default MainRout;