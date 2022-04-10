import styled, { keyframes } from "styled-components";

const textAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  15% {
    opacity: 1;
    transform: translateY(0);
  }
  85% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(30px);
  }
`;
export const CardTitle = styled.h3`
  opacity: 0;
  transform: translateY(-30px);
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 500;


  animation-name: ${textAnimation};
  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
`;

export const CardDescription = styled.p`
  opacity: 0;
  text-align: center;
  transform: translateY(-30px);
  color: rgb(120, 120, 120);

  animation-name: ${textAnimation};
  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
`;

export const Item = styled.div`
  width: 100%;
  height: 300px;
  background: rgb(204, 204, 204);
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;