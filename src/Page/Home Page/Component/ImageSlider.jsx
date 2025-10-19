import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ImageSlider = () => {
  const images = [
    "https://i.postimg.cc/7Z8pmZfc/pexels-anastasia-shuraeva-8466903.jpg",
    "https://i.postimg.cc/jjCmjw9D/pexels-diego-romero-471613950-19147326.jpg",
    "https://i.postimg.cc/3RTXczg3/pexels-hson-33852291.jpg",
    "https://i.postimg.cc/9MC9pZhM/pexels-kimmi-jun-201206578-18506745.jpg",
    "https://i.postimg.cc/fy6THQ9K/pexels-green-odette-232224115-32292148.jpg",
    "https://i.postimg.cc/c18KnFYm/pexels-chuchuphinh-1164572.jpg",
    "https://i.postimg.cc/vTRZhd9v/pang-yuhao-kd5cxw-ZOK4-unsplash.jpg",
    "https://i.postimg.cc/76FpdHKf/pexels-max-fischer-5212336.jpg",
  ];

  return (
    <div className="max-w-8xl bg-amber-50 mx-auto ">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="rounded-2xl shadow-lg"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`slide-${index}`}
              className="w-full h-[200px] md:h-[500px] object-cover rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
