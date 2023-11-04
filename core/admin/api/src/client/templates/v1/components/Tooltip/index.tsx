import * as React from 'react';
import { TooltipCard, TooltipText, TooltipBox } from "./styled";

const CustomTooltip = (props: any) => {
  return (
    <TooltipCard>
      <TooltipText>
        {props.children}
      </TooltipText>
      <TooltipBox>
        <p>{props.text}</p>
      </TooltipBox>
    </TooltipCard>
  );
};

export default CustomTooltip;