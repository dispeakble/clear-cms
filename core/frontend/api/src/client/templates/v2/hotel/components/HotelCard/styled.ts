import styled from "styled-components";

export const Body = styled.div`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.14);
  border-radius: 15px;
  padding: 10px;
  margin: 5px;
  flex: 1;
`;

export const TitleText = styled.h3`
  font-weight: 400;
  font-size: 15px;
  margin: 0;
`;

export const SubTitle = styled.h3`
  font-weight: 400;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.lightGray};
`;

export const CardImage = styled.img`
  height: 142px;
  width: 100%;
  border-radius: 10px;
`;
export const CustomButton = styled.button`
  display: flex;
  justify-content: center;
  gap: 5px;
  align-items: center;
  
  margin-top: 10px;
  width: 100%;
  height: 42px;

  background: linear-gradient(180deg, ${({ theme }) => theme.colors.actionNormal} 0%, ${({ theme }) => theme.colors.actionDark} 100%);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 400;
  font-size: 20px;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  &:hover {
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.actionLight} 0%, ${({ theme }) => theme.colors.actionNormal} 100%);
  }
`;