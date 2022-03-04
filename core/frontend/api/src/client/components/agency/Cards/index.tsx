import {CardWrapper, CardTitle, CardDescription} from './styled'
import Card from "../Card";

const Cards = (props: any) => {

    return(
        <CardWrapper>
            {
                props.cards.map((card: any, i: number) =>
                    <Card key={i}>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                    </Card>
                )
            }
        </CardWrapper>
    )
}

export default Cards