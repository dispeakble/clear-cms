import { BiChevronDown } from "react-icons/bi";
import { useRouter } from "next/router";
import Link from "next/link";
import { Container, LanguagesDropdown, SelectedLanguage } from "./styled";
import { NextRouter } from "next/dist/shared/lib/router/router";

const Languages = (props: { languages: any; }) => {

  const router: NextRouter = useRouter();
  const { languages } = props;


  return (
    <Container>
      <SelectedLanguage>{languages[router.locale as string]} <BiChevronDown /></SelectedLanguage>
      <LanguagesDropdown>
        {
            router.locales &&
                router.locales.map((locale, i) =>
                    <Link href={router.asPath} locale={locale} key={`language-link-${i}`}>
                      <a>
                        {languages[locale]}
                      </a>
                    </Link>
                )
        }
      </LanguagesDropdown>
    </Container>
  );
};

Languages.defaultProps = {
  languages: {
    "en": "ENG",
    "es": "ESP"
  }
};

export default Languages;