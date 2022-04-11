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
import {Rate} from "antd";
import {Star, StyledDescription} from "../HotelDetail/styled";
import GoogleMapReact from "google-map-react";
import {useState} from "react";

const AnyReactComponent = ({text}) => <div>{text}</div>;


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
        "Breakfast info Continental, Buffet",
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
                        <Star>
                            <Rate disabled defaultValue={4}/>
                            <span>
                            {t("hotelAbout.star")}
                        </span>
                        </Star>
                    </HotelRate>
                    <Description>
                        <StyledDescription>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                            labore et dolore <br/> magna aliqua. Lorem ipsum dolore magna
                            aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet,
                            consectetur
                            adipisicing elit, sed do eiusmod tempor.<br/> magna aliqua. Lorem ipsum dolore magna
                            aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                            tempor incididunt ut labore
                        </StyledDescription>
                        {show ? (
                            <StyledDescription>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                                labore et dolore <br/> magna aliqua. Lorem ipsum dolore magna
                                aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet,
                                consectetur
                                adipisicing elit, sed do eiusmod tempor.
                                labore et dolore.
                            </StyledDescription>
                        ) : null}
                        <span onClick={HandleToggle}>{show ? 'read less...' : 'read more...'}</span>
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
                                Features.map((value) => {
                                    return (
                                        <li><CheckedIcon/>{value}</li>
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