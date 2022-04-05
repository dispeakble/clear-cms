import styled from "styled-components";

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  
  width: 90%;
  margin-top: -80px;
  z-index: 5;
  
  position: relative;
`;