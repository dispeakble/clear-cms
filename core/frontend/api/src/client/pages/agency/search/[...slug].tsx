import React from 'react';
import { NextPage } from 'next';
import styled from "styled-components"


const Wrapper = styled.div`
    width: 1200px;
    margin: 0 auto;
  
    padding: 100px 0;
`

import {useRouter, withRouter} from 'next/router';



const PageComponent: NextPage = () => {

    const router = useRouter()
    const {slug} = router.query

    // eslint-disable-next-line no-console
    console.log(slug)
    //returns array for slugs

    return (
        <Wrapper>
            search page
        </Wrapper>

    )
};

export default withRouter(PageComponent);