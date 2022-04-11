import { StyledSliderImage, StyledSliderWrapper } from "./styled";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import hotel1 from "../../assets/img/hotels/small/hotel4.jpg";
import hotel2 from "../../assets/img/hotels/small/hotel5.jpg";
import hotel3 from "../../assets/img/hotels/small/hotel6.jpg";
import { EffectCoverflow, Navigation } from "swiper";

type VerticalPhotoSliderProps = {
  maxWidth: string;
  maxHeight: string;
};

const VerticalPhotoSlider = ({ maxWidth, maxHeight }: VerticalPhotoSliderProps) => {

  return <StyledSliderWrapper maxWidth={maxWidth}>
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={3}
      initialSlide={1}
      loop={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }}
      navigation={true}
      modules={[EffectCoverflow, Navigation]}
      className="mySwiper"
    >
      <SwiperSlide><StyledSliderImage maxHeight={maxHeight} src={hotel1.src} /></SwiperSlide>
      <SwiperSlide><StyledSliderImage maxHeight={maxHeight} src={hotel2.src} /></SwiperSlide>
      <SwiperSlide><StyledSliderImage maxHeight={maxHeight} src={hotel3.src} /></SwiperSlide>
    </Swiper>
  </StyledSliderWrapper>;
};

export default VerticalPhotoSlider;