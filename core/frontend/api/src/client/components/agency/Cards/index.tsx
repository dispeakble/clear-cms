import {CardWrapper} from './styled'
import Card from "../Card";
import SkeletonCard from "../SkeletonCard";

type CardProps = {
    Name: string;
    Description: string;
}

type CardsProps = {
    cards: CardProps[]
};

const Cards = (props: CardsProps) => {
    const {cards} = props;
    return(
        <CardWrapper data-testid="cards-wrapper">
            {
                cards.length > 0 ? cards.map((card: any, i: number) =>
                    <Card key={i} cardTitle={card.Name} cardDescription={card.Description}/>
                ) : (
                    <SkeletonCard />
                )
            }
        </CardWrapper>
    )
}

export default Cards