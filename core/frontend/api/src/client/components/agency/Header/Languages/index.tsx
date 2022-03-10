import {BiChevronDown} from "react-icons/bi"
import {useRouter} from "next/router";
import Link from "next/link";
import {Container, SelectedLanguage, LanguagesDropdown} from './styled'

const Languages = (props: { languages: any; }) => {

    const router = useRouter()
    const {languages} = props


    return(
        <Container>
            <SelectedLanguage>{languages[router.locale]} <BiChevronDown /></SelectedLanguage>
            <LanguagesDropdown>
                {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    router.locales.map((locale) =>
                        <Link href={router.asPath} locale={locale}>
                            <a>
                                {languages[locale]}
                            </a>
                        </Link>
                    )
                }
            </LanguagesDropdown>
        </Container>
    )
}

Languages.defaultProps = {
    languages: {
        "en": "ENG",
        "es": "ESP"
    }
}

export default Languages