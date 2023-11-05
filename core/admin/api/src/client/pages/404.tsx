import React from 'react';
import { withRouter } from 'next/router';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { NextRouter } from 'next/dist/shared/lib/router/router';
import { CommonHelper } from '../helpers/common';

interface WithRouterProps {
  router: NextRouter;
}

interface ComponentProps extends WithRouterProps {
  version: string;
  settings: Record<string, string>;
}

const templates: any = {
  v1: dynamic(() => import('../templates/v1/404')),
};

const PageComponent: NextPage<ComponentProps> = () => {
  return <CommonHelper templates={templates} />;
};

export default withRouter(PageComponent);
