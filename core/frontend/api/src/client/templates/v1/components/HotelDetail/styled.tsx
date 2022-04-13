import styled from "styled-components";
import {size} from "../../styled";
import searchIcon from "../../assets/img/search-icon.svg"
import WhiteSearchIcon from "../../assets/img/white-search-icon.svg"
import calenderIcon from "../../assets/img/calender-icon.svg"
import dropdownIcon from "../../assets/img/dropdown-icon.svg"
import adultIcon from "../../assets/img/person-icon.svg"
import infantIcon from "../../assets/img/infant-icon.svg"
import childIcon from "../../assets/img/child-icon.svg"
import infoicon from "../../assets/img/info-icon.svg"
import closeIcon from "../../assets/img/close-icon.svg"
import {Shadows} from "../../../../assets/design-set";







export const Wrapper = styled.div`
  margin-top: 30px;
  gap: 20px;
  @media (min-width: ${size.laptop}) {
    display: flex;
    flex: 1 1;
  }
`;

export const DealCard = styled.div`
  background: ${({theme}) => theme.colors.white};
box-shadow: 0 4px 7px 0 rgb(0 0 0 / 17%);
  height: max-content;
  cursor: default;
`
export const CardHead = styled.div`
border: 1px solid ${({theme}) => theme.colors.borderOutline};
  background: ${({theme}) => theme.colors.white};

line-height: 48px;
font-size: 32px;
  color: ${({theme}) => theme.colors.gray};

display: flex;
align-items: center;
padding: 18px 0 18px 32px;
  font-weight: 400;
`

export const EditDeals = styled.div`
padding: 27px;
 

`
export const Destination = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  
  h4{
    color: ${({theme}) => theme.colors.black};
    font-size: 16px;
    margin-left: 12px;
  }
