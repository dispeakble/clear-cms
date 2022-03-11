import {useEffect, useState} from "react"
import axios from "axios"

export default function useResutlsHook(page: number){

    const [loading, setLoading] = useState<boolean>(true)
    const [results, setResults] = useState<[]>([])
    const [failed, setFailed] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(false)

    useEffect(() => {
        let componentIsMounted = true
        setLoading(true)
        setFailed(false)
        axios.post(`/results-data`,
            {page: page}
        ).then(res => {

            if(componentIsMounted){
                setLoading(false)
                setFailed(false)
                setHasMore(res.data.hasMore)

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setResults(prev => {
                    return [...prev, ...res.data.results[0]]
                })
            }

        }).catch(() => {
            setLoading(false)
            setFailed(true)
        })

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            componentIsMounted = false;
        }
    }, [page])

    return {loading, results, failed, hasMore}
}