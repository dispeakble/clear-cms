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

        axios({
            method: "POST",
            url:`http://localhost:9898/results_data`,
            data: {page: page}
        }).then(res => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setResults(prev => {
                return [...prev, ...res.data.results[0]]
            })
            setLoading(false)
            setFailed(false)
            setHasMore(res.data.hasMore)
        }).catch((err) => {
            setFailed(true)
            console.error(err)
        })

    }, [page])

    return {loading, results, failed, hasMore}
}