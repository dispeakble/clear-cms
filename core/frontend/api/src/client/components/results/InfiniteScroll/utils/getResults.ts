import {httpClient} from "../../../../helpers/httpClient";

export function getResults(){
    return httpClient.get('/results-data')
}