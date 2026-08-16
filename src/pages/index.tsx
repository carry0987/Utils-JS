import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HeroCodeBlock from '@site/src/components/HeroCodeBlock';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className={clsx('container', styles.heroGrid)}>
                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>Universal where possible, browser-only where necessary.</p>
                    <Heading as="h1" className="hero__title">
                        {siteConfig.title}
                    </Heading>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className={styles.buttons}>
                        <Link className="button button--primary button--lg" to="/docs/getting-started">
                            Read the docs
                        </Link>
                        <Link className="button button--secondary button--lg" to="/docs/entrypoints">
                            Explore entrypoints
                        </Link>
                    </div>
                    <div className={styles.highlights}>
                        <span>SSR-safe root API</span>
                        <span>Browser-only helpers</span>
                        <span>Typed utility modules</span>
                    </div>
                </div>
                <div className={styles.heroPanel}>
                    <HeroCodeBlock />
                </div>
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={siteConfig.title}
            description="Documentation for Utils-JS, a utility library with explicit universal and browser entrypoints.">
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
}
