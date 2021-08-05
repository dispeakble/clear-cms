import React from "react";
import {Helmet} from "react-helmet";
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";
import { withRouter } from 'next/router'

const PageComponent = (props) => {
    debugger
    const slug = props.router.query.slug;
    return (
        <>
          <Helmet
            title={`Page by id`}
            meta={[{ property: 'og:title', content: 'Next index page' }]}
          />
          
         <ViewPagesPreview {...props} slug={slug} />
        </>
      );
}
  


// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }

// export async function getStaticProps({params}) {
//   const {slug} = params;
//   return {
//     props: {
//       slug
//     }
//   };
// }


export default withRouter(PageComponent)