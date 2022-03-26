import styled from "styled-components";
import {Colors, Widths} from "../../../assets/design-set";

export const WrapperContainer = styled.div`
  width: 90%;
  margin: 30px auto;
  max-width: ${Widths.containerWidth};
  height: 100%;
  padding: 0px 0;
`

export const TopHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  line-height: 1.6em;
  text-align: center;
`

export const TaglineDescription = styled.h3`
  font-size: 24px;
  font-weight: 500;
  color: ${Colors.black}
`

export const TaglineHeading = styled.h2`
  font-size: 48px;
  font-weight: 700;
  color: ${Colors.black};
  margin: 0;
`