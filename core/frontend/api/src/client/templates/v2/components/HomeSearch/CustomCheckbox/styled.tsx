import styled from "styled-components";

export const StyledLabel = styled.label`
  display: flex;
  position: relative;
  padding-left: 35px;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  height: 25px;
  color: #333;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  & > input{
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  } 
  
  & > span{
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #ccc;
  }
  
  &:hover input ~ span {
    background-color: #ccc;
  }

  input:checked ~ span {
    background-color: #DC6B03;
  }

  span:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ .span:after {
    display: block;
  }

  span:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;