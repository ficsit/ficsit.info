import { SolverConstraint, ItemRate, SolverConstraintSubjectKind, SolverConstraintType } from './solve';
import { css } from '@emotion/core';
import { sizing, colors } from '~/style';
import { EntityAndRateChooser } from '~/components/EntityAndRateChooser';

const constraintStyles = css({
  paddingTop: sizing.Padding.Medium,
  select: {
    border: 'none',
    paddingLeft: 6,
    color: colors.Dark.N500,
  },
});

export interface ConstraintsChooserProps {
  constraints: SolverConstraint[];
  setConstraints: (newConstraints: SolverConstraint[]) => void;
}

export function ConstraintsChooser(props: ConstraintsChooserProps) {
  const numConstraints = props.constraints.length;

  return (
    <div>
      <h3>Optimize</h3>
      <div>
        {props.constraints.map((_constraint, index) => (
          <Constraint key={index} {...props} index={index} />
        ))}
        <Constraint {...props} index={numConstraints} />
      </div>
    </div>
  );
}

interface ConstraintProps extends ConstraintsChooserProps {
  index: number;
}

function Constraint({ constraints, setConstraints, index }: ConstraintProps) {
  const constraint = constraints[index] as SolverConstraint | undefined;
  let target: ItemRate | undefined;
  if (constraint) {
    target = { slug: constraint.subject.slug, perMinute: constraint.value };
  }

  const selectRef = React.createRef<HTMLSelectElement>();

  return (
    <div css={constraintStyles}>
      <select
        ref={selectRef}
        value={constraint?.type}
        onChange={event => {
          const newConstraints = [...constraints];
          newConstraints[index] = {
            ...constraint,
            type: event.target.value,
          } as SolverConstraint;
          setConstraints(newConstraints);
        }}
      >
        <option value={SolverConstraintType.Limit}>Limit Resource:</option>
        <option value={SolverConstraintType.Minimize}>Minimize Resource:</option>
      </select>
      <EntityAndRateChooser
        target={target}
        hideRate={constraint?.type === SolverConstraintType.Minimize}
        setTarget={newTarget => {
          if (!newTarget) {
            setConstraints(constraints.filter((_c, i) => i !== index));
          } else {
            const newConstraints = [...constraints];
            newConstraints[index] = {
              type: selectRef.current?.value,
              ...constraints[index],
              subject: {
                kind: SolverConstraintSubjectKind.Resource,
                slug: newTarget.slug,
              },
              value: newTarget.perMinute,
            } as SolverConstraint;
            setConstraints(newConstraints);
          }
        }}
      />
    </div>
  );
}
