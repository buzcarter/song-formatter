export const GuitarDefineChordsTests = [{
  name: 'Gm7b5 ',
  definition: '{define: Gm7b5 frets 0111 fingers 0211}',
  expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 150" width="100px" height="150px"><g id="fretboard" style="fill:none;stroke:#003366;stroke-width:1.6;"><line x1="42.8" y1="25.8" x2="42.8" y2="125.8"  /><line x1="62.8" y1="25.8" x2="62.8" y2="125.8"  /><line x1="22.8" y1="45.8" x2="82.8" y2="45.8"  /><line x1="22.8" y1="65.8" x2="82.8" y2="65.8"  /><line x1="22.8" y1="85.8" x2="82.8" y2="85.8"  /><line x1="22.8" y1="105.8" x2="82.8" y2="105.8"  /><rect x="22.8" y="25.8" width="60" height="100"  /></g><circle cx="42" cy="35" r="8" style="fill:#ff0000;" /><text x="42" y="40" style="fill:#ffffff;font:9pt Arial Black,Arial;text-anchor:middle;">2</text><circle cx="62" cy="35" r="8" style="fill:#ff0000;" /><text x="62" y="40" style="fill:#ffffff;font:9pt Arial Black,Arial;text-anchor:middle;">1</text><circle cx="82" cy="35" r="8" style="fill:#ff0000;" /><text x="82" y="40" style="fill:#ffffff;font:9pt Arial Black,Arial;text-anchor:middle;">1</text><text x="52" y="20" style="font:bold 14pt Arial;fill:#000000;text-anchor:middle;">Gm7b5</text></svg>',
}, {
  name: 'C-2pos',
  definition: '{define: C-2pos frets 9 7 8 7}',
  expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 150" width="100px" height="150px"><g id="fretboard" style="fill:none;stroke:#003366;stroke-width:1.6;"><line x1="42.8" y1="25.8" x2="42.8" y2="125.8"  /><line x1="62.8" y1="25.8" x2="62.8" y2="125.8"  /><line x1="22.8" y1="45.8" x2="82.8" y2="45.8"  /><line x1="22.8" y1="65.8" x2="82.8" y2="65.8"  /><line x1="22.8" y1="85.8" x2="82.8" y2="85.8"  /><line x1="22.8" y1="105.8" x2="82.8" y2="105.8"  /><rect x="22.8" y="25.8" width="60" height="100"  /></g><circle cx="22" cy="115" r="8" style="fill:#ff0000;" /><circle cx="42" cy="75" r="8" style="fill:#ff0000;" /><circle cx="62" cy="95" r="8" style="fill:#ff0000;" /><circle cx="82" cy="75" r="8" style="fill:#ff0000;" /><text x="0" y="82.6" style="font:bold 13pt Arial;fill:#4a4a4a;text-anchor:start;">7</text><text x="0" y="121" style="font:bold 13pt Arial;fill:#4a4a4a;text-anchor:start;">9</text><text x="52" y="20" style="font:bold 14pt Arial;fill:#000000;text-anchor:middle;">C-2pos</text></svg>',
}];

export const GuitarMutedStringsTests = [{
  name: 'D5',
  definition: '{define: D5 frets 2 2 X X fingers 1 1 2 2}',
  expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 150" width="100px" height="150px"><g id="fretboard" style="fill:none;stroke:#003366;stroke-width:1.6;"><line x1="42.8" y1="25.8" x2="42.8" y2="125.8"  /><line x1="62.8" y1="25.8" x2="62.8" y2="125.8"  /><line x1="22.8" y1="45.8" x2="82.8" y2="45.8"  /><line x1="22.8" y1="65.8" x2="82.8" y2="65.8"  /><line x1="22.8" y1="85.8" x2="82.8" y2="85.8"  /><line x1="22.8" y1="105.8" x2="82.8" y2="105.8"  /><rect x="22.8" y="25.8" width="60" height="100"  /></g><circle cx="22" cy="55" r="8" style="fill:#ff0000;" /><text x="22" y="60" style="fill:#ffffff;font:9pt Arial Black,Arial;text-anchor:middle;">1</text><circle cx="42" cy="55" r="8" style="fill:#ff0000;" /><text x="42" y="60" style="fill:#ffffff;font:9pt Arial Black,Arial;text-anchor:middle;">1</text><text x="52" y="20" style="font:bold 14pt Arial;fill:#000000;text-anchor:middle;">D5</text><g id="X" style="stroke:#444444;stroke-width:2.5600000000000005;"><line x1="58.3" y1="20.9" x2="67.3" y2="29.9"  /><line x1="58.3" y1="29.9" x2="67.3" y2="20.9"  /></g><g id="X" style="stroke:#444444;stroke-width:2.5600000000000005;"><line x1="78.3" y1="20.9" x2="87.3" y2="29.9"  /><line x1="78.3" y1="29.9" x2="87.3" y2="20.9"  /></g></svg>',
}, {
  name: 'F5',
  definition: '{define: F5 frets 5 5 X X fingers 1 1 2 2}',
  expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 150" width="100px" height="150px"><g id="fretboard" style="fill:none;stroke:#003366;stroke-width:1.6;"><line x1="42.8" y1="25.8" x2="42.8" y2="125.8"  /><line x1="62.8" y1="25.8" x2="62.8" y2="125.8"  /><line x1="22.8" y1="45.8" x2="82.8" y2="45.8"  /><line x1="22.8" y1="65.8" x2="82.8" y2="65.8"  /><line x1="22.8" y1="85.8" x2="82.8" y2="85.8"  /><line x1="22.8" y1="105.8" x2="82.8" y2="105.8"  /><rect x="22.8" y="25.8" width="60" height="100"  /></g><circle cx="22" cy="115" r="8" style="fill:#ff0000;" /><text x="22" y="120" style="fill:#ffffff;font:9pt Arial Black,Arial;text-anchor:middle;">1</text><circle cx="42" cy="115" r="8" style="fill:#ff0000;" /><text x="42" y="120" style="fill:#ffffff;font:9pt Arial Black,Arial;text-anchor:middle;">1</text><text x="52" y="20" style="font:bold 14pt Arial;fill:#000000;text-anchor:middle;">F5</text><g id="X" style="stroke:#444444;stroke-width:2.5600000000000005;"><line x1="58.3" y1="20.9" x2="67.3" y2="29.9"  /><line x1="58.3" y1="29.9" x2="67.3" y2="20.9"  /></g><g id="X" style="stroke:#444444;stroke-width:2.5600000000000005;"><line x1="78.3" y1="20.9" x2="87.3" y2="29.9"  /><line x1="78.3" y1="29.9" x2="87.3" y2="20.9"  /></g></svg>',
}];

export const GuitarPredfinedChordsTests = {
  G: '<svg></svg>',
  D: '<svg></svg>',
  Em: '<svg></svg>',
  C: '<svg></svg>',
  Em7: '<svg></svg>',
  B7: '<svg></svg>',
};
