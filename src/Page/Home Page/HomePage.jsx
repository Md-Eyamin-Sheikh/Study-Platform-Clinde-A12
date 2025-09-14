import React from 'react';
import ImageSlider from './Component/ImageSlider';

import StudySessionsPlatform from './Component/StudySessionsPlatform';
import Testimonials from './Component/Testimonials';
import WhyChooseUs from './Component/WhyChooseUs';
import StatsSection from './Component/StatsSection';

const HomePage = () => {
    return (
        <div>
            <ImageSlider/>
           
           

            <StudySessionsPlatform/>
            <Testimonials/>

            <WhyChooseUs/>

            <StatsSection/>
           

            
        </div>
    );
};

export default HomePage;
