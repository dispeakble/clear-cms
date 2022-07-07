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
`

export const ClientOuter = styled.div`
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.22);
  border-radius: 12px;
  display: flex;
  gap: 20px;
  padding: 20px;
`

export const ClientProfilePicture = styled.div`
  width: 144px;
  height: 144px;
  border-radius: 50%;
  padding-top: 20px;
  dislay:flex;
  align-items: center;
  justify-content: center;
`

export const ClientProfileMainInfos = styled.div`
  padding: 20px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const ClientProfileMainInfosContainer = styled.div`
`

export const ClientGreetings = styled.h2`
  font-weight: 600;
  font-size: 40px;
  line-height: 1.5;
  margin: 0;

  color: #171C37;
`

export const Text = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  color: #3A5163;
`

export const NoOfDays = styled.h3`
  font-weight: 600;
  font-size: 24px;
  line-height: 1.5;
  margin: 0;
  
  color: #171C37;
`