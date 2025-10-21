import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Numbar1 from "../../../assets/Photos/Numbar1.jpg";
import Numbar2 from "../../../assets/Photos/Numbar2.jpg";
import Numbar3 from "../../../assets/Photos/Numbar3.jpg";
import Numbar4 from "../../../assets/Photos/Numbar4.jpg";
import Numbar5 from "../../../assets/Photos/Numbar5.jpg";
import Numbar6 from "../../../assets/Photos/Numbar6.jpg";
import Numbar7 from "../../../assets/Photos/Numbar7.jpg";
import Numbar8 from "../../../assets/Photos/Numbar8.jpg";

const ImageSlider = () => {
  const images = [
    Numbar1,
    Numbar2,
    Numbar3,
    Numbar4,
    Numbar5,
    Numbar6,
    Numbar7,
    Numbar8,
  ];

  return (
   <div className=" bg-green-50">
     <div className="w-full mx-auto  bg-green-50 ">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        speed={800}
        className="rounded-2xl shadow-2xl"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
        }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[200px] sm:h-[350px] md:h-[500px] lg:h-[600px]">
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
   </div>
  );
};

export default ImageSlider;