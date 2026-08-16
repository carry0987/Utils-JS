import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
    title: 'Utils-JS',
    tagline: 'A focused utility library for universal and browser-only JavaScript helpers',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://carry0987.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/Utils-JS/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'carry0987',
    projectName: 'Utils-JS',

    // The broken links detection is only available for a production build
    onBrokenLinks: 'throw',

    // Global markdown configuration
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn',
            onBrokenMarkdownImages: 'throw',
        },
    },

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            '@docusaurus/preset-classic',
            {
                sitemap: {
                    changefreq: 'weekly',
                    priority: 0.5,
                },
                docs: {
                    sidebarPath: './sidebars.ts',
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    editUrl: 'https://github.com/carry0987/Utils-JS/tree/gh-pages/',
                },
                blog: false,
                theme: {
                    customCss: './src/css/global.custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        navbar: {
            title: 'Utils-JS',
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    to: '/docs/browser-utilities',
                    label: 'Browser API',
                    position: 'left',
                },
                {
                    href: 'https://github.com/carry0987/Utils-JS',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'light',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Overview',
                            to: '/docs/intro',
                        },
                        {
                            label: 'Getting Started',
                            to: '/docs/getting-started',
                        },
                    ],
                },
                {
                    title: 'API',
                    items: [
                        {
                            label: 'Universal Utilities',
                            to: '/docs/universal-utilities',
                        },
                        {
                            label: 'Browser Utilities',
                            to: '/docs/browser-utilities',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/carry0987/Utils-JS',
                        },
                        {
                            label: 'npm',
                            href: 'https://www.npmjs.com/package/@carry0987/utils',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} carry0987. Built with Docusaurus.`,
        },
        colorMode: {
            defaultMode: 'light',
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        prism: {
            theme: prismThemes.oneDark,
            darkTheme: prismThemes.oneDark,
            additionalLanguages: ['tsx', 'css', 'json', 'bash'],
        },
        liveCodeBlock: {
            /**
             * The position of the live playground, above or under the editor
             * Possible values: "top" | "bottom"
             */
            playgroundPosition: 'bottom',
        },
    } satisfies Preset.ThemeConfig,
    themes: ['@docusaurus/theme-live-codeblock'],
};

export default config;
