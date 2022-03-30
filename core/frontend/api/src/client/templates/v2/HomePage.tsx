import * as React from "react";
import {useTranslations} from "next-intl";

const HomePage = () => {
    const t = useTranslations();
    return <div>v2 {t('global.home')}</div>;
}

export default HomePage;