`

export const HotelSearch = styled.div`
  display: flex;
  justify-content: space-around;
  height: 50px;
  background: ${({theme}) => theme.colors.white};

  border: 1px solid ${({theme}) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0px 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;

  input{
    border: none;
    width: 82%;
    height: 48px;
    margin-left: 18px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
`
export const  SearchIcon = styled.div`
  width: 25px;
  height: 23px;
  position: relative;
  top: 13px;
  left: 18px;
background: url(${searchIcon.src}) no-repeat left center;`

export const CalenderIcon = styled.div`
  width: 50px;
  height: 23px;
  position: relative;
  top: 13px;
  left: 18px;
  background: url(${calenderIcon.src}) no-repeat left center;
`
export const DropdownIcon = styled.div`
  width: 40px;
  height: 57px;
  cursor: pointer;
  background: url(${dropdownIcon.src}) no-repeat left center;
`
export const NewSearch = styled.div`
  display: flex;
  flex: 1;
  
  button {
    background: linear-gradient(180deg, ${({theme}) => theme.colors.primaryDark} 0%, ${({theme}) => theme.colors.primaryColor} 100%);
    color: ${({theme}) => theme.colors.white};
    height: 50px;
    padding-right: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0,0,0,0.25);
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: flex;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    flex: 1;
    &:hover {
      background: linear-gradient(180deg, #FFBA77 0%, #DE8C41 100%);
      color: #FFFFFF;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  }
`
export const WhiteIcon = styled.div`
  width: 50px;
  height: 50px;
  display: inline-block;
  background: url(${WhiteSearchIcon.src}) no-repeat center center;
`
export const GuestType = styled.div`
  display: flex;
  justify-content: space-around;
  height: 50px;
  background: ${({theme}) => theme.colors.white};

  border: 1px solid ${({theme}) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0px 4px 7px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
`
export const AdultBox = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
export const AdultIcon = styled.div`
  position: relative;
  height: 26px;
  width: 10px;
  top: 0px;
  background: url(${adultIcon.src}) no-repeat left center;
`
export const AdultNumber = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

`
export const ChildIcon = styled.div`
  position: relative;
  height: 26px;
  width: 10px;
  top: 0px;
  background: url(${childIcon.src}) no-repeat left center;
`
export const InfantIcon = styled.div`
  position: relative;
  height: 26px;
  width: 15px;
  top: 0px;
  background: url(${infantIcon.src}) no-repeat left center;
`
export const HotelView = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  @media (min-width: ${size.laptop}) {
    width: 379px;
    padding: 0;
  }
`
export const HotelInfo = styled.div`
  display: block;
  @media (min-width: ${size.laptopL}) {
    display: flex;
    justify-content: space-between;
  }
`
export const HotelName = styled.div`
  font-size: 36px;
  color: ${({theme}) => theme.colors.gray};
  font-weight: 400;
  line-height: 30px;
  text-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
  cursor: default;
`
export const ViewPrice = styled.div`
  position: relative;
  display: flex;
  button {
    flex: 1;
    height: 66px;
    background: linear-gradient(180deg, #7CCF13 0%, #639722 100%);
    color: ${({theme}) => theme.colors.white};
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0,0,0,0.25);
    font-size: 24px;
    align-items: center;
    cursor: pointer;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    padding: 0 46px 0 65px;
    display: flex;
    justify-content: center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    &:hover {
      background: linear-gradient(180deg, #A9F945 0%, #69AD14 100%);
    }
    @media (min-width: ${size.tablet}) {
      width: 268px;
    }
  }
`
export const InfoIcon = styled.span`
  display: inline-block;
  height: 32px;
  width: 32px;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  background: url(${infoicon.src}) no-repeat center center;

`
export const LeftSide = styled.div``
export const Star = styled.div`

`
export const ShortDescription = styled.div`
  display: flex;
  width: 360px;
  justify-content: space-between;

`
export const HotelLocation = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: #0009;
  cursor: default;
`
export const ViewMap = styled.div`
  a{
    color: ${({theme}) => theme.colors.secondaryColor};
    font-size: 16px;
    cursor: pointer;
    font-weight: 500;
  }
`
// Slider Section

export const SliderSection = styled.div`
  position: relative;
  height: 100%;
  display: flex;
`
export const DateDiv=styled.div`
position: relative;
`

export const ShowDate=styled.div`
  position: absolute;
  top: 80px;
  right: 0;
  left: 0;
  border: 1px solid ${({theme}) => theme.colors.borderOutline};
  background-color: ${({theme}) => theme.colors.white};
`
export  const HeadingDiv =styled.div`
  width: 200px;
  background-color: ${({theme}) => theme.colors.white};
`
export  const DiVForH5 =styled.div`
text-align:center;
`
export const MemberBox = styled.div`
  display: flex;
  justify-content: center;
  border: 1px solid ${({theme}) => theme.colors.borderOutline};
  border-radius: 12px;
  gap: 18px;
  padding: 10px;
`
export const CounterDiv = styled.div`
  display: flex;
  padding: 10px;
  width:100%;
  justify-content: space-between;
`
export const CounterBtn = styled.div`
  fontSize: 12px;
  background-color: ${({theme}) => theme.colors.offWhite};
  cursor: pointer;
  padding: 1px 9px;
  border-radius: 100%;
  box-shadow: ${Shadows.primaryShadow};
  :hover {
    background-color:${({theme}) => theme.colors.primaryColor};
    color:${({theme}) => theme.colors.white};
  }
  

`

export const PersonBox = styled.div`
display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  
`
export const InfBox = styled.div`
  display: flex;
`
export const ChildBox = styled.div`
  display: flex;
`
export const SliderLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
margin-right: 10px;
  height: 437px;
  background: ${({theme}) => theme.colors.white};

  border: 1px solid ${({theme}) => theme.colors.borderOutline};
  box-sizing: border-box;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
  padding: 12px;
`
export const SliderRight = styled.div`
height: 437px;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.25);
`

export const ImageCount = styled.div`
  width: 183px;
  height: 130px;
  background-size: cover;
  margin-top: 10px;
`

export const StyledDescription = styled.div`
  width: 100%;
  font-size: 20px;
  color: rgba(0,0,0,0.5);
  display: inline;
  @media only screen and (max-width:${size.tablet}){
    font-size:18px;
    margin-top:10px;
  }
`;

export const StyledDescriptionMore = styled.a`
  cursor: pointer;
  color: ${({theme}) => theme.colors.primaryColor};
`;

export const DetailsCard = styled.div`
  position: absolute;
  z-index: 1;
  width: 320px;
  background: ${({theme}) => theme.colors.white};
  border-radius: 12px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

`;
export const PersonEntry = styled.div`
  padding: 0 22px 70px 22px;

`;
export const SubDetail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
margin-top: 50px;
  button {
    background: linear-gradient(180deg, ${({theme}) => theme.colors.primaryDark} 0%, ${({theme}) => theme.colors.primaryColor} 100%);
    color: ${({theme}) => theme.colors.white};
    width: 340px;
    height: 45px;
    padding-right: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 4px rgba(0,0,0,0.25);
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: flex;
    text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    flex: 1;
    &:hover {
      background: linear-gradient(180deg, #FFBA77 0%, #DE8C41 100%);
      color: #FFFFFF;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    }
`;
export const CardDesc = styled.div`
  font-weight: 600;
  font-size: 17px;
  line-height: 200%;
  text-transform: uppercase;
  color: #7C7C7C;
  display: flex;
  justify-content: flex-start;
`;
export const Person = styled.div`
display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const BoxLeft = styled.div`
display: flex;
  flex-direction: column;
    h3{
      font-weight: 600;
      font-size: 25px;
      line-height: 38px;
      margin-bottom: 0;
      color: ${({theme}) => theme.colors.black};
    }
  p{
    font-weight: 500;
    font-size: 14px;
    line-height: 200%;
    color: ${({theme}) => theme.colors.gray};
  }
`;
export const BoxRight = styled.div``;
export const DetailTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 93px;
  background: ${({theme}) => theme.colors.white};
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.25);
  font-weight: 600;
  font-size: 27.5px;
  line-height: 41px;
  text-align: center;
  border-radius: 12px 12px 0 0;
  color: ${({theme}) => theme.colors.black};
  margin-bottom: 30px;
`;
export const CloseIcon = styled.div`
  background: url(${closeIcon.src}) no-repeat left center;
  width: 22px;
  height: 22px;
  position: relative;
  right: 80px;
`;
export const Quantity = styled.div`
display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 130px;
  height: 44.31px;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.borderOutline};
  
  span{
    font-weight: 600;
    font-size: 25px;
    line-height: 38px;
    color: ${({theme}) => theme.colors.black};
    cursor: pointer;
  }
  h5{
    font-weight: 600;
    font-size: 25px;
    line-height: 38px;
    color: ${({theme}) => theme.colors.black};
    margin-bottom: 0;
  }
`;