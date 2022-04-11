import { useTranslations } from "next-intl";
import { StyledBreadcrumbLink, StyledBreadcrumbs } from "./styled";

const Breadcrumbs = () => {
  const t = useTranslations();

  return (<StyledBreadcrumbs>
    <StyledBreadcrumbLink href="#">{t("global.home")}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Spain</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Tenerife</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Adeje</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Hotel Victoria (Hotel)</StyledBreadcrumbLink>
  </StyledBreadcrumbs>);
};

export default Breadcrumbs;