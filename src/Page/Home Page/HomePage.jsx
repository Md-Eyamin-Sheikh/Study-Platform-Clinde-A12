import React from 'react';
import ImageSlider from './Component/ImageSlider';

import StudySessionsPlatform from './Component/StudySessionsPlatform';
import Testimonials from './Component/Testimonials';

const HomePage = () => {
    return (
        <div>
            <ImageSlider/>
           
           

            <StudySessionsPlatform/>
            <Testimonials/>
           

            
        </div>
    );
};

export default HomePage;
