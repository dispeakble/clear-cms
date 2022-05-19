import { useTranslations } from "next-intl";
import { StyledBreadcrumbLink, StyledBreadcrumbs } from "./styled";

const Breadcrumbs = (props: any) => {
  const t = useTranslations();

  return (<StyledBreadcrumbs>
    {/* TODO the commented code will be deleted in the next round */}
    {/*<StyledBreadcrumbLink href="#">{t("global.home")}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Spain</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Tenerife</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Adeje</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">Hotel Victoria (Hotel)</StyledBreadcrumbLink>*/}
    <StyledBreadcrumbLink href="#">{t("global.home")}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{props.countryName}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{props.islandName}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{props.townName}</StyledBreadcrumbLink>
    <StyledBreadcrumbLink href="#">{props.hotelName}</StyledBreadcrumbLink>
  </StyledBreadcrumbs>);
};

export default Breadcrumbs;