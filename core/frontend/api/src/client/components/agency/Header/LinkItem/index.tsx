import { Item, LinkItem } from "./styled";

type Props = {
  linkText: string
  linkSlug: string
}

export default function(props: Props) {
  const { linkSlug, linkText } = props;

  return (
    <Item>
      <LinkItem href={linkSlug}>{linkText}</LinkItem>
    </Item>
  );
}
