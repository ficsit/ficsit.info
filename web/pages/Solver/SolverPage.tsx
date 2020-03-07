import { css } from '@emotion/core';

import { Section } from '~/components/Section'
import { sizing } from '~/style';

const rootStyles = css({
  padding: sizing.sectionPadding,
});

export function SolverPage() {
  return (
    <article css={rootStyles}>
      <Section title={<h1>Embetterer™</h1>}>
        <div>
          <h3>Production Targets</h3>
        </div>
      </Section>
    </article>
  )
}
