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
  MapSection, Ping,
  RightSection
} from "./styled";
import {Rate} from "antd";
import {Star, StyledDescription} from "../HotelDetail/styled";
import GoogleMapReact from "google-map-react";
import {useState} from "react";

const AnyReactComponent = ({text}: any) => <div>{text}</div>;


const HotelAbout = () => {
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
    "Breakfast",
    "Sea view",
    "Garden view",
    "Terrace",
    "Pool view",
    "Quiet street view",
    "Free parking",
    "ATM Exchange"
  ];

  return (
    <>
      <About>
        <LeftSection>
          <HotelName>
            {t("hotelAbout.hotel")}
          </HotelName>
          <HotelRate>
            <Ping style={{fontSize: '30px'}}  disabled defaultValue={4}/>
            <h3>
              {t("hotelAbout.star")}
            </h3>
          </HotelRate>
          <Description>
            <StyledDescription style={{paddingBottom: '20px'}}>
              {t("hotelAbout.firstHalfDesc")}
            </StyledDescription>
            {show ? (
              <StyledDescription>
                {t("hotelAbout.secondHalfDesc")}
              </StyledDescription>
            ) : null}
            <span onClick={HandleToggle}>{show ? `${t("hotelAbout.readLess")}` : `${t("hotelAbout.readMore")}`}</span>
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
                    <li key={index}><CheckedIcon/>{value}</li>
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