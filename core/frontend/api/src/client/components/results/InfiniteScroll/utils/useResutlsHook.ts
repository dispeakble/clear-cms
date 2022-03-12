import {useEffect, useState} from "react"
import {getResults} from "./getResults";

export default function useResutlsHook(page: number){

    const [loading, setLoading] = useState<boolean>(true)
    const [results, setResults] = useState<[]>([])
    const [failed, setFailed] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(false)

    useEffect(() => {
        async function fetchResults(){
            try{
                const {data} = await getResults()

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setResults(prev => {
                    return [...prev, ...data.results[0]]
                })
                setHasMore(data.hasMore)
                setLoading(true);
                setFailed(false);
            } catch(err){
                setFailed(true)
                setLoading(false)
            }
        }

        fetchResults()
    }, [page])
    return {loading, results, failed, hasMore}
}