import React from 'react';
import { NextPage } from 'next';
import PageContent from "./PageContent";

import { withRouter } from 'next/router';


const PageComponent: NextPage = (props ) => {
  return PageContent.renderContent(props);
};

export async function getServerSideProps(context: any) {
    return PageContent.getServerSideProps(context);
}

export default withRouter(PageComponent);