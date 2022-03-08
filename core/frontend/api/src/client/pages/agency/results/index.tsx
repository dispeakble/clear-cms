import React, {useState, useRef, useCallback} from 'react';
import { NextPage } from 'next';
import {Wrapper} from '../styled'

import { withRouter } from 'next/router';
import useResutlsHook from "../../../components/results/InfiniteScroll/utils/useResutlsHook";
import InfiniteScroll from "../../../components/results/InfiniteScroll";


const PageComponent: NextPage = () => {

    return (
        <Wrapper>
            <InfiniteScroll />
        </Wrapper>

    )
};

export default withRouter(PageComponent);