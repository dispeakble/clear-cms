import { useTranslations } from "next-intl";
import { Item, LinkItem, StyledMenu, StyledMenuWrapper } from "./styled";

type MenuProps = {
  links: any[];
}

const Menu = ({ links }: MenuProps) => {
  const t = useTranslations();

  return (
    <StyledMenuWrapper>
      <StyledMenu>
        {links && links.map((link) => <Item key={`menu-link-${link.linkSlug}`}>
            <LinkItem href={`/${link.linkHref}`}>
              {t(`search.${link.linkText}`)}
            </LinkItem>
          </Item>
        )}
      </StyledMenu>
    </StyledMenuWrapper>
  );
};

export default Menu;