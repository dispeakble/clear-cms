import React from "react";
import getConfig from 'next/config'
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";
import { withRouter } from 'next/router'
import axios from "axios";
import PageSocketInterface from "../socketInterface/page";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const PageComponent = (props) => {
  return (
    publicRuntimeConfig?.wsEnabled ?
    (
      <PageSocketInterface slug={props.router.query.slug}>
        {() => {
          return(
            <ViewPagesPreview {...props} pageData={props.pageData} />
          )
        }}
      </PageSocketInterface>
    ) : (
      <ViewPagesPreview {...props} pageData={props.pageData} pageDataLoaded={true}/>
    )
    
  );
}

export let getStaticProps;
export let getStaticPaths;

if(!publicRuntimeConfig?.wsEnabled) {

  getStaticPaths = async () => {
    const payload = {
      api: 'pages',
      act: 'list',

    };
    // Call an external API endpoint to get posts
    const response = await axios.post(`${serverRuntimeConfig.serverUrl}/api`, payload)
    const pageListData = await response.data;

    console.log(response);


    // Get the paths we want to pre-render based on posts
    const paths = pageListData.map((page) => ({
      params: { slug: page.pageConfig.pageLink },
    }))

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }

  getStaticProps = async ({ params }) => {
    const payload = {
      api: 'pages',
      act: 'get',
      where: {
        pagelink: params.slug,
        istemplate: 0,
        publish: 1
      }
    };

    if(!params.slug || params.slug === '/') {
      payload.where = {
        is_default: 1,
        istemplate: 0,
        publish: 1
      }
    }

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

