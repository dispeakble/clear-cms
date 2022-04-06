import styled from "styled-components";
import {Colors} from "../../assets/design-set";

export const Wrapper = styled.div`
  background: red;
  display: flex;
  padding: 34px;
  width: 100%;
  margin-bottom: 50px;
`;

export const StyledTabs = styled.div`
  background: green;
  width: 440px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StyledTab = styled.div`
  background: blue;
  flex: 1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  font-size: 35px;
  color: white;
  text-shadow: 4px 4px 4px rgba(0,0,0,0.25);
  max-width: 440px;
  padding: 50px;
  text-align: center;
`;

export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 100px 20px;
`;

export const StyledTitle = styled.div`
  margin: 20px 0;
  font-size: 44px;
  color: ${Colors.primaryColor}
`;