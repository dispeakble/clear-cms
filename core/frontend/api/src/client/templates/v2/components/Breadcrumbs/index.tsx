import {useTranslations} from "next-intl";
import {StyledBreadcrumbLink, StyledBreadcrumbs} from "./styled";

const Breadcrumbs = () => {

    const t = useTranslations();

    return (<StyledBreadcrumbs>
        <StyledBreadcrumbLink href="#">{t('global.home')}</StyledBreadcrumbLink>
        <StyledBreadcrumbLink href="#">{t('global.search')}</StyledBreadcrumbLink>
    </StyledBreadcrumbs>)

};

export default Breadcrumbs;