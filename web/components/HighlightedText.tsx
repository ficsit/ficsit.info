export interface HighlightedTextProps {
  text: string;
  search?: string;
}

export function HighlightedText({ text, search }: HighlightedTextProps) {
  if (!search || !search.length) return <React.Fragment>{text}</React.Fragment>;
  const cleanText = text.replace(/ /g, '\u00a0');
  const searchText = text.toLowerCase();
  const characters = search.toLowerCase().split('');

  const parts = [] as React.ReactNode[];
  let start = 0;
  for (const character of characters) {
    const index = searchText.indexOf(character, start);
    parts.push(cleanText.slice(start, index));
    parts.push(<strong key={index}>{cleanText.slice(index, index + 1)}</strong>);
    start = index + 1;
  }
  parts.push(cleanText.slice(start));

  return <React.Fragment>{parts}</React.Fragment>;
}
