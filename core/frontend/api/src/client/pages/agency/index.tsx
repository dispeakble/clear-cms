import React, {useEffect, useState} from 'react';
import {NextPage} from 'next';
import styled from 'styled-components'
import {Colors} from "../../assets/design-set";

import {withRouter} from 'next/router';
import Header from '../../components/agency/Header'
import Footer from '../../components/agency/Footer'
import Hero from "../../components/agency/Hero";
import UpcomingOffers from "../../components/agency/UpcomingOffers";
import GallerySlider from "../../components/agency/GallerySlider";
import AboutUs from '../../components/agency/AboutUs'
import Slider from '../../components/agency/Slider'
import RecommendedDestinations from "../../components/agency/DestinationsCards/RecommendedDestination";
import DestinationCards from '../../components/agency/DestinationsCards/Destinations'
const PageComponent: NextPage = (props) => {

return (
        <Agency>
            <Header/>
            <Hero/>
            <UpcomingOffers/>
            <GallerySlider/>
            <AboutUs/>
            <RecommendedDestinations/>
            <Slider/>
            <DestinationCards />
            <Footer/>
        </Agency>
    )
};

const Agency = styled.div`
  background-color: ${Colors.offWhite};
`

export async function getServerSideProps(context: any) {



    return {
        props: {
            data: null
        }
    }
}


export default withRouter(PageComponent);