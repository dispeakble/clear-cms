import { StyledButton, StyledValue, StyledValuePopup } from "./styledValuePopup";
import React, { useEffect, useState } from "react";

type valuePopupProps = {
  name: string;
  value: number;
  max: number;
  min: number;
  dataTestId: string;
  style?: Record<string, any>;
  onChange: (value: Record<string, number>) => void;
}

const ValuePopup: React.FC<valuePopupProps> = ({ name, value, min, max, dataTestId, style, onChange }) => {

  const [currentValue, setCurrentValue] = useState(value);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 30);
  }, []);

  const decreaseValue = () => {
    const newVal = currentValue - 1 >= min ? currentValue - 1 : currentValue;
    const result = {} as Record<string, number>;
    result[name] = newVal;
    onChange(result);
    setCurrentValue(newVal);
  };

  const increaseValue = () => {
    const newVal = currentValue + 1 <= max ? currentValue + 1 : currentValue;
    const result = {} as Record<string, number>;
    result[name] = newVal;
    onChange(result);
    setCurrentValue(newVal);
  };

  return visible ? <StyledValuePopup style={style} data-testid={dataTestId}>
    <StyledButton onClick={decreaseValue} data-testid="test-minus-handler">-</StyledButton>
    <StyledValue data-testid="test-handler-value">{currentValue}</StyledValue>
    <StyledButton onClick={increaseValue} data-testid="test-plus-handler">+</StyledButton>
  </StyledValuePopup> : <></>;
};

export default ValuePopup;