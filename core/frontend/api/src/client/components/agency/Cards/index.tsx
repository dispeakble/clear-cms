import {CardWrapper} from './styled'
import Card from "../Card";
import SkeletonCard from "../SkeletonCard";

const Cards = (props: any) => {
    const {cards} = props;
    return(
        <CardWrapper data-testid="cards-wrapper">
            {
                cards && cards.length > 0 ? cards.map((card: any, i: number) =>
                    <Card key={i} cardTitle={card.Name} cardDescription={card.Description}/>
                ) : (
                    <SkeletonCard />
                )
            }
        </CardWrapper>
    )
}

export default Cards