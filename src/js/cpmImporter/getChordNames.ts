/**
 * Returns an array of all of the unique bracket chord names. So even if [D7] appears a
 * dozen times you'll only see it once in this list.
 * @param text CPM Text Block to be parsed
 */
export function getChordNames(text: string): string[] {
  const chordRegEx = /\[(.+?)]/img;
  const matches = text.match(chordRegEx);
  if (!matches) {
    return [];
  }

  return matches
    .reduce((acc: string[], name) => {
      if (!acc.includes(name)) {
        acc.push(name);
      }
      return acc;
    }, [])
    .map((name) => name.replace('[', '').replace(']', ''));
}

export default getChordNames;
