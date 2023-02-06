import { useTranslations } from "next-intl";
import { StyledBreadcrumbLink, StyledBreadcrumbs } from "./styled";

const Breadcrumbs = (props: Record<string, any>) => {
  const t = useTranslations();

  return (
    <StyledBreadcrumbs>
      <StyledBreadcrumbLink href="/">{t("global.home")}</StyledBreadcrumbLink>
      {
        Object.keys(props).map(
          (key: string) => (<StyledBreadcrumbLink key={key} href={key}>{props[key]}</StyledBreadcrumbLink>)
        )
      }
    </StyledBreadcrumbs>
  );
};

export default Breadcrumbs;
