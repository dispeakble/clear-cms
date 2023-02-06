import React from "react";
import { CustomSlider, StyledCheckbox, StyledLabel, StyledSwitch, StyledSwitchText } from "./styled";

const CustomSwitch = ({ setState, state, label }: any) => {
  return (
    <StyledSwitch>
      <StyledSwitchText>
        {label}
      </StyledSwitchText>
      <StyledLabel onClick={() => setState((prev: boolean) => !prev)}>
        <StyledCheckbox type="checkbox" checked={state} readOnly />
        <CustomSlider className="slider"></CustomSlider>
      </StyledLabel>
    </StyledSwitch>
  );
};

export default CustomSwitch;