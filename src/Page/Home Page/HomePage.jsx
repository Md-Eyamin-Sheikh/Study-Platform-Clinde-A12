import React from 'react';
import ImageSlider from './Component/ImageSlider';
import StudySessionsPlatform from './Component/StudySessionsPlatform';
import Testimonials from './Component/Testimonials';
import WhyChooseUs from './Component/WhyChooseUs';
import StatsSection from './Component/StatsSection';
import HeroSection from './Component/HeroSection';
import FeaturedSessions from './Component/FeaturedSessions';
import RecentSessions from './Component/RecentSessions';
import PopularTutors from './Component/PopularTutors';
import SuccessStories from './Component/SuccessStories';
import Newsletter from './Component/Newsletter';
import PricingPlans from './Component/PricingPlans';
import FAQ from './Component/FAQ';
import CallToAction from './Component/CallToAction';

const HomePage = () => {
    return (
        <div className='w-full'>
            
            <ImageSlider/>
            <HeroSection/>
            <FeaturedSessions/>
            {/* <RecentSessions/> */}
            <StudySessionsPlatform/>
            <PopularTutors/>
            <StatsSection/>
            {/* <WhyChooseUs/> */}
            <PricingPlans/>
            <SuccessStories/>
            {/* <Testimonials/> */}
            <FAQ/>
            <Newsletter/>
            <CallToAction/>
        </div>
    );
};

export default HomePage;
