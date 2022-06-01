import { StyledButton, StyledValue, StyledValuePopup } from "./styledValuePopup";
import { useEffect, useState } from "react";

type valuePopupProps = {
  name: string;
  value: number;
  max: number;
  min: number;
  dataTestId: string;
  incTestId: string;
  decrTestId: string;
  inputTestId: string;
  onChange: (value: Record<string, number>) => void;
}

const ValuePopup = ({name, value, min, max, dataTestId, onChange, incTestId, decrTestId, inputTestId}: valuePopupProps) => {

  const [currentValue, setCurrentValue] = useState(value);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 30);
  }, [])

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

  return visible ? <StyledValuePopup data-testid={dataTestId}>
    <StyledButton onClick={decreaseValue} data-testid={decrTestId}>-</StyledButton>
    <StyledValue data-testid={inputTestId}>{currentValue}</StyledValue>
    <StyledButton onClick={increaseValue} data-testid={incTestId}>+</StyledButton>
  </StyledValuePopup> : <></>;
}

export default ValuePopup;