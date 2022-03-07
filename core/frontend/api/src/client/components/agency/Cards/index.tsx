import {CardWrapper, CardTitle, CardDescription} from './styled'
import Card from "../Card";

const Cards = (props: any) => {

    return(
        <CardWrapper>
            {
                props.cards.map((card: any, i: number) =>
                    <Card key={i} cardTitle={card.title} cardDescription={card.description}/>
                )
            }
        </CardWrapper>
    )
}

export default Cards