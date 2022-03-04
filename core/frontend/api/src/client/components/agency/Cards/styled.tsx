import styled, {keyframes} from "styled-components";

const textAnimation = keyframes`
  0%{
    opacity:0;
    transform: translateY(-30px);
  }
  15%{
    opacity:1;
    transform: translateY(0);
  }
  85%{
    opacity:1;
    transform: translateY(0);
  }
  100%{
    opacity:0;
    transform: translateY(30px);
  }
`
export const CardTitle = styled.h3`
  opacity:0;
  transform: translateY(-30px);
  text-transform: uppercase;
  font-size:18px;
  font-weight:500;
  
  
  animation-name:${textAnimation};
  animation-duration:10s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
`

export const CardDescription = styled.p`
  opacity:0;
  text-align: center;
  transform: translateY(-30px);
  color: rgb(120, 120, 120);

  animation-name:${textAnimation};
  animation-duration:10s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
`

export const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  
  width: 90%;
  margin-top: -80px;
  z-index: 5;
  
  position: relative;
`