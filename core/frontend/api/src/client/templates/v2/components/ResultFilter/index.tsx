import {
    Checkbox,
    CheckboxContainer,
    FilteringIcon,
    FilterOptionsContainer,
    FilterTitle,
    FilterTitleContainer, FilterWrapper, Label
} from "./styled";

import {useState} from 'react';

interface IResultFilter {
    checkboxes: string[];
    title: string;
}

const ResultFilter = ({checkboxes, title}: IResultFilter) => {
    const [displayFilterOpt, setDisplayFilterOpt] = useState(true);

    const toggleDisplayFilterOptHandler = () => {
        setDisplayFilterOpt((prevState) => !prevState);
    }

    return (
        <FilterWrapper>
            <FilterTitleContainer>
                <FilterTitle>{title}</FilterTitle>
                <FilteringIcon data-testid="test-filter-icon-handler" onClick={toggleDisplayFilterOptHandler}/>
            </FilterTitleContainer>
            {displayFilterOpt && <FilterOptionsContainer data-testid="test-filter-options-container">
                {checkboxes.map((_filter: any, index:number) =>
                    <CheckboxContainer key={index}>
                        <Label>
                            <Checkbox type="checkbox" />
                            {_filter}
                        </Label>
                    </CheckboxContainer>)}
            </FilterOptionsContainer>
            }
        </FilterWrapper>
    );
}

export default ResultFilter;