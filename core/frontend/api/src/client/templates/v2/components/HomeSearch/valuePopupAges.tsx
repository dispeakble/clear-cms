import {
  StyledAgeLabel,
  StyledButton,
  StyledValue,
  StyledValuePopup,
  StyledValuePopupControl,
  StyledValuePopupList
} from "./styledValuePopup";
import React, { useEffect, useState } from "react";

type valuePopupAgesProps = {
  name: string;
  data: number[];
  count: number;
  max: number;
  min: number;
  dataTestId: string;
  className: string;
  style?: Record<string, any>;
  onChange: (value: Record<string, number[]>) => void;
}

const ValuePopupAges: React.FC<valuePopupAgesProps> = ({
                                                         name,
                                                         data,
                                                         count,
                                                         min,
                                                         max,
                                                         dataTestId,
                                                         className,
                                                         style,
                                                         onChange
                                                       }) => {

  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    const res: number[] = [];

    for (let i = 0, t = count; i < t; i++) {
      res[i] = data[i] || 0;
    }

    setValues(res);

    onChange({ [name]: res });

  }, [count]);


  const decreaseValue = (index: number) => {
    const newVal = values[index] - 1 >= min ? values[index] - 1 : values[index];
    const result = {} as Record<string, number[]>;
    const newValues = values;
    newValues[index] = newVal;
    result[name] = newValues;
    setValues(newValues);
    onChange(result);
  };

  const increaseValue = (index: number) => {
    const newVal = values[index] + 1 <= max ? values[index] + 1 : values[index];
    const result = {} as Record<string, number[]>;
    const newValues = values;
    newValues[index] = newVal;
    result[name] = newValues;
    setValues(newValues);
    onChange(result);
  };

  return (<StyledValuePopup data-testid={dataTestId} className={className} style={style}>
    {values.map((val: number, i: number) => (
      <StyledValuePopupList key={i}>
        <StyledAgeLabel>Child {i + 1} age:</StyledAgeLabel>
        <StyledValuePopupControl>
          <StyledButton onClick={() => decreaseValue(i)} data-testid="test-age-minus-handler">-</StyledButton>
          <StyledValue data-testid="test-age-handler-value">{val}</StyledValue>
          <StyledButton onClick={() => increaseValue(i)} data-testid="test-age-plus-handler">+</StyledButton>
        </StyledValuePopupControl>
      </StyledValuePopupList>
    ))}

  </StyledValuePopup>);
};

export default ValuePopupAges;