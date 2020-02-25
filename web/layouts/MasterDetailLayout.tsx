import { ReactNode } from 'react';

export interface MasterDetailLayoutProps {
  master: ReactNode;
  masterHeader: ReactNode;
  detail: ReactNode;
  detailHeader: ReactNode;
}

export const MasterDetailLayout = ({ master, masterHeader, detail, detailHeader }: MasterDetailLayoutProps) => {
  return (
    <React.Fragment>
      <main aria-labelledby="detail">
        <h2 id="detail">{detailHeader}</h2>
        {detail}
      </main>
      <nav aria-labelledby="master">
        <h2 id="master">{masterHeader}</h2>
        {master}
      </nav>
    </React.Fragment>
  );
}
