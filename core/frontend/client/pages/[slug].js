import React from "react";
import getConfig from 'next/config'
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";
import { withRouter } from 'next/router'
import axios from "axios";
//import PageSocketInterface from "../socketInterface/page";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const PageComponent = (props) => {
  return(
      <ViewPagesPreview {...props} />
  )
}

export async function getServerSideProps({ params }) {
  let pagelink = params.slug;
  if(params.slug && params.slug !== '/') {
    const parts = params.slug.split('/');
    pagelink = parts[parts.length - 1];
  }
  const payload = {
    api: 'pages',
    act: 'get',
    where: {
      pageLink: pagelink,
      istemplate: 0,
      publish: 1
    }
  };

  if(!pagelink.length) {
    payload.where = {
      is_default: 1,
      istemplate: 0,
      publish: 1
    }
  }

  const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload);
  console.log(response.data);
  return {
    props: {
      pageData: response.data || {},
    }
  }
}


export default withRouter(PageComponent)

