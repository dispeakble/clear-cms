import React, {useState} from "react";

import useResutlsHook from "./utils/useResutlsHook";
import {ItemContainer} from './styled'

import InfiniteScroll from "react-infinite-scroll-component";

interface IResult{
    itemTitle? : string
    itemDescription? : string
}


function InfiniteScrollComponent  (){

    const [page, setPage] = useState<number>(1)

    const {loading, results, failed, hasMore} = useResutlsHook(page)

    function nextPage(){
        setPage(page+1)
    }

    return (
        <>
            {results.length > 0 &&
                <div data-testid="infinite-scroll-container">
                    <InfiniteScroll
                        key="infinite-scroll"
                        next={nextPage}
                        hasMore={hasMore}
                        loader={<div>Loading...</div>}
                        dataLength={results.length}>
                        {
                            results.map(
                                (item :IResult, index) =>
                                    <ItemContainer key={index} data-testid="item-container" >
                                        <h1>{ item.itemTitle}</h1>
                                        <h2>{ item.itemDescription}</h2>
                                    </ItemContainer>
                            )
                        }
                    </InfiniteScroll>
                </div>
            }
            {(loading && !failed) && <div data-testid="loader-test">Loading...</div>}
            {(failed && !loading) && <div data-testid="error-test">An error has occurred...</div>}
        </>
    )
}

export default InfiniteScrollComponent