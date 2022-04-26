import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { withRouter } from "next/router";
import { NextPage } from "next";
import { Helmet } from "react-helmet-async";
import dynamic from "next/dynamic";
import { NextRouter } from "next/dist/shared/lib/router/router";

interface WithRouterProps {
  router: NextRouter;
}

interface ComponentProps extends WithRouterProps {
  version: string;
  settings: Record<string, string>;
}

const templates: any = {
  v1: dynamic(() => import("../templates/v1/300")),
  v2: dynamic(() => import("../templates/v2/300"))
};

const PageComponent: NextPage<ComponentProps> = () => {

  const [ settings, setSettings ] = useState({
    websiteName: "404",
    version: 'v1'
  });

  const t = useTranslations();

  const Component = templates[settings.version];

  return (
    <>
      <Helmet>
        <title>{t("hotels.seo.pageTitle", { websiteName: settings.websiteName })}</title>

      </Helmet>

      <Component {...settings} />
    </>
  );
};

export default withRouter(PageComponent);