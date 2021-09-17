import React from 'react';
import { NextPage } from 'next';
import ViewPagesPreview from "templates/ViewPages/ViewPagesPreview";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props) => {
  return(
      <ViewPagesPreview {...props} />
  )
};

export async function getStaticPaths() {
  const paths = [];

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {

  return {
    props: {
      pageData: {pageConfig: {
          pageTitle: "fdrtyujhgfdfgthj",
          pageLink: "test",
          fontSize: "11px",
          fontFamily: "Arial",
          textColor: "#000",
        }}
    },
    revalidate: 10
  }

}

export default withRouter(PageComponent);