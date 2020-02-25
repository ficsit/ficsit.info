import { ReactNode } from 'react';

export const DefaultLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <React.Fragment>
      <style>{`#initialization-error { display: none !important; }`}</style>
      <header>
        <nav>Ficsit Employee Intranet Portal</nav>
      </header>
      <main>
        {children}
      </main>
    </React.Fragment>
  );
}
