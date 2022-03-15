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
    const { destination, checkin, checkout, adults, children, infants } = router.query

    return (
        <Wrapper>
            destination : {destination}
            Check In: {checkin}
            check Out: {checkout}
            Adults: {adults}
            Children: {children}
            Infants: {infants}
        </Wrapper>

    )
};

export default withRouter(PageComponent);