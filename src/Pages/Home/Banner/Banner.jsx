import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from "../../../assets/banner/banner1.png"
import bannerImg2 from "../../../assets/banner/banner2.png"
import bannerImg3 from "../../../assets/banner/banner3.png"
const Banner = () => {
  return (
    <Carousel className="my-4" autoPlay={true} infiniteLoop={true} swipeable={true} emulateTouch={true} showThumbs={false} showStatus={false} renderArrowNext={() => null} renderArrowPrev={() => null} renderIndicator={() => null}>
      <div>
        <img draggable={false} style={{ userSelect: "none" }} src={bannerImg1} />
      </div>
      <div>
        <img draggable={false} style={{ userSelect: "none" }} src={bannerImg2} />
      </div>
      <div>
        <img draggable={false} style={{ userSelect: "none" }} src={bannerImg3} />
      </div>
    </Carousel>
  );
};

export default Banner;
