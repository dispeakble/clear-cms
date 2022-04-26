import React, { useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { NextRouter } from "next/dist/shared/lib/router/router";
import { NextIntlProvider } from "next-intl";


interface WithRouterProps {
  router: NextRouter;
}

interface ComponentProps extends WithRouterProps {
  version: string;
  settings: Record<string, string>;
}

const templates: any = {
  v1: dynamic(() => import("../templates/v1/404")),
  v2: dynamic(() => import("../templates/v2/404"))
};

type settingsResponse = {
  websiteName: string
  applicationVersion: string
  selectedTheme: string
  colorScheme: Record<string, any>
}

const PageComponent: NextPage<ComponentProps> = () => {

  const router = useRouter();

  const [settings, setSettings] = useState<settingsResponse>({
    websiteName: "",
    applicationVersion: "",
    selectedTheme: "v1",
    colorScheme: {}
  });

  const [translations, setTranslations] = useState();

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/agency/getSettings");
      const data = await response.json();

      Object.keys(data["colorScheme"]).map(color => {
        if ("string" === typeof data["colorScheme"][color].value) {
          data["colorScheme"][color] = data["colorScheme"][color].value;
        } else {
          const { r, g, b } = data["colorScheme"][color].value;
          data["colorScheme"][color] = `${r}, ${g}, ${b}`;
        }
      });

      setSettings(data);

      const language_response = await fetch("/api/agency/getTranslations", {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
          language: router.locale
        })
      });
      const language_data = await language_response.json();
      setTranslations(language_data);
    })();

  }, []);

  if (!settings.websiteName.length) {
    return <></>;
  }

  const Component = templates[settings.selectedTheme];

  return (
    settings && translations ? <>
      <NextIntlProvider messages={translations}>
        <Component {...settings} />
      </NextIntlProvider>
    </> : <></>
  );
};

export default withRouter(PageComponent);