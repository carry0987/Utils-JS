import Heading from '@theme/Heading';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Clear Runtime Boundaries',
        description: (
            <>
                Keep universal helpers in shared modules and move DOM-dependent logic to the dedicated browser
                entrypoint.
            </>
        ),
    },
    {
        title: 'Useful APIs, Small Surface',
        description: (
            <>
                Fetch wrappers, FormData helpers, equality checks, URL utilities, storage helpers, and event helpers are
                grouped by purpose instead of scattered through application code.
            </>
        ),
    },
    {
        title: 'Built for Real Integration',
        description: (
            <>
                The package supports direct imports, namespace imports, and explicit subpath entrypoints for modern
                bundlers and SSR applications.
            </>
        ),
    },
];

function Feature({ title, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className={styles.sectionHeading}>
                    <Heading as="h2">What the library covers</Heading>
                    <p>
                        Start with the root entrypoint, then opt into browser helpers only where the runtime allows it.
                    </p>
                </div>
                <div className="row">
                    {FeatureList.map((props) => (
                        <Feature key={props.title} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
