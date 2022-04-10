import styled from 'styled-components'
import {useTranslations} from "next-intl";

type Props = {
    linkText: string
    linkSlug: string
}

export default function(props: Props) {
    const {linkSlug} = props;
    const t = useTranslations('global')

    return (
        <Item>
            <LinkItem href={linkSlug}>
                {t(`${linkSlug}`)}
            </LinkItem>
        </Item>
    )
}

const Item = styled.li`
    padding: 4px 0;
`

const LinkItem = styled.a`
  color:#fff;
  :hover {
    color: #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
  }
`