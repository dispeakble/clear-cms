import styled from "styled-components";



export const PackageDetailContainer = styled.div`
  background: #FFFFFF;
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.14);
  border-radius: 27px;
  width: 65%;
  padding: 1rem;
`;

export const PackageTitle = styled.div`
  font-weight: 400;
  font-size: 36px;
  line-height: 54px;
`;

export const FlightInformation = styled.div`
  
`

export const FlightTakeOffInput = styled.div`

`
export const FlightInputs = styled.div`
    display: flex;
    justify-content: space-between;
  
    inputs {
      background: #FFFFFF;
      border: 1px solid #DBDBDB;
      box-shadow: 0px 4px 7px rgba(255, 255, 255, 0.25);
      border-radius: 10px;
    }
`


export const FlightTakeOffIcon = styled.div`
  width: 23px;
  height: 23px;
  margin: 13px 10px 0 10px;

`;

export const DropdownIcon = styled.div`
  width: 40px;
  height: 48px;
  cursor: pointer;
  background: url(${({theme}) => theme.icon('dropdown')}) no-repeat left center;
`;
