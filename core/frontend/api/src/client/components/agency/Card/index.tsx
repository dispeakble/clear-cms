import {Item, CardDescription, CardTitle} from "./styled";
import {useTranslations} from "next-intl";

const Card = ({cardTitle, cardDescription}: any) => {
    //TODO: add translations to cards
    const t = useTranslations('home')
    return(
        <Item data-testid="card-item">
            <CardTitle data-testid="card-title">
                {cardTitle}
            </CardTitle>

            <CardDescription data-testid="card-description">
                {cardDescription}
            </CardDescription>
        </Item>
    )
}

export default Card