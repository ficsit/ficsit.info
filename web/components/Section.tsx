import { css } from '@emotion/core';

import { colors, sizing } from '~/style';

const borderSize = 2;

export interface SectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  allowOverflow?: boolean;
}

const rootStyles = css({
  padding: sizing.sectionPadding,
  [`@media(max-width: ${sizing.minContentWidth}px)`]: {
    paddingLeft: 0,
    paddingRight: 0,
    margin: `0 -${sizing.sectionPadding}px`,
  },
});

const headerStyles = css({
  paddingLeft: sizing.Padding.Normal,
  paddingRight: sizing.Padding.Normal,
  paddingBottom: '0.25em',
});

const contentStyles = css({
  border: `${borderSize}px solid ${colors.Light.N400}`,
  borderRadius: 16,
  padding: sizing.Padding.Normal,
  backgroundColor: colors.Light.N0,
  overflow: 'auto',
  [`@media(max-width: ${sizing.minContentWidth}px)`]: {
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: 0,
  },
});

const allowContentOverflow = css({
  overflow: 'visible !important',
});

export function Section({
  children,
  title,
  allowOverflow,
  ...props
}: SectionProps) {
  if (typeof title === 'string') title = <h2>{title}</h2>;

  const contentCss = [contentStyles];
  if (allowOverflow) {
    contentCss.push(allowContentOverflow);
  }

  return (
    <section css={rootStyles} {...props}>
      <div css={headerStyles}>{title}</div>
      <div css={contentCss}>{children}</div>
    </section>
  );
}
