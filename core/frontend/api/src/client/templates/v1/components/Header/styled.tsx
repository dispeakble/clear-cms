import styled from "styled-components";
import { device, size } from "../../styled";

type HeaderWrapperProps = {
  className: string
}

export const HeaderWrapper = styled.header<HeaderWrapperProps>`
  width: 100%;
  display: flex;
  
  align-items: center;
  background: rgba(0,0,0,0);
  position: fixed;
  z-index: 9999;
  top: 0;
  
  

  -webkit-transition: background-color 1000ms linear;
  -ms-transition: background-color 1000ms linear;
  transition: background-color 1000ms linear;

  &.fixedHeader {
    z-index: 999;
    background: ${({theme}) => theme.colors.primaryColor};
    box-shadow: 0 10px 10px -4px rgba(0,0,0,0.3);
  }
`;

export const HeaderContent = styled.div`
  margin: 0 auto;
  padding: 20px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  @media (max-width: ${size.laptop}) {
    padding: 0;
  }
  @media ${device.mobileS} {
    max-width: 320px;
  }
  @media ${device.mobileM} {
    max-width: 375px;
  }
  @media ${device.mobileL} {
    max-width: 400px;
  }
  @media ${device.tablet} {
    max-width: 720px;
  }
  @media ${device.laptop} {
    max-width: 900px;
  }
  @media ${device.laptopL} {
    max-width: 1280px;
  }
  @media ${device.desktop} {
    max-width: 1440px;
  }
  @media ${device.desktopL} {
    max-width: 1440px;
  }
`;


export const LogoWrapper = styled.div`
  filter: drop-shadow(0px 0 4px rgba(255,255,255,0.7));
  order: 1;
  margin: 0 5px;
  @media (max-width: ${size.laptop}) {
    order: 2;
    flex: 1;
    text-align: center;
  }
`;

export const MenuWrapper = styled.div`
  flex: 1;
  color: inherit;
  margin: 0 10px;
  order: 2;
  @media (max-width: ${size.laptop}) {
    order: 1;
    flex: none;
    margin: 0;
  }
`;

export const SearchWrapper = styled.div`
  border: 1px solid ${({theme}) => theme.colors.primaryColor};
  position: relative;
  background: url(${({theme}) => theme.icon('search')}) no-repeat 16px center  ${({theme}) => theme.colors.white};
  order: 4;
  margin-left: 10px;
  @media (max-width: ${size.laptop}) {
    order: 3;
    margin: 0;
  }
`;

export const InputSearch = styled.input`
  outline: none;
  border: none;
  background: none;
  width: 50px;
  height: 50px;
  padding: 0;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    padding: 8px 8px 8px 65px;
    width: 100%;
  }

  @media (min-width: ${size.laptop}) {
    padding: 8px 8px 8px 65px;

    width: 100%;
    &::placeholder {
      color: inherit;
    }
  }
`;

export const AuthWrapper = styled.div`
  display: flex;
  gap: 15px;
  position: relative;
  height: 100%;
  margin-left: 15px ;
  order: 5;
`

export const StyledButton = styled.div`
  padding: 4px 30px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid;
  display: flex;
  align-items: center;
  text-align: center;
`

export const LoginButton = styled.a`
  cursor: pointer;
  color: ${({theme}) => theme.colors.white};
  :hover {
    text-decoration: underline;
    color: ${({theme}) => theme.colors.white};
  }
`

export const RegisterButton = styled(StyledButton)`
  background: ${({theme}) => theme.colors.white};
  color: #70B915;
`

export const ProfileContainer = styled.div`
  position: relative;
  order: 5;
  margin-left: 25px;
`

export const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
  border-radius: 12px;
  padding: 4px 12px;
  gap: 8px;
  cursor: pointer;
  @media screen and (max-width: ${size.tablet}){
    background: transparent;
  }
`

export const ProfileFirstName = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;

  text-decoration-line: underline;

  color: ${({theme}) => theme.colors.white};
  
  @media screen and (max-width: ${size.tablet}){
    display: none;
  }
`

export const ProfilePicture = styled.div`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ProfilePictureBig = styled.div`
  border-radius: 50%;
  width: 64px;
  height: 64px;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ProfileMainInfos = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
`

export const UserFullName = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  max-width: 200px;
  margin: 0;
  flex: 1;
  
  color: ${({theme}) => theme.colors.jetBlack};
`

export const UserEmail = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin:0;
  color: ${({theme}) => theme.colors.gray};
  text-overflow: ellipsis;
  overflow-x: clip;
  white-space: nowrap;
  width: 100%;
`

export const IconContainer = styled.div`

`

export const ProfileInfosContainer = styled.div<{isOpen?: boolean}>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  
  width: 375px;
  
  display: ${({isOpen}) => isOpen ? 'block' : 'none'};

  background: rgb(${({theme}) => theme.colors.primaryColorFadedRBG});
  box-shadow: 0 0 24px rgba(0, 75, 139, 0.24);
  border-radius: 8px;
  
  padding: 20px 25px;
`

export const ProfileInfosItem = styled.div`
  padding: 24px;
  border-bottom: 1px dashed ${({theme}) => theme.colors.primaryColor};
  cursor: pointer;
`

export const InfosItem = styled.div`
  display: flex;
  gap: 16px;
`

export const InfosItemLabel = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  color: ${({theme}) => theme.colors.jetBlack};
  white-space: nowrap;
`

export const ProfilePictureInfosContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px dashed ${({theme}) => theme.colors.primaryColor};
`

export const LogoutButton = styled.button`
  background: ${({theme}) => theme.colors.primaryColor};
  color: ${({theme}) => theme.colors.white};
  outline: none;
  border: none; 
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  width: 100%;
  
  cursor: pointer;

  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  
  padding: 7px 110px;
  
  margin-top: 12px;
  transition: .2s background ease-in-out;
  
  &:hover{
    background: ${({theme}) => theme.colors.primaryColorHover};
    transition: .2s background ease-in-out;
  }
`

export const LanguagesWrapper = styled.div`
  order: 3;
  @media (max-width: ${size.laptop}) {
    order: 4;
  }
`;