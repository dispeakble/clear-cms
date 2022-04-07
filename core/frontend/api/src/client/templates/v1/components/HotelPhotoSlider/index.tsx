import {StyledSliderImage, HotelPhotoSliderWrapper} from "./styled";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import hotel1 from "../../assets/img/hotels/small/hotel4.jpg";
import hotel2 from "../../assets/img/hotels/small/hotel5.jpg";
import hotel3 from "../../assets/img/hotels/small/hotel6.jpg";
import {EffectCoverflow, Navigation} from "swiper";

const VerticalPhotoSlider = () => {

  return <HotelPhotoSliderWrapper>
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={1}
      initialSlide={1}
      loop={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      navigation={true}
      modules={[EffectCoverflow, Navigation]}
      className="mySwiper"
    >
      <SwiperSlide><StyledSliderImage src={hotel1.src}/></SwiperSlide>
      <SwiperSlide><StyledSliderImage src={hotel2.src}/></SwiperSlide>
      <SwiperSlide><StyledSliderImage src={hotel3.src}/></SwiperSlide>
    </Swiper>
  </HotelPhotoSliderWrapper>;
}

export default VerticalPhotoSlider;