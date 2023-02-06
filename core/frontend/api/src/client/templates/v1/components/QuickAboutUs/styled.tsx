import styled from "styled-components";
import { device } from "../../styled";

export const StyledQuickAboutUs = styled.div`
  width: 100%;
  height: 100%;
  margin: 20px;
  display: block;
  @media ${device.tablet} {
    display: flex;
  }
`;

export const StyledQuickAboutUsImage = styled.div<{ src: any }>`
  background: url(${({ src }) => src}) no-repeat center center;
  background-size: cover;
  flex: 1;
  margin-right: 6%;
  width: 100%;
  min-height: 250px;
`;

export const StyledQuickAboutUsText = styled.div<{ src: any }>`
  flex: 1;
  padding: 6%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledTitle = styled.h3`
  font-size: 48px;
  font-weight: normal;
  
`;

export const StyledDescription = styled.article`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.gray};
  line-height: 200%;
`;

export const StyledContactBtn = styled.a`
  font-size: 20px;
  color:  ${({ theme }) => theme.colors.white};
  line-height: 75px;
  background-color: ${({ theme }) => theme.colors.primaryColor};
  cursor: pointer;
  border-radius: 8px;
  padding: 0 16px;
  display: block;
  width: auto !important;
  margin: 6%;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const StyledFloatingPrice = styled.div`
  background:  ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryColor};
  padding: 30%;
  text-align: center;
  font-size: 36px;

  & span {
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.black};
    font-size: 18px;
  }
`;