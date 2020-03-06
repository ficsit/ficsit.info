import { css } from '@emotion/core';

import { colors, sizing } from '~/style';

const borderSize = 2;

export interface SectionProps {
  children: React.ReactNode
  title?: React.ReactNode;
}

const rootStyles = css({
  padding: sizing.sectionPadding,
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
});

export function Section({ children, title, ...props }: SectionProps) {
  if (typeof title === 'string') title = <h2>{title}</h2>

  return (
    <section css={rootStyles} {...props}>
      <div css={headerStyles}>{title}</div>
      <div css={contentStyles}>{children}</div>
    </section>
  );
}
