import React, {useEffect, useState} from 'react';
import { NextPage } from 'next';
import {Wrapper} from './styled'
import bg from "./assets/background.jpg"
import Cards from '../../components/agency/Cards'
import Hero from "../../components/agency/Hero";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props) => {

    const [cards, setCards] = useState<[]>([])

    useEffect(() => {
        (function content() {
            props.data.map(
                (data: any, i: any) =>
                    setTimeout(() => {
                        return setCards(data)
                    }, i * 10000
                    )
            )
            setTimeout(content,props.data.length * 10000);
        })()
    }, [])

    return (
        <Wrapper>
            <Hero img={bg} />
            <Cards cards={cards} />
        </Wrapper>

    )
};

export async function getServerSideProps(context: any) {
    const data = await context.req.apiHub({
        protocolMethod: 'sendMessage',
        channel: 'frontendapi',
        api: 'agency',
        act: 'get',
    });


    return {
        props:{
            data: data
        }
    }
}

export default withRouter(PageComponent);