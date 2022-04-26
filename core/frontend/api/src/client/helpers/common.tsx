import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppContextProvider } from "../context/AppContext";
import { NextIntlProvider } from "next-intl";

type settingsResponse = {
  websiteName: string
  applicationVersion: string
  selectedTheme: string
  colorScheme: Record<string, any>
  translations: Record<string, any>
}

export const CommonHelper = ({ templates }: any) => {

  const router = useRouter();

  const [settings, setSettings] = useState<settingsResponse>({
    websiteName: "",
    applicationVersion: "",
    selectedTheme: "v1",
    colorScheme: {},
    translations: {}
  });

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

      setSettings(prevState => ({ ...prevState, ...data }));

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
      setSettings(prevState => ({ ...prevState, translations: language_data }));
    })();

  }, []);

  if(!Object.keys(settings.translations).length) {
    return <></>
  }

  const Component = templates[settings.selectedTheme];

  return <>
    {settings && settings.translations ? <AppContextProvider settings={settings}>
      <NextIntlProvider messages={settings.translations}>
        <Component {...settings} />
      </NextIntlProvider>
    </AppContextProvider> : <></>}
  </>;


};