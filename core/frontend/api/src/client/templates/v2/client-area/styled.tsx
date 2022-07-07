import styled from "styled-components";
import Link from "next/link"
import Image from "next/image"

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

export const ClientAreaWrapper = styled.div`
  padding: 64px;
  
  @media screen and (max-width: ${size.laptop}){
    padding: 0;
  }
`

export const ClientOuter = styled.div`
  border-radius: 12px;
  display: flex;
  gap: 20px;
  padding: 20px;

  @media screen and (max-width: ${size.tablet}){
    align-items: center;
    padding: 0;
  }
`

export const ClientProfilePicture = styled.div`
  width: 144px;
  height: 144px;
  min-width: 144px;
  border-radius: 50%;
  display:flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: ${size.tablet}){
    width: 70px;
    height: 70px;
    min-width: 70px;
  }
`

export const ClientProfileMainInfos = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 15px;

  @media screen and (max-width: ${size.tablet}){
    gap: 10px;
  }
`

export const Div = styled.div`
  padding: 20px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.22);
  border-radius: 12px;
  width: 100%;
`

export const ClientPersonalInfosContainer = styled(Div)`
  
`


export const ClientProfileMainInfosContainer = styled(Div)`
  gap: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  div:first-child {
    display: flex;
    gap: 20px;
    align-items: center;
    div{
      
    }
  }
  
  div:last-child {
    
  }

  @media screen and (max-width: ${size.tablet}){
    flex-direction: column;
    align-items: stretch;
  }
`

export const PersonalInfoItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px dashed ${({theme}) => theme.colors.primaryColor};
  &:last-child{
    border: none;
  }
`

export const ItemTitle = styled.p`
  font-weight: 600;
  font-size: clamp(16px, 3vw, 20px);
  line-height: 1.5;
  margin: 0;

  color: #3A5163;
`

export const ItemInfo = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 1.25;
  margin-top: 8px;
  
  color: #171C37;
`

export const EditProfileButton = styled.button`
  outline: none;
  border: none;
  background: ${({theme}) => theme.colors.primaryColor};
  color: ${({theme}) => theme.colors.white};
  font-size: 18px;
  line-height: 1.5;
  padding: 20px 30px;
  cursor: pointer;
  border-radius: 12px;

  @media screen and (max-width: ${size.tablet}){
    width: 100%;
    padding: 10px 30px;
    font-size: 16px;
  }
`

export const ClientGreetings = styled.h2`
  font-weight: 600;
  font-size: clamp(20px, 4vw, 40px);
  line-height: 1.5;
  margin: 0;

  color: #171C37;
`

export const Text = styled.p`
  font-weight: 400;
  font-size: clamp(13px, 2vw, 16px);
  line-height: 1.5;
  margin: 0;
  color: #3A5163;
`

export const NoOfDays = styled.h3`
  font-weight: 600;
  font-size: clamp(16px, 4vw, 24px);
  line-height: 1.5;
  margin: 0;
  
  color: #171C37;
`

export const PersonalInfos = styled.h3`
  font-weight: 600;
  font-size: clamp(18px, 4vw, 24px);
  line-height: 1.5;
  margin: 0;

  color: #171C37;
`