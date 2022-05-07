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
      content: "⌯";
      color: ${({theme}) => theme.colors.white};
      width: 52px;
      height: 52px;
      line-height: 52px;
      background: rgba(0, 0, 0, 0.1);
      font-size: 43px;
      text-align: center;
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
      background: ${({theme}) => theme.colors.primaryColor};
      padding: 15px 10px;
      color:  ${({theme}) => theme.colors.jetBlack};

      &:hover {
        background: ${({theme}) => theme.colors.primaryColorHover};
      }
    }
  }
`;

export const Item = styled.li`
  padding: 4px 0;
`;

export const LinkItem = styled.a`
  color: ${({theme}) => theme.colors.white};
  text-shadow: 2px 2px 2px rgba(0,0,0,0.3);

  &:hover {
    color: ${({theme}) => theme.colors.white};
    border-bottom: 1px solid ${({theme}) => theme.colors.white};
  }
`;