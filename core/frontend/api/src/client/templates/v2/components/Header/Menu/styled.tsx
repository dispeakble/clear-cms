import styled from "styled-components";
import { size } from "../../../styled";

export const StyledMenuWrapper = styled.div`
  min-width: 52px;
  height: 100%;
`;

export const StyledMenu = styled.ul`
  cursor: pointer;
  list-style: none;
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;
  @media (max-width: ${size.laptop}) {
    gap: 0;
    flex-direction: column;
    &:before {
      display: block;
      content: " ";
      width: 52px;
      height: 52px;
      background: url(${({ theme }) => theme.icon("menu")}) no-repeat center center rgba(0, 0, 0, 0.1);
    }

    &:hover {
      position: absolute;
      top: 0;
      gap: 0;
    }

    &:hover li {
      display: block;
    }

    & li {
      display: none;
      gap: 0;
      background: ${({ theme }) => theme.colors.primaryColor};
      color:  ${({ theme }) => theme.colors.jetBlack};

      &:hover {
        background: ${({ theme }) => theme.colors.primaryColorHover};
      }
    }
  }
`;

export const Item = styled.li`
  padding: 4px 0;
`;

export const LinkItem = styled.a`
  color: ${({ theme }) => theme.colors.white} !important;
  text-shadow: 2px 2px 2px rgba(0,0,0,0.3);
  display: inline-block;
  text-align: center;
  vertical-align: center;
  width: 100%;
  height: 100%;
  padding: 15px 10px;
  text-decoration: none;

`;