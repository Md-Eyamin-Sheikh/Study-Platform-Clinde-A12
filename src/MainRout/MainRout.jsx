import React, { useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import BottomNav from '../Component/BottomNav';

const MainRout = () => {
    const [activeTab, setActiveTab] = useState('home');
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        switch (tab) {
            case 'home':
                navigate('/');
                break;
            case 'sessions':
                navigate('/sessions');
                break;
            case 'dashboard':
                navigate('/dashboard');
                break;
            case 'tutors':
                navigate('/sessions');
                break;
            case 'profile':
                navigate('/profile');
                break;
            default:
                navigate('/');
        }
    };

    return (
        <div>
            <Navbar />
            <div>
                <Outlet />
            </div>
            <Footer />
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
    );
};

export default MainRout;
