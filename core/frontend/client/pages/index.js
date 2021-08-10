import getConfig from 'next/config'
import axios from "axios";
import Link from "next/link";
import { Helmet } from "react-helmet";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default function Home({ pageListData }) {
  return (
    <>
      <Helmet
        title="Home"
        meta={[{ property: 'og:title', content: 'Home Page' }]}
      />
      {
        pageListData && pageListData.map((elm, i) => {
          return <div key={elm.id}>
            <Link href={elm.pageConfig.pageLink} >{elm.pageConfig.pageTitle}</Link>
          </div>
        })
      }

    </>
  )
}


// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }


export async function getStaticProps({ params }) {
  const payload = {
    api: 'pages',
    act: 'list',

  };

  // fetch list of posts
  const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload)

  const pageListData = await response.data.data;
  return {
    props: {
      pageListData,
    },
  }
}
