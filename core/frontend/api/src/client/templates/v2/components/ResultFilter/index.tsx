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
                <FilteringIcon onClick={toggleDisplayFilterOptHandler}/>
            </FilterTitleContainer>
            {displayFilterOpt && <FilterOptionsContainer>
                {checkboxes.map((checkbox: any, index:number) =>
                    <CheckboxContainer key={index}>
                        <Checkbox type="checkbox" />
                        <Label>{checkbox}</Label>
                </CheckboxContainer>)}
            </FilterOptionsContainer>
            }
        </FilterWrapper>
    );
}

export default ResultFilter;