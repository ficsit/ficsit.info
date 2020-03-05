import { ReactNode } from 'react';
import { css } from '@emotion/core';

import { colors } from '../style';

const containerStyles = css({
  display: 'flex',
  flex: 1,
  height: '100%',
  '@media (max-width: 600px)': {
    display: 'block',
  },
});

const masterStyles = css({
  display: 'flex',
  order: 1,
  overflow: 'auto',
  borderRight: `1px solid ${colors.Light.N400}`,
  backgroundColor: colors.Light.N100,
});

const detailStyles = css({
  order: 2,
  overflow: 'auto',
  flex: 1,
});

export interface MasterDetailLayoutProps {
  master: ReactNode;
  detail: ReactNode;
}
export const MasterDetailLayout = ({ master, detail }: MasterDetailLayoutProps) => {
  return (
    <div css={containerStyles}>
      <main css={detailStyles}>
        {detail}
      </main>
      <nav css={masterStyles}>
        {master}
      </nav>
    </div>
  );
}
