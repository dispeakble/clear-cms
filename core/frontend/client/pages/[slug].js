import React from "react";
import getConfig from 'next/config'
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";
import { withRouter } from 'next/router'
import axios from "axios";
//import PageSocketInterface from "../socketInterface/page";
const Redis = require("ioredis");
const redis = new Redis({
  family: 4, // 4 (IPv4) or 6 (IPv6)
  db: 0,
  url: 'redis://' + process.env.redis_server,
  port: +process.env.redis_port,
  password: process.env.redis_password,
  retryAttempts: 20,
  retryDelay: 3000
});

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const PageComponent = (props) => {
  return(
      <ViewPagesPreview {...props} />
  )
}

export async function getStaticPaths() {
  /*const payload = {
    api: 'pages',
    act: 'list',
    where: {
      istemplate: 0,
      publish: 1
    },
    limit: [0,1000]
  };

  const pages = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload);
  const paths = pages.map((page) => ({
    params: { links: page.pageLink }
  }))*/

  const paths = [];

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  let pageLink = params.slug;
  if(params.slug && params.slug !== '/') {
    const parts = params.slug.split('/');
    pageLink = parts[parts.length - 1];
  }
  const payload = {
    api: 'pages',
    act: 'get',
    where: {
      pageLink: pageLink,
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
  //console.log(response.data);
  return {
    props: {
      pageData: response.data || {}
    },
    revalidate: 10,
    fallback: "blocking"
  }
}


export default withRouter(PageComponent)

