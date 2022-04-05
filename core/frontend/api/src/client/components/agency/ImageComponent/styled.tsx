import styled from "styled-components";

export const HeroContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-end;
  z-index: 1;
  position: relative;
  
`;

export const ImageContainer = styled.div`
  width: 90%;
`;
export const InfoContainer = styled.div`
  position: absolute;
  left: 0;
  top: -60px;
  
  padding: 20px 25px;
  
  background: rgb(194, 36,71);
  color: white;
  min-width: 35%;
  
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  
  height: 200px;
  
  h2,h3 {margin: 0}
  
  h2{
    font-size: 50px;
    font-weight: bold;
  }
  h3{
    font-size: 40px;
    font-weight: 500;
    line-height: 0.4;
    margin-bottom: 10px;
  }
  
  p{
    a{
      color: white;
      text-decoration: underline;
    }
  }
`;