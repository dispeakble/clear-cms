import { StyledButton, StyledValue, StyledValuePopup } from "./styledValuePopup";
import { useState } from "react";

type valuePopupProps = {
  name: string;
  value: number;
  max: number;
  min: number;
  dataTestId: string;
  onChange: (value: Record<string, number>) => void;
}

const ValuePopup = ({name, value, min, max, dataTestId, onChange}: valuePopupProps) => {

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

  return (<StyledValuePopup data-testid={dataTestId}>
    <StyledButton onClick={decreaseValue} data-testid="test-minus-handler">-</StyledButton>
    <StyledValue data-testid="test-handler-value">{currentValue}</StyledValue>
    <StyledButton onClick={increaseValue} data-testid="test-plus-handler">+</StyledButton>
  </StyledValuePopup>);
}

export default ValuePopup;