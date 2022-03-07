import React, {useState, useRef, useCallback} from 'react';
import { NextPage } from 'next';
import {Wrapper} from '../styled'

import { withRouter } from 'next/router';
import useResutlsHook from "../../../components/results/InfiniteScroll/utils/useResutlsHook";
import InfiniteScroll from "../../../components/results/InfiniteScroll";


const PageComponent: NextPage = () => {

    const [page, setPage] = useState<number>(1)

    return (
        <Wrapper>
            <InfiniteScroll page={page} setPage={setPage}/>
        </Wrapper>

    )
};

export default withRouter(PageComponent);