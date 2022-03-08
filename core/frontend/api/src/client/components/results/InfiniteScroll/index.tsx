import React, {useCallback, useRef, useState} from "react";

import useResutlsHook from "./utils/useResutlsHook";
import Item from "../Item"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const InfiniteScroll =  () => {

    const [page, setPage] = useState<number>(1)

    const {loading, results, failed, hasMore} = useResutlsHook(page)

    const observer = useRef();
    const lastElement = useCallback((element) => {
        if (loading) return
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        if (observer.current) { // @ts-ignore
            observer.current.disconnect()
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) setTimeout(() => {
                setPage((prev: number) => prev + 1)
            }, 1000)
        })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        if (element) { // @ts-ignore
            observer.current.observe(element)
        }


    }, [loading, hasMore])

    return (
        <div data-testid="infinite-scroll-container">
            {results.map((item, index) => {
                if (results.length - 1 === index) return <Item key={index} {...item} ref={lastElement}/>
                return <Item key={index} {...item} ref={null}/>
            })}
            {loading && <div>Loading...</div>}
            {failed && <div>An error has occurred...</div>}
        </div>
    )
}

export default InfiniteScroll