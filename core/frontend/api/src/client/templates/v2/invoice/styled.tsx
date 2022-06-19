import styled from "styled-components"
import Image from "next/image";

const size = {
    mobileS: "320px",
    mobileM: "375px",
    mobileL: "425px",
    tablet: "768px",
    laptop: "1024px",
    laptopL: "1440px",
    desktop: "1919px",
    desktopL: "2560px"
};

export const DownloadButton = styled.button`
  background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  cursor: pointer;
  padding: 8px 30px;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  color: #FFFFFF;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border: none;
  outline: none;
`

export const PriceText = styled.p`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  color: ${({theme}) => theme && theme.colors.gray};
`

export const InvoiceRef = styled.h4`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 8px 0;
  
  color: ${({theme}) => theme && theme.colors.primaryColor};
`

export const InfoItem = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  margin:0;
  
  color: ${({theme}) => theme && theme.colors.jetBlack};
`

export const InvoiceImageContainer = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const InvoiceImage = styled(Image)`
  
`

export const InvoiceBgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media screen and (max-width: 1200px){
    display: none;
  }
`

export const TableContainer = styled.div`
  flex: 2;
`

export const InvoicePageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export const InvoiceBg = styled(Image)`
  
`