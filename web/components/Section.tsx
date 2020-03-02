import { css } from '@emotion/core';

import { colors, sizing } from '~/style';

export interface SectionProps {
  children: React.ReactNode
  title?: React.ReactNode;
}

const rootStyles = css({
  margin: sizing.Padding.Normal,
  '> h1, > h2, > h3, > h4, > h5, > h6': {
    margin: 0,
    fontWeight: 'lighter',
    textTransform: 'uppercase',
    lineHeight: '1.0',
    paddingBottom: sizing.Padding.Small,
  },
});

const headerStyles = css({
  fontSize: 24,
  paddingLeft: sizing.Padding.Normal,
  paddingRight: sizing.Padding.Normal,
});

const contentStyles = css({
  border: `2px solid ${colors.Light.N400}`,
  borderRadius: 16,
  padding: sizing.Padding.Normal,
  backgroundColor: colors.Light.N0,
});

export function Section({ children, title, ...props }: SectionProps) {
  if (typeof title === 'string') title = <h2 css={headerStyles}>{title}</h2>

  return (
    <section css={rootStyles} {...props}>
      {title}
      <div css={contentStyles}>{children}</div>
    </section>
  );
}
