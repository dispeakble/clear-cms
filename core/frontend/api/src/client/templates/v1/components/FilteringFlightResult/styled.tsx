import styled from "styled-components";

export const FiltersWrapper = styled.div`
    flex: 0 0 20%;
    min-width: 300px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;
