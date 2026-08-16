import type { Props } from '@theme/CodeBlock';
import CodeBlock from '@theme-original/CodeBlock';
import type { ReactNode } from 'react';

export default function CodeBlockWithLineNumbers(props: Props): ReactNode {
    return <CodeBlock {...props} showLineNumbers={props.showLineNumbers ?? true} />;
}
