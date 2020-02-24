import React from 'react';

// Make React available globally for JSX…
(global as any).React = React;
// …and TSX.
declare global {
  const React: typeof import('react');
}
