import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { isRegexpStringMatch } from "@docusaurus/theme-common";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/NavbarItem/NavbarNavLink";

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  ...props
}: Props): JSX.Element {
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternalLink = label && href && !isInternalUrl(href);

  // Link content is set through html XOR label
  const linkContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {
      children: (
        <>
          {label}
          {isExternalLink && (
            <IconExternalLink {...(isDropdownLink && { width: 12, height: 12 })} />
          )}
        </>
      ),
    };

  if (href && label === 'Login') {
    const userinfo = JSON.parse(localStorage.getItem('userinfo'));
    return (
      <>
        {
          userinfo?.uuid ? (<><img className="navbar-login-img teal-img" src={userinfo?.avatar ? userinfo.avatar : '/img/logo-header.png'} /></>) :
            (<Link href={prependBaseUrlToHref ? normalizedHref : href} {...props} {...linkContentProps} />)
        }
      </>
    );
  }

  if (href) {
    return (
      <><Link href={prependBaseUrlToHref ? normalizedHref : href} {...props} {...linkContentProps} /></>
    );
  }
  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl),
      })}
      {...props}
      {...linkContentProps}
    />
  );
}
