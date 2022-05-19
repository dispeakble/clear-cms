import styled from "styled-components";

export const FilterWrapper = styled.div`
    width: 100%;
    background: #FFFCFC;
    margin-bottom: 16px;
`;
export const FilterTitleContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #C4C4C4;
  padding: 8px;
`;

export const FilterTitle = styled.h3`
    
`;

export const FilteringIcon = styled.div`
  background: url(${({theme}) => theme.icon('resultFilter')}) no-repeat center center;
  width: 40px;
`;

export const FilterOptionsContainer = styled.div`
  padding: 8px 8px 24px 8px;
`;

export const CheckboxContainer = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input`
  border: 2px solid #404040;
  width: 16px;
  height: 16px;
`;

export const Label = styled.label`
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  margin-left: 8px;
`;
