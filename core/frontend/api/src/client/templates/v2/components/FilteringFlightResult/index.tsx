import {FiltersWrapper} from './styled'

import ResultFilter from "../ResultFilter"

const sortCheckboxes = [
    "All",
    "The Best",
    "The Cheapest",
    "The Fastest",
    "Airline"
];

const airlinesCheckboxes = [
    "All",
    "bbb",
    "ccc",
    "ddd",
    "fff",
    "ggg"
];

const numberOfStopovers = [
    "All",
    "Direct",
    "1",
    "2",
    "3"
];

const FilteringFlightResult = () => {

    return (
    <FiltersWrapper>
        <ResultFilter title="Sort" checkboxes={sortCheckboxes}/>
        <ResultFilter title="Airlines" checkboxes={airlinesCheckboxes}/>
        <ResultFilter title="Number of stopovers" checkboxes={numberOfStopovers}/>
    </FiltersWrapper>
    )
}

export default FilteringFlightResult;