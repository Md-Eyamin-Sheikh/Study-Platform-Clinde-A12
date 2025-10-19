import React from 'react';
import { Outlet } from "react-router-dom"
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';

const MainRout = () => {
    return (
        <div className='max-w-9xl'>
            <Navbar />
                <div className='pt-12 max-w-9xl '>
                <Outlet className='pt-12 max-w-9xl' />

                </div>
           
            <Footer/>
            
        </div>
    );
};

export default MainRout;