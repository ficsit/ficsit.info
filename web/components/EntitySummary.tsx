import { css } from '@emotion/core';
import { Entity } from '@local/schema';

import { colors, sizing } from '../style';
import { memoize } from '../utility';

import { EntityImage } from './EntityImage';
import { Section } from './Section';

const basePadding = sizing.Padding.Normal;
const insetAmount = 0.625;

const getHeaderStyles = memoize((imageSize: number) => css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  paddingLeft: imageSize + basePadding,
  minHeight: (imageSize * insetAmount) - basePadding - sizing.sectionPadding * 2,
}));

const summaryStyles = css({
  display: 'flex',
});

const getEntityImageStyles = memoize((imageSize: number) => css({
  marginTop: -(imageSize * insetAmount),
  marginRight: basePadding,
  filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))',
}));

const descriptionStyles = css({
  margin: 0,
  flex: 1,
});

const statisticsStyles = css({
  'dl': {
    display: 'inline-block',
    margin: 0,
    marginTop: basePadding / 2,
    padding: `0 ${basePadding}px`,
    fontSize: 14,
    
    borderRight: `1px solid ${colors.Light.N400}`,
    '&:first-of-type': {
      paddingLeft: 0,
    },
    '&:last-of-type': {
      paddingRight: 0,
      borderRight: 'none',
    },
    'dt': {
      color: colors.Dark.N500,
      marginBottom: 4,
    },
    'dd': {
      margin: 0,
    },
  },
});

export interface EntityWithDescription extends Entity {
  description?: string;
}

export interface EntitySummaryParams {
  entity: EntityWithDescription;
  imageSize: number;
  description?: React.ReactNode;
  statistics?: Record<string, React.ReactNode>;
}

export function EntitySummary({ entity, imageSize, description, statistics, ...props }: EntitySummaryParams) {
  const headerStyles = getHeaderStyles(imageSize);
  const entityImageStyles = getEntityImageStyles(imageSize);

  return (
    <Section title={<h1 css={headerStyles}>{entity.name}</h1>} {...props}>
      <div css={summaryStyles}>
        <EntityImage entity={entity} size={imageSize} css={entityImageStyles} />
        <p css={descriptionStyles}>{description || entity.description}</p>
      </div>
      {!!statistics && 
        <div css={statisticsStyles}>
          {Object.entries(statistics).map(([title, content], index) =>
            <dl key={index}>
              <dt>{title}</dt>
              <dd>{content}</dd>
            </dl>
          )}
        </div>
      }
    </Section>
  );
}
