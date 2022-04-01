import {useTranslations} from "next-intl";
import {Item, LinkItem, StyledMenu, StyledMenuWrapper} from "./styled";

type MenuProps = {
    links: any[];
}

const Menu = ({ links }: MenuProps) => {
    const t = useTranslations();

    return (
        <StyledMenuWrapper>
            <StyledMenu>
                { links ? links.map((link, i) => <Item key={`menu-link-${i}`}>
                    <LinkItem href={link.linkSlug}>
                        {t(`search.${link.linkSlug}`)}
                    </LinkItem>
                </Item>) : <></> }
            </StyledMenu>
        </StyledMenuWrapper>

    )
}

export default Menu;