import React from "react";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
import {StyledLabel} from "./styled";

interface IProps{
    state: boolean;
    setState(state: boolean): void;
}

const CustomCheckbox: React.FC<IProps> = ({state, setState, children}) => {
    return(
        <StyledLabel>
            {children}
            <input type="checkbox" checked={state} onChange={(e) => setState(e.target.checked)} />
            <span></span>
        </StyledLabel>
    )
}

export default CustomCheckbox