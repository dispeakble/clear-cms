import styled from "styled-components";
import {size} from "../../../styled";

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
      color: white;
      width: 52px;
      height: 52px;
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
      background: rgba(0, 0, 0, 0.1);
      padding: 15px 10px;
      color: #333;

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }
  }
`;

export const Item = styled.li`
  padding: 4px 0;
`

export const LinkItem = styled.a`
  color: #fff;

  &:hover {
    color: #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
  }
`