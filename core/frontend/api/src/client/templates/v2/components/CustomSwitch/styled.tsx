import styled from "styled-components";

export const StyledSwitchText = styled.p`
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  margin:0;

  color: #434343;
`;

export const StyledSwitch = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const StyledLabel = styled.div`
  position: relative;
  display: inline-block;
  width: 45px;
  height: 21px;
  align-items: center;
`;

export const StyledCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  :checked + .slider{
    background-color: #DC6B03;
  }

  :focus + .slider {
    box-shadow: 0 0 1px #DC6B03;
  }

  :checked + .slider:before {
    transform: translateX(24px);
  }
`;

export const CustomSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #DDDDDD;
  transition: .4s;
  border-radius: 34px;
  
  :before{
    position: absolute;
    content: "";
    height: 17px;
    width: 17px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
  }
`;