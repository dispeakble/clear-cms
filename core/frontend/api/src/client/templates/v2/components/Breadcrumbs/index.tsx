import { useTranslations } from "next-intl";
import { StyledBreadcrumbLink, StyledBreadcrumbs } from "./styled";

const Breadcrumbs = () => {
  const t = useTranslations();

  return (<StyledBreadcrumbs>
    <StyledBreadcrumbLink href="#">{t("breadcrumsb.home")}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{t("breadcrumsb.spain")}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{t("breadcrumsb.tenerife")}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{t("breadcrumsb.adeje")}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{t("breadcrumsb.hotel")}</StyledBreadcrumbLink>
  </StyledBreadcrumbs>);
};

export default Breadcrumbs;