import styled from "styled-components";
import { size } from "../../../styled";

export const SearchHolder = styled.div`
  flex: 1;
  @media (min-width: ${size.laptop}) {
    flex: none;
    border-right: 1px solid ${({ theme }) => theme.colors.borderOutline};
  }
`;

export const SearchTitle = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderOutline};

  line-height: 48px;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.gray};

  display: flex;
  align-items: center;
  padding: 18px 0 18px 32px;
  font-weight: 400;
`;

export const SearchBody = styled.div`
  padding: 20px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  h4 {
    color: ${({ theme }) => theme.colors.black};
    font-size: 16px;
    margin-left: 12px;
  }
`;

export const FormElement = styled.div`
  display: flex;
  justify-content: space-around;
  height: 50px;
  background: ${({ theme }) => theme.colors.white};

  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  cursor: pointer;

  input {
    border: none;
    flex: 1;
    height: 48px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    min-width: 150px;
    border-radius: 0 10px 10px 0;
  }
`;

export const SearchIcon = styled.div`
  width: 23px;
  height: 23px;
  margin: 13px 10px 0 10px;
  background: url(${({ theme }) => theme.icon("search")}) no-repeat left center;`;

export const ResponsiveFieldGroup = styled.div`
  @media (min-width: ${size.tablet}) {
    display: flex;
    gap: 10px;
  }
  @media (min-width: ${size.laptop}) {
    display: block;
  }

  & ${FieldGroup} {
    flex: 1;
  }
`;

export const PassengerFilters = styled.div`
  position: absolute;
  z-index: 16;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  user-select: none;
  width: 260px;
  padding: 22px;
  @media (min-width: ${size.mobileS}) {
    width: 280px;
  }
  @media (min-width: ${size.mobileM}) {
    width: 335px;
  }
  @media (min-width: ${size.mobileL}) {
    width: 360px;
  }
  @media (min-width: ${size.laptop}) {
    width: 290px;
  }
`;

export const PassengerFilterTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  width: 100%;
  height: 60px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 7px rgba(0, 0, 0, 0.25);
  line-height: 48px;
  font-size: 32px;
  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  border-radius: 12px 12px 0 0;
  margin-bottom: 12px;
`;

export const CloseIcon = styled.div`
  background: url(${({ theme }) => theme.icon("close")}) no-repeat left center;
  width: 22px;
  height: 12px;
  position: relative;
  cursor: pointer;
`;

export const PassengerEntry = styled.div`
  
`;

export const PassengerDesc = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 200%;
  text-transform: uppercase;
  color: #7C7C7C;
  display: flex;
  justify-content: flex-start;
`;

export const PersonHolder = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const PersonText = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-weight: 600;
    font-size: 18px;
    margin: 0;
    color: ${({ theme }) => theme.colors.black};
  }

  p {
    font-weight: 500;
    font-size: 12px;
    line-height: 10px;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

export const PersonQuantity = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 82px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderOutline};
  user-select: none;

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 38px;
    color: ${({ theme }) => theme.colors.black};
    cursor: pointer;
  }
  
  h3 {
    margin: 0;
  }

  h5 {
    font-weight: 600;
    font-size: 18px;
    line-height: 38px;
    color: ${({ theme }) => theme.colors.black};
    margin: 0;
  }
`;

export const ClosePersonsButtonHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;

  button {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryLight} 0%, ${({ theme }) => theme.colors.primaryColor} 100%);
    color: ${({ theme }) => theme.colors.white};
    height: 45px;
    padding-right: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: flex;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    flex: 1;

    &:hover {
      background: linear-gradient(180deg, ${({ theme }) => theme.colors.primaryColorHover} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
      color: #FFFFFF;
      text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    }
`;

export const CalenderIcon = styled.div`
  width: 23px;
  height: 24px;
  margin: 13px 10px 0 10px;
  background: url(${({ theme }) => theme.icon("calendar")}) no-repeat left center;
`;

export const PopupHolder = styled.div`
  position: relative;
`;