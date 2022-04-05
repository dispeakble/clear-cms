import styled from "styled-components";

interface IDateLabel {
  selected?: boolean;
}

export const SearchContainer = styled.form`
  height: auto;
  display: flex;
  
  
  justify-content: space-around;
  
  margin-top: 30px;
  margin-bottom: 100px;
  
  border-radius: 50px;

  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  position: relative;
`;

export const Separator = styled.div`
  height: 100%;
  width : 1px;
  background: #333;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 0;
  background: transparent;
  text-align: center;
`;

export const SearchItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  transition: background .4s ease-in-out;
  width: 100%;
  
  position: relative;
  
  &:hover{
    background: rgb(170, 170, 170, .3);
    transition: background .4s ease-in-out;
  }
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  width: 100%;
  color: white;
  font-size: 16px;
  background: rgb(194, 36,71);
  
  
  svg{
    font-size: 18px;
  }
`;

export const SearchLabel = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #333;
  margin-bottom: 4px;
  cursor: pointer;
`;

export const DateLabel = styled.label<IDateLabel>`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) => props.selected ? "#333" : "#777"};
`;

export const CalendarContainer = styled.div`
  position: absolute;
  height: auto;
  margin: 40px 0 0 -40px;
  max-width: 290px;
  z-index: 20;
  padding: 30px 10px;
  background: white;
  border-radius: 16px;
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

export const GuestsLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #777;
`;

export const GuestsContainer = styled.div`
  position: absolute;
  left: 50%;
  top: calc(100% + 20px);
  transform: translateX(-50%);
  height: auto;
  z-index: 20;
  padding: 30px 10px;
  background: white;
  border-radius: 30px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  
  width: 300px;
`;

export const GuestsItem = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #333;
`;

export const Handler = styled.div`
  font-size: 16px;
  color: #333;

  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  box-shadow: 0 0 1px 1px #333;
  
  align-items:center;
  justify-content: center;
  
  &::selection{
    background: none;
  }
`;

export const HandlerContainer = styled.div`
  width: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
`;

export const GuestsLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  label:first-child{
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  label:last-child{
    font-size: 12px;
    font-weight: 300;
    color: #777;
  }

`;