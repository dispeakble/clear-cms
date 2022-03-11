import React, {useEffect, useState} from 'react';
import {GetStaticPropsContext, NextPage} from 'next';
import styled from "styled-components"
import bg from "./assets/background.jpg"
import Cards from '../../components/agency/Cards'
import ImageComponent from "../../components/agency/ImageComponent";

import { withRouter } from 'next/router';
import Header from '../../components/agency/Header'
import Footer from '../../components/agency/Footer'

const Wrapper = styled.div`
    width: 1200px;
    margin: 0 auto;
  
    padding: 100px 0;
`


const PageComponent: NextPage = (props) => {
    const [cards, setCards] = useState<[]>([])


    useEffect(() => {
       const fetchHotels = async () => {
           const response = await fetch('http://localhost:9898/api/agency/hotel');
           const data = await response.json();
            setCards(data.rows)
        }
        fetchHotels()
    },[props])

    //TDO change here to add a new template. add header, menu, content and footer. whatever you want . dummy text
    //TODO very important. make reusable components
    return (
        <>
            <Header />
            <Wrapper>
                <ImageComponent img={bg} />
                <Cards cards={cards} />
            </Wrapper>
            <Footer />
        </>

    )
};

export function getStaticProps({locale}: GetStaticPropsContext){
    return{
        props:{
            messages: require(`../../languages/agency/${locale}.json`)
        }
    }
}


  
export default withRouter(PageComponent);