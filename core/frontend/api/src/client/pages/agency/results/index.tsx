import React from 'react';
import { NextPage } from 'next';
import styled from "styled-components"

const Wrapper = styled.div`
    width: 1200px;
    margin: 0 auto;
  
    padding: 100px 0;
`

import { withRouter } from 'next/router';
import InfiniteScroll from "../../../components/results/InfiniteScroll";


const PageComponent: NextPage = () => {

    return (
        <Wrapper>
            <InfiniteScroll />
        </Wrapper>

    )
};

export default withRouter(PageComponent);