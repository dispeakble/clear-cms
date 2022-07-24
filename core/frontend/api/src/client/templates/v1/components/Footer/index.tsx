import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FooterWrapper, StyledNewsletterForm, StyledNewsletterTitle } from "./styled";

const Footer = () => {
  const t = useTranslations();

  return (<FooterWrapper>
    <div>
      <div>
        <Link href="/about-us">{t('footer.links.about-us')}</Link>
      </div>
      <div>
        <Link href="/contact">{t('footer.links.contact')}</Link>
      </div>
      <div>
        <Link href="/disclaimer">{t('footer.links.disclaimer')}</Link>
      </div>
    </div>
    <div>
      <div>
        <Link href="/useful-information">{t('footer.links.useful-information')}</Link>
      </div>
      <div>
        <Link href="/file-a-complaint">{t('footer.links.file-a-complaint')}</Link>
      </div>
      <div>
        <Link href="/working-hours">{t('footer.links.working-hours')}</Link>
      </div>
    </div>
    <div>
      <div>
        <StyledNewsletterTitle>{t('footer.subscribe-title')}</StyledNewsletterTitle>
      </div>
      <StyledNewsletterForm>
        <input type="email" placeholder={t('footer.email-address')} />
        <button>{t('footer.subscribe')}</button>
      </StyledNewsletterForm>
    </div>
  </FooterWrapper>);
}

export default Footer;