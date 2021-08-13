import React from "react";
import getConfig from 'next/config'
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";
import { withRouter } from 'next/router'
import axios from "axios";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const PageComponent = (props) => {
  return (
    <ViewPagesPreview {...props} pageData={props.pageData} />
  );
}



// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: "blocking",
//   };
// }

// This function gets called at build time

export let getStaticPaths;
export let getStaticProps;

if(process?.env?.ONLY_STATIC) {

  getStaticPaths = async function getStaticPaths() {
    const payload = {
      api: 'pages',
      act: 'list',

    };
    // Call an external API endpoint to get posts
    const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload)
    const pageListData = await response.data.data;

    // Get the paths we want to pre-render based on posts
    const paths = pageListData.map((page) => ({
      params: { slug: page.pageConfig.pageLink },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }


  getStaticProps = async function getStaticProps({ params }) {
    const payload = {
      api: 'pages',
      act: 'get',
      where: {
        pagelink: params.slug
      },

    };

    // fetch list of posts
    const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload)
    const pageData = await response.data.data;
    return {
      props: {
        pageData,
      },
      revalidate: 60,
    }
  }
}

export default withRouter(PageComponent)