import { css } from '@emotion/core';
import { Indexable } from '@local/schema';

import { colors } from '../style';
import { memoize } from '../utility';

import { EntityImage } from './EntityImage';

const borderSize = 2;
const basePadding = 16;
const insetAmount = 0.625;

const getHeaderStyles = memoize((imageSize: number) => css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  margin: 0,
  fontSize: 36,
  fontWeight: 'lighter',
  textTransform: 'uppercase',
  lineHeight: '1.0',
  paddingLeft: imageSize + basePadding * 2 + borderSize,
  paddingBottom: basePadding,
  minHeight: (imageSize * insetAmount) - basePadding,
}));

const getSummaryStyles = memoize((imageSize: number) => css({
  display: 'flex',
  border: `${borderSize}px solid ${colors.Light.N400}`,
  borderRadius: 16,
  padding: basePadding,
  backgroundColor: colors.Light.N0,
  'p': {
    margin: 0,
    flex: 1,
  },
  'picture': {
    marginTop: -(imageSize * insetAmount),
    marginRight: basePadding,
    filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))',
  },
}));

export interface EntityWithDescription extends Indexable {
  description: string;
}

export interface EntitySummaryParams {
  entity: EntityWithDescription;
  imageSize: number;
}

export function EntitySummary({ entity, imageSize }: EntitySummaryParams) {
  const headerStyles = getHeaderStyles(imageSize);
  const summaryStyles = getSummaryStyles(imageSize);
  
  return (
    <React.Fragment>
      <h2 css={headerStyles}>{entity.name}</h2>
      <main>
        <div css={summaryStyles}>
          <EntityImage entity={entity} size={imageSize} />
          <p>{entity.description}</p>
        </div>
      </main>
    </React.Fragment>
  );
}
