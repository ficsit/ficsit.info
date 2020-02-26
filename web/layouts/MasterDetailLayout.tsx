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
  masterHeader: ReactNode;
  detail: ReactNode;
  detailHeader: ReactNode;
}
export const MasterDetailLayout = ({ master, masterHeader, detail, detailHeader }: MasterDetailLayoutProps) => {
  return (
    <div css={containerStyles}>
      <main aria-labelledby='detail' css={detailStyles}>
        <h2 id='detail'>{detailHeader}</h2>
        {detail}
      </main>
      <nav aria-labelledby='master' css={masterStyles}>
        <h2 id='master'>{masterHeader}</h2>
        {master}
      </nav>
    </div>
  );
}
