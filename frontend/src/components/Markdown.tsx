'use client';

import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

/** README-style renderer. rehype-sanitize strips scripts / event handlers (XSS safe), per the architecture doc. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ node: _n, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer nofollow" />,
        }}
      >
        {children || '*Nothing to preview yet.*'}
      </ReactMarkdown>
    </div>
  );
}
