import { StyledButton, StyledValue, StyledValuePopup } from "./styledValuePopup";
import { useState } from "react";

type valuePopupProps = {
  name: string;
  value: number;
  max: number;
  min: number;
  onChange: (value: Record<string, number>) => void;
}

const ValuePopup = ({name, value, min, max, onChange}: valuePopupProps) => {

  const [currentValue, setCurrentValue] = useState(value);

  const decreaseValue = () => {
    const newVal = currentValue - 1 >= min ? currentValue - 1 : currentValue;
    const result = {} as Record<string, number>;
    result[name] = newVal;
    onChange(result);
    setCurrentValue(newVal);
  }

  const increaseValue = () => {
    const newVal = currentValue + 1 <= max ? currentValue + 1 : currentValue;
    const result = {} as Record<string, number>;
    result[name] = newVal;
    onChange(result);
    setCurrentValue(newVal);
  }

  return (<StyledValuePopup>
    <StyledButton onClick={decreaseValue}>-</StyledButton>
    <StyledValue>{currentValue}</StyledValue>
    <StyledButton onClick={increaseValue}>+</StyledButton>
  </StyledValuePopup>);
}

export default ValuePopup;