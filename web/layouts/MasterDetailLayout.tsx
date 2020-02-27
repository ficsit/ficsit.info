import { ReactNode } from 'react';
import { css } from '@emotion/core';

const containerStyles = css({
  display: 'flex',
  flex: 1,
  '@media (max-width: 600px)': {
    display: 'block',
  },
});

const masterStyles = css({
  display: 'flex',
  order: 1,
  overflow: 'auto',
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
