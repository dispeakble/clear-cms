import {useTranslations} from "next-intl";
import {Item, LinkItem, StyledMenu, StyledMenuWrapper} from "./styled";

type MenuProps = {
    links: any[];
}

const Menu = ({ links }: MenuProps) => {
    const t = useTranslations('global');

    return (
        <StyledMenuWrapper>
            <StyledMenu>
                { links && links.map((link, i) => <Item>
                    <LinkItem href={link.linkSlug} key={`menu-link-${link.linkSlug}`}>
                        {t(`${link.linkSlug}`)}
                    </LinkItem>
                </Item>) }
            </StyledMenu>
        </StyledMenuWrapper>

    )
}

export default Menu;