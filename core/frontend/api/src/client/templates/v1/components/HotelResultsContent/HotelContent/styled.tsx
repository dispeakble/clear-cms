import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding: 16px 20px 16px 20px ;
  background: #FFFFFF;
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.14);
  border-radius: 27px;
  margin-bottom: 16px;
`;

export const TopContent = styled.div`
  display: flex;
  width: 100%;
`;

export const SectionOne = styled.div`
  flex: 1 1 70%;
  display: flex;
`;


interface HotelImage {
    url: string
};

export const HotelImageContainer = styled.div`
  width: 346px;
  height: 190px;
  background: #FFFFFF;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.18);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HotelImage = styled.div<HotelImage>`
  background: url(${(props) => props.url}) no-repeat center center;
  border-radius: 10px;
  width: 312px;
  height: 172px;
`;



export const HotelInfo = styled.div`
  margin-left: 8px;
  h1 {
    font-weight: 700;
    font-size: 29px;
    line-height: 40px;
    margin: 0px;
  }
  p {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin: 0;
  }
  
  
`;

export const SectionTwo = styled.div`
  flex: 1 1 25%;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  
  div > div span{
    font-weight: 700;
    font-size: 29px;
    line-height: 44px;
    color: #FF840D;
  }
  button {
    background: linear-gradient(180deg, #7ACD13 0%, #5D9519 100%);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    width: 201.02px;
    height: 47px;
    border: none;
    color: white;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
  }
  
`;

export const BottomContent = styled.p`
  width: 100%;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: rgba(86, 82, 82, 0.97);
  margin: 8px 0px 0px 0px;
`;