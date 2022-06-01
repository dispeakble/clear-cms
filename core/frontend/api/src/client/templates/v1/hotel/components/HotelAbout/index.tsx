import {useTranslations} from "next-intl";

import {
  About,
  Cardtitle,
  CheckedIcon,
  Description,
  Feature,
  Highlights,
  HotelName,
  HotelRate,
  LeftSection,
  MapSection,
  RightSection
} from "./styled";
import {StyledDescription} from "../HotelDetail/styled";
import GoogleMapReact from "google-map-react";
import React, {useRef, useState} from "react";
import { StyledStars } from "../../../components/BottomCards/styled";
import {StyledStarsSmall} from "../../../components/Styled/stars";

const AnyReactComponent = ({text}: any) => <div>{text}</div>;


const HotelAbout = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [mapData] = useState({
    center: {
      lat: 30.738270,
      lng: 76.765144
    },
    zoom: 13
  });
  const [show, toggleShow] = useState(false);
  const HandleToggle = () => {
    toggleShow(!show);
  }

  const t = useTranslations();

  const Features = [
    t("hotelDetail.hotelAbout.features.breakfast"),
    t("hotelDetail.hotelAbout.features.seaView"),
    t("hotelDetail.hotelAbout.features.gardenView"),
    t("hotelDetail.hotelAbout.features.terrace"),
    t("hotelDetail.hotelAbout.features.poolView"),
    t("hotelDetail.hotelAbout.features.quietStreetView"),
    t("hotelDetail.hotelAbout.features.freeParking"),
    t("hotelDetail.hotelAbout.features.atmExchange")
  ];

  return (
    <>
      <About>
        <LeftSection>
          <HotelName>
            {t("hotelAbout.hotel")}
          </HotelName>
          <HotelRate>
            <StyledStarsSmall stars={3} />
            <h3>
              {t("hotelAbout.star", {noOfStars: 3})}
            </h3>
          </HotelRate>
          <Description>
            <StyledDescription style={{paddingBottom: '20px'}} ref={ref} readMore={show}>
              Lorem psum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
              labore et dolore <br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet,
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna

              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna liqua. Lorem ipsum dolore magn
              iqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore
              usmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labo<br/> magna aliqua. Lorem ipsum dolore magna
              aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labo
            </StyledDescription>

            <span onClick={HandleToggle} data-testid="readButton">{show ? t("hotelDetail.hotelAbout.readLess") : t("hotelDetail.hotelAbout.readMore")}</span>
            {/*currentNode && currentNode?.clientHeight >= 600 && <span onClick={HandleToggle} data-testid="readButton">{show ? 'read less...' : 'read more...'}</span>*/}
          </Description>
        </LeftSection>
        <RightSection>
          <MapSection id="showmap">

            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyBX1z5nvjcjzyxSMT-QCVS3ERu6Y3iNSb0",
                libraries: ["places", "geometry"]
              }}
              defaultCenter={mapData.center}
              defaultZoom={mapData.zoom}
              yesIWantToUseGoogleMapApiInternals

            >
              <AnyReactComponent
                lat={mapData.center.lat}
                lng={mapData.center.lng}
                text="🔴"
              />
            </GoogleMapReact>


          </MapSection>
          <Highlights>
            <Cardtitle>
              {t("hotelAbout.cardTitle")}
            </Cardtitle>
            <Feature>
              {
                Features.map((value, index) => {
                  return (
                    <li key={index}><CheckedIcon/><span>{value}</span></li>
                  );
                })
              }
            </Feature>
          </Highlights>
        </RightSection>
      </About>
    </>
  );
};

export default HotelAbout;