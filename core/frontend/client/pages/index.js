import {Helmet} from "react-helmet";
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";

export default function Home(props) {
  return (
    <>
     <Helmet
          title="Home"
          meta={[{ property: 'og:title', content: 'Next index page' }]}
        />

      <ViewPagesPreview {...props}  />
    </>
  )
}
