import {useTranslations} from "next-intl";

import {About,LeftSection,HotelName,HotelRate,Description,RightSection,MapSection,Highlights,Cardtitle,Feature,CheckedIcon} from "./styled";
import {Rate} from "antd";
import {Star} from "../HotelDetail/styled";
import GoogleMapReact from 'google-map-react';
import {useState} from "react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;


const HotelAbout = () => {
    const [ParaHeight , setParaHeight]=useState(false)
    const [mapData , setMapData]=useState({
        center: {
            lat: 30.738270,
            lng:  76.765144
        },
        zoom: 13
    })


    const t = useTranslations();

    const Features = [
        "Breakfast info Continental, Buffet" ,
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
        <About id='showmap'>
            <LeftSection>
                <HotelName>
                    {t('hotelAbout.hotel')}
                </HotelName>
                <HotelRate >
                    <Star>
                        <Rate disabled defaultValue={4} />
                        <span>
                            {t('hotelAbout.star')}
                        </span>
                    </Star>
                </HotelRate>
                <Description>
                    <p style={{fontSize:`${ParaHeight}`}}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua.
                        labore et dolore <br/> magna aliqua. Lorem ipsum dolore magna
                        aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.

                        {
                            ParaHeight ==false?<span onClick={()=>{setParaHeight(true)}}>read more...</span>:<>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
                                consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore<br/>
                                magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt <br/> ut labore et dolore magna aliqua. Lorem ipsum dolor
                                sit amet, consectetur adipisicing elit,  consectetur adipisicing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum
                                dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore <br/> magna aliqua. Lorem ipsum dolore magna
                                aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua.<span onClick={()=>{setParaHeight(false)}} >read less...</span>
                            </>
                        }
                    </p>
                </Description>
            </LeftSection>
            <RightSection>
                <MapSection>

                        <GoogleMapReact
                            bootstrapURLKeys={{ key:"AIzaSyBX1z5nvjcjzyxSMT-QCVS3ERu6Y3iNSb0" , libraries: ["places", "geometry"]}}
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
                        {t('hotelAbout.cardTitle')}
                    </Cardtitle>
                    <Feature>
                        {
                            Features.map((value) => {
                                return (
                                    <li><CheckedIcon/>{value}</li>
                                )
                            })
                        }
                    </Feature>
                </Highlights>
            </RightSection>
        </About>
        </>
    )
}

export default HotelAbout;