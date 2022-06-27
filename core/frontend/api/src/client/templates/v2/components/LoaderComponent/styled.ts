import styled, {keyframes} from "styled-components"

export const LoaderAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

export const Loader = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  
  div{
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${({theme}) => theme.colors.primaryColor};
    animation: ${LoaderAnimation} 1.2s linear infinite;
  }

  div:nth-child(1) {
    top: 8px;
    left: 8px;
    animation-delay: 0s;
  }
  div:nth-child(2) {
    top: 8px;
    left: 32px;
    animation-delay: -0.4s;
  }
  div:nth-child(3) {
    top: 8px;
    left: 56px;
    animation-delay: -0.8s;
  }
  div:nth-child(4) {
    top: 32px;
    left: 8px;
    animation-delay: -0.4s;
  }
  div:nth-child(5) {
    top: 32px;
    left: 32px;
    animation-delay: -0.8s;
  }
  div:nth-child(6) {
    top: 32px;
    left: 56px;
    animation-delay: -1.2s;
  }
  div:nth-child(7) {
    top: 56px;
    left: 8px;
    animation-delay: -0.8s;
  }
  div:nth-child(8) {
    top: 56px;
    left: 32px;
    animation-delay: -1.2s;
  }
  div:nth-child(9) {
    top: 56px;
    left: 56px;
    animation-delay: -1.6s;
  }
`

export const LoaderText = styled.h3`
  font-style: normal;
  font-weight: 700;
  font-size: 64px;
  line-height: 1.5;
  margin: 0 0 40px 0;

  color: ${({theme}) => theme && theme.colors.black};
`

export const LoaderContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  justify-content: center;
`