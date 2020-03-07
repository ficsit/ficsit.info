import { css } from '@emotion/core';

import { Section } from '~/components/Section'
import { sizing, colors } from '~/style';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

const taglineStyles = css({
  fontSize: sizing.FontSize.Small,
  color: colors.Dark.N500,
});

export function SolverPage() {
  return (
    <article css={rootStyles}>
      <Section 
        title={
          <span>
            <h1>Embetterer™</h1>
            <span css={taglineStyles}>Embetter your production line with The Embetterer™!</span>
          </span>
        }
      >  
        <div>
          <h3>Production Targets</h3>
        </div>
      </Section>
    </article>
  )
}
