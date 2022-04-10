import styled from "styled-components";
import {device, size} from "../../styled";
import {Colors} from "../../assets/design-set";

export const StyledQuickAboutUs = styled.div`
  width: 100%;
  height: 100%;
  margin: 20px;
  display: block;
  @media ${device.tablet} {
    display: flex;
  }
`;

export  const  StyledQuickAboutUsImage = styled.div<{src: any}>`
  background: url(${({src}) => src}) no-repeat center center;
  background-size: cover;
  flex: 1;
  margin-right: 6%;
  width: 100%;
  min-height: 250px;
`;

export  const  StyledQuickAboutUsText = styled.div<{src: any}>`
  flex: 1;
  padding: 6%;
  width: 100%;
`;

export const StyledTitle = styled.div`
  font-size: 48px;
`;

export const StyledDescription = styled.div`
  font-size: 20px;
  color: ${Colors.gray};
  line-height: 200%;
`;

export const StyledContactBtn = styled.a`
  font-size: 20px;
  color: #FFFFFF;
  line-height: 75px;
  background-color: ${Colors.primaryColor};
  cursor: pointer;
  border-radius: 8px;
  padding: 0 16px;
  display: inline-block;
  margin-top: 6%;
  &:hover {
    color: ${Colors.primaryLight}
  }
`;

export const StyledFloatingPrice = styled.div`
  background: #FFFFFF;
  color: ${Colors.primaryColor};
  padding: 30%;
  text-align: center;
  font-size: 36px;
  & span {
    text-transform: uppercase;
    color: black;
    font-size: 18px;
  }
`;