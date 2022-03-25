import styled from "styled-components";
import {Colors, Shadows, Widths} from "../../../assets/design-set";

export const WrapperContainer = styled.div`
  width: 90%;
  margin: 0 auto;
  max-width: ${Widths.containerWidth};
  height: 100%;
  padding: 30px 0;
`

export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 32px;
  cursor: pointer;
  background-color: ${Colors.white};
  box-shadow: ${Shadows.primaryShadow};
  width: fit-content;
  margin: 0 auto;
  border-radius: 8px;
`

export const TabButton = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${Colors.grey};
  padding: 8px 16px;
  border-radius: 8px;
`

export const TabButtonActive = styled(TabButton)`
  background-color: ${Colors.primaryColor};
  color: ${Colors.white};
`
export const Cards = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
`
export const Card = styled.div`
  background-color: ${Colors.white};
  padding: 16px;
  box-shadow: ${Shadows.primaryShadow};
  border-radius: 16px;
`;
export const CardImg = styled.div`
  margin-bottom: 16px;

  img {
    height: 275px;
    width: 295px;
    object-fit: cover;
    border-radius: 22px;
  }
`;

export const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    background-color: #FCE8DD;
    color: ${Colors.primaryColor};
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
  }

  p {
    font-size: 14px;
    font-weight: 500;
  }

  button {
    outline: none;
    border: none;
    background-color: ${Colors.primaryColor};
    color: ${Colors.white};
    padding: 4px 8px;
    border-radius: 4px;
  }
`
export const CardTextContent = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-top: 16px;
`
export const CardTextItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;

`
export const CardTitle = styled.div`
  flex: 5;
  font-size: 13px;
  font-weigh: 600;
  color: ${Colors.black};
`
export const CardPrice = styled(CardTitle)`
  flex: 2;
  text-align: end;
  font-weigh: 700;
`