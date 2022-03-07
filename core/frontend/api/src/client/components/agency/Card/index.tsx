import {Item} from "./styled";
import {CardDescription, CardTitle} from "../Cards/styled";

const Card = ({cardTitle, cardDescription}: any) => {
    return(
        <Item>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
        </Item>
    )
}

export default Card