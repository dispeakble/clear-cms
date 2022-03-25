import styled from "styled-components";
import {Colors, Widths} from "../../../assets/design-set";

export const AboutUsMainWrapper = styled.section`
  margin: 100px 120px 120px 120px;
`

export const AboutUsWrapper = styled.section`
  display: flex;
  gap: 90px;
`
export const AboutUsContainer = styled.div`
  width: 90%;
  max-width: ${Widths.containerWidth};
  margin: 0 auto;
`

export const AboutUsImageWrapper = styled.div`
  flex: 2;
  position: relative;
`
export const AboutImage = styled.img`
  height: 800px;
  width: 480px;
  object-fit: cover;
`

export const AboutUsContentWrapper = styled.div`
  flex: 3;
  align-self: center;
  padding-right: 30px;
`

export const AbsoluteItem = styled.div` position: absolute;
  height: 120px;
  width: 180px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
  right: -60px;
  top: 35%;
  transform: translate(0, -35%);
  
  h4 {
    color: ${Colors.primaryColor};
    font-size: 36px;
    font-weight: 700;
    margin: 0;
  }
  h5 {
    margin: 8px 0 0 0;
    font-size: 18px;
    text-transform: uppercase;
    font-weight: 300;
  }
`

export const AbsoluteItemOne = styled(AbsoluteItem)`
  right: -60px;
  top: 15%;
  transform: translate(0, -15%);
`
export const AbsoluteItemTwo = styled(AbsoluteItem)`
  left: -60px;
  top: 50%;
  transform: translate(0, -50%);
`
export const AbsoluteItemThree = styled(AbsoluteItem)`
  right: -60px;
  top: 85%;
  transform: translate(0, -85%);
`

export const AboutUsTitle = styled.h2`
  font-size: 48px;
  font-weight: 600;
  line-height: 1.6em;
  color: ${Colors.black};
`
export const AboutUsDescription = styled.p`
  font-size: 20px;
  line-height: 2em;
  color: rgba(87, 87, 87, 0.884);
`
export const PrimaryButton = styled.button`
  margin-top: 30px;
  outline: none;
  border: none;
  background-color: ${Colors.primaryColor};
  color: #fff;
  padding: 16px 32px;
  font-size: 20px;
  border-radius: 10px;
`