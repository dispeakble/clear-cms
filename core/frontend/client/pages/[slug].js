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



export async function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}


export async function getStaticProps({ params }) {
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
  }
}

export default withRouter(PageComponent)