import { ReactNode } from 'react';
import { css } from '@emotion/core';

import { colors, sizing } from '../style';

const breakpoint = sizing.sidebarWidth + sizing.minContentWidth;

const containerStyles = css({
  display: 'flex',
  flex: 1,
  height: '100%',
  [`@media (max-width: ${breakpoint}px)`]: {
    'main + nav': {
      display: 'none',
    },
  },
});

const masterStyles = css({
  display: 'flex',
  order: 1,
  overflow: 'auto',
  borderRight: `1px solid ${colors.Light.N400}`,
  backgroundColor: colors.Light.N100,
  width: sizing.sidebarWidth,
  [`@media (max-width: ${breakpoint}px)`]: {
    width: '100%',
  },
});

const detailStyles = css({
  order: 2,
  overflow: 'auto',
  flex: 1,
});

export interface MasterDetailLayoutProps {
  master: ReactNode;
  detail?: ReactNode;
}
export const MasterDetailLayout = ({ master, detail }: MasterDetailLayoutProps) => {
  return (
    <div css={containerStyles}>
      {!!detail && 
        <main css={detailStyles}>{detail}</main>
      }
      <nav css={masterStyles}>{master}</nav>
    </div>
  );
}
