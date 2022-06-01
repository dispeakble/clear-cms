import { useTranslations } from "next-intl";
import { StyledBreadcrumbLink, StyledBreadcrumbs } from "./styled";

const Breadcrumbs = (props: any) => {
  const t = useTranslations();

  return (<StyledBreadcrumbs>
    {/* TODO the commented code will be deleted in the next round */}
    <StyledBreadcrumbLink href="#">{t("global.home")}</StyledBreadcrumbLink>
    {
      Object.keys(props).map((key: any) => <StyledBreadcrumbLink href="#" key={key}>{props[key]}</StyledBreadcrumbLink>)
    }
  </StyledBreadcrumbs>);
};

export default Breadcrumbs;