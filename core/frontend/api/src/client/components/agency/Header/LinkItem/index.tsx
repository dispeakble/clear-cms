import styled from 'styled-components'

type Props = {
    linkText: string
    linkSlug: string
}

export default function(props: Props) {
    const {linkSlug, linkText} = props;

    return (
        <Item>
            <LinkItem href={linkSlug}>{linkText}</LinkItem>
        </Item>
    )
}

const Item = styled.li`
    padding: 4px 0px;
`

const LinkItem = styled.a`
  color:#fff;
  :hover {
    color: #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
  }
`