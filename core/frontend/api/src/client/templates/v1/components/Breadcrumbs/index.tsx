import { useTranslations } from "next-intl";
import { StyledBreadcrumbLink, StyledBreadcrumbs } from "./styled";

const Breadcrumbs = (props: any) => {
  const t = useTranslations();

  return (<StyledBreadcrumbs>
    <StyledBreadcrumbLink href="#">{t("global.home")}</StyledBreadcrumbLink>
    {
      Object.keys(props).map((key: any) => <StyledBreadcrumbLink key={key} href="#">{props[key]}</StyledBreadcrumbLink>)
    }
  </StyledBreadcrumbs>);
};

export default Breadcrumbs;