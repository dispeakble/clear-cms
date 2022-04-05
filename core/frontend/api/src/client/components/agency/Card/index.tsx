import { CardDescription, CardTitle, Item } from "./styled";

const Card = ({ cardTitle, cardDescription }: any) => {
  //TODO: add translations to cards
  return (
    <Item data-testid="card-item">
      <CardTitle data-testid="card-title">
        {cardTitle}
      </CardTitle>

      <CardDescription data-testid="card-description">
        {cardDescription}
      </CardDescription>
    </Item>
  );
};

export default Card;