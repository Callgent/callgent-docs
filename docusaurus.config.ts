import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import "dotenv/config";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "Botlet.IO",
  tagline: "Break the silos between Users & Systems<br/> User-as-a-Service v.v., Service-as-a-User",
  favicon: "img/favicon.ico",

  customFields: {
    homeTitle: "botlet",
    homeDescription: "docsbotlet",
    signupUrl: process.env.SITE_SIGNUP_URL,
    apiSiteUrl: process.env.API_SITE_URL,
    cookieDomain: process.env.SITE_URL_DOMAIN,
  },

  // Set the production url of your site here
  url: process.env.SITE_URL_DOCUMENTATION_URL,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.SITE_BASE_PATH,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "botlet-io", // Usually your GitHub org/user name.
  projectName: "botlet-doc", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
  },

  plugins: [],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/Botlet-IO/botlet-docs/edit/blog/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/Botlet-IO/botlet-docs/edit/blog/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: process.env.GOOGLE_GTAG,
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Botlet",
      logo: {
        alt: "Botlet Logo",
        src: "img/logo.svg",
        srcDark: 'img/logo_dark.svg',
        href: process.env.SITE_URL,
        target: "_self",
      },
      items: [
        { to: process.env.SITE_URL, target: "_self", label: "Home" },
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          label: "Tutorials",
        },
        { label: "Developers", to: '/docs/developers/guide' },
        { to: "/blog", label: "Blog", position: "left" },
        { type: "localeDropdown", position: "right" },
        {
          href: "https://github.com/Botlet-IO/botlet-docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
            {
              label: "Developers",
              to: "/docs/developers/guide",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/botlet",
            },
            {
              label: "Discord",
              href: "https://discord.com/invite/V9HKBukSRp",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/BotletIO",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/Botlet-IO/botlet-docs",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Botlet.IO. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_APP_INDEX,
    }
  } satisfies Preset.ThemeConfig,
};

export default config;
