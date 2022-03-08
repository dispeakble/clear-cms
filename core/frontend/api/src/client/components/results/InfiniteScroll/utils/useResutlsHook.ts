import {useEffect, useState} from "react"
import axios from "axios"

export default function useResutlsHook(page: number){

    const [loading, setLoading] = useState<boolean>(true)
    const [results, setResults] = useState<[]>([])
    const [failed, setFailed] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        setFailed(false)

        axios.post(`/results-data`,
            {page: page}
        ).then(res => {

            setLoading(false)
            setFailed(false)
            setHasMore(res.data.hasMore)

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setResults(prev => {
                return [...prev, ...res.data.results[0]]
            })

        }).catch(() => {
            setLoading(false)
            setFailed(true)
        })

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => { }
    }, [page])

    return {loading, results, failed, hasMore}
}