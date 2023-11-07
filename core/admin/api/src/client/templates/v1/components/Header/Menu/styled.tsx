import styled from 'styled-components';
import { size } from '../../../styled';

export const StyledMenuWrapper = styled.div`
  min-width: 52px;
  height: 100%;
`;

export const StyledMenu = styled.ul`
  cursor: pointer;
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;

  li {
    :hover {
      background: ${({ theme }) => theme.colors.primaryColorHover};
    }
  }

  @media (max-width: ${size.laptop}) {
    gap: 0;
    flex-direction: column;
    &:before {
      display: block;
      content: ' ';
      width: 52px;
      height: 52px;
    }

    &:hover {
      position: absolute;
      top: 0;
      gap: 0;
    }

    &:hover > li {
      display: flex;
    }

    & > li {
      display: none;
      gap: 0;
      background: ${({ theme }) => theme.colors.primaryColor};
      color: ${({ theme }) => theme.colors.jetBlack};

      &:hover {
        background: ${({ theme }) => theme.colors.primaryColorHover};
      }
    }
  }
`;

export const Item = styled.li`
  padding: 4px 0;
  display: flex;
`;

export const LinkItem = styled.a`
  color: ${({ theme }) => theme.colors.primaryColor};
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
  display: inline-block;
  text-align: center;
  vertical-align: center;
  width: 100%;
  height: 100%;
  padding: 15px 10px;
  text-decoration: none;
`;
