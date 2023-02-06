import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { device } from "../styled";

export const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "1919px",
  desktopL: "2560px"
};

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  gap: 20px;
`;

export const ImageContainer = styled.div`
  display: flex;
  @media screen and (max-width: ${size.laptop}){
    display: none;
  }
`;

export const LoginFormWrapper = styled.div`
  background: #FFFFFF;
  flex: 1;
  border-radius: 40px;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.3);

  min-height: 765px;
  display: flex;
  flex-direction: column;
  @media ${device.mobileM} {
    padding: 20px 35px;
  }
`;

export const StyledLoginTitle = styled.h2`
  font-style: normal;
  font-weight: 700;
  font-size: 64px;
  line-height: 1.5;
  margin: 0 0 40px 0;

  color: #FF8C1D;
`;

export const InputContainer = styled.div`
  flex: 1;
  display: flex;
`;

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const InputLabel = styled.label`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.5;
  margin: 0;
  color: #999999;
`;

export const TextInput = styled.input<{ icon: string }>`
  outline: none;
  border: none;
  padding: 11px 38px;
  font-size: 18px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  border-bottom: 2px #999999 solid;
  line-height: 1.5;
  color: #434343;
  background: url(${({ theme, icon }) => theme.icon(icon)}) no-repeat 10px 50%;

  ::placeholder{
    color: #ADADAD;
  }

  :is(.passwordInput){
    position: relative;
  }
`;

export const ShowPasswordContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 25px;
  transform: translateY(50%);
  cursor: pointer;
  z-index: 999;
`;

export const ShowPasswordIcon = styled(Image)`

`;

export const ErrorText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.5;
  margin:0;

  color: #e74c3c;
`;

export const RememberMeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 200px;
`;

export const StyledCheckboxLabel = styled.label`
  display: flex;
  gap: 10px;
  height: 20px;
  align-items: center;

  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  margin: 0;

  cursor: pointer;

  input{
    cursor: pointer;
    width: 15px;
    height: 15px;
  }

  color: #868484;
`;

export const ForgotPassword = styled(Link)`
  text-decoration: none;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;

  color: #FF8C1D !important;

  &:hover{
    text-decoration: none;
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  @media ${device.mobileM} {
    & button {
      max-width: 230px;
    }
  }
`;

export const ContinueButton = styled.button`
  background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.5;
  color: #FFFFFF;
  align-items: center;
  cursor: pointer;
  border: none;
  outline: none;
  padding: 18px 0;
  justify-content: space-between;
  text-align: center;
  width: 100%;

  gap: 20px;

  :is(:disabled){
    cursor: not-allowed;
    background: linear-gradient(180deg, #D0D0D0 0%, #919191 100%) !important;
    span{
      color: #959595;
    }
  }

  @media screen and (max-width: ${size.tablet}){
    width: 100%;
    justify-content: center;
    padding: 18px 0;
  }
`;

export const InformationText = styled.p`
  text-align: center;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  margin: 0;
  color: #000000;

  a{
    color: #FF8C1D;
  }
`;