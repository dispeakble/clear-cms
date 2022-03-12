import styled, {keyframes} from "styled-components"

const itemAnimation = keyframes`
  0%{
    opacity:0;
    transform: translateY(30px);
  }
  100%{
    opacity:1;
    transform: translateY(0);
  }
`

export const ItemContainer = styled.div` 
  
    width: 100%;
    height: 500px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 25px;
    
    padding: 25px 40px;
    
    text-align: center;
    
    margin-bottom: 40px;
    
    opacity: 0;
    transform: translateY(30px);

    animation-name:${itemAnimation};
    animation-duration:1s;
    animation-fill-mode: forwards;
`