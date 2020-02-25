import { useParams } from 'react-router';

export function Item() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <React.Fragment>
      <h1>Item: {slug}</h1>
      <img src="/assets/images/7FZhKTi5u84wIYYIMecKwW7FzGzUP1dKekO0yqWwmoI8.256.png" />
    </React.Fragment>
  );
}
