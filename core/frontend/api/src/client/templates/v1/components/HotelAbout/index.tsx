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
import {useRef, useState} from "react";
import { StyledStars } from "../BottomCards/styled";

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
    "Breakfast info Continental, Buffet",
    "Sea view",
    "Garden view",
    "Terrace",
    "Pool view",
    "Quiet street view",
    "Free parking",
    "ATM Exchange"
  ];

  const currentNode = ref.current;
  return (
    <>
      <About>
        <LeftSection>
          <HotelName>
            {t("hotelAbout.hotel")}
          </HotelName>
          <HotelRate>
            <StyledStars stars={3}/>
            <h3>
              {t("hotelAbout.star")}
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

            <span onClick={HandleToggle} data-testid="readButton">{show ? 'read less...' : 'read more...'}</span>
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