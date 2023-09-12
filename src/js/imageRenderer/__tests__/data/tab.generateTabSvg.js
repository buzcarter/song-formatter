const Tests = [{
  name: 'Leading String Names & Measures, input: string',
  tuning: ['G', 'C', 'E', 'A'],
  hasLabels: true,
  tabs: [
    ['A', '|', '-', '-', '-', '-', '-', '2', '-', '-', '-', '2', '-', '-', '-', '|', '-', '-', '-', '-', '-', '3', '-', '3'],
    ['E', '|', '-', '-', '-', '3', '-', '-', '-', '3', '-', '-', '-', '3', '-', '|', '-', '-', '-', '0', '-', '-', '-', '-'],
    ['C', '|', '-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|', '-', '0', '-', '-', '-', '-', '-', '-'],
    ['G', '|', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|', '-', '-', '-', '-', '-', '-', '-', '-'],
  ],
  expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 358 78" width="358px" height="78px">'
  + '<g id="staff" style="stroke:#999999;stroke-width:1;">'
  + '<line x1="22.5" y1="11.5" x2="380.5" y2="11.5"  />'
  + '<line x1="22.5" y1="27.5" x2="380.5" y2="27.5"  />'
  + '<line x1="22.5" y1="43.5" x2="380.5" y2="43.5"  />'
  + '<line x1="22.5" y1="59.5" x2="380.5" y2="59.5"  />'
  + '</g>'
  + '<line x1="36.5" y1="11" x2="36.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<circle cx="120" cy="11" r="10" style="fill:#eaeaea;" />'
  + '<text x="120" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
  + '<circle cx="176" cy="11" r="10" style="fill:#eaeaea;" />'
  + '<text x="176" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
  + '<line x1="232.5" y1="11" x2="232.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<circle cx="316" cy="11" r="10" style="fill:#eaeaea;" />'
  + '<text x="316" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
  + '<circle cx="344" cy="11" r="10" style="fill:#eaeaea;" />'
  + '<text x="344" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
  + '<line x1="36.5" y1="11" x2="36.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<circle cx="92" cy="27" r="10" style="fill:#eaeaea;" />'
  + '<text x="92" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
  + '<circle cx="148" cy="27" r="10" style="fill:#eaeaea;" />'
  + '<text x="148" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
  + '<circle cx="204" cy="27" r="10" style="fill:#eaeaea;" />'
  + '<text x="204" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
  + '<line x1="232.5" y1="11" x2="232.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<circle cx="288" cy="27" r="10" style="fill:#eaeaea;" />'
  + '<text x="288" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">0</text>'
  + '<line x1="36.5" y1="11" x2="36.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<circle cx="64" cy="43" r="10" style="fill:#eaeaea;" />'
  + '<text x="64" y="48" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
  + '<line x1="232.5" y1="11" x2="232.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<circle cx="260" cy="43" r="10" style="fill:#eaeaea;" />'
  + '<text x="260" y="48" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">0</text>'
  + '<line x1="36.5" y1="11" x2="36.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<line x1="232.5" y1="11" x2="232.5" y2="59" style="stroke:#999999;stroke-width:1;" />'
  + '<text x="1" y="15.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">A</text>'
  + '<text x="1" y="31.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">E</text>'
  + '<text x="1" y="47.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">C</text>'
  + '<text x="1" y="63.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">G</text>'
  + '</svg>',
}, {
  skip: false,
  name: 'Basic, input: string[]',
  tuning: ['G', 'C', 'E', 'A'],
  hasLabels: false,
  tabs: [
    ['-', '-', '-', '-', '-', '2', '-', '-', '-', '2', '-', '-', '-', '-', '-', '-', '-', '3', '-', '3'],
    ['-', '-', '-', '3', '-', '-', '-', '3', '-', '-', '-', '3', '-', '-', '-', '0', '-', '-', '-', '-'],
    ['-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '0', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
  ],
  expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 290 78" width="290px" height="78px">'
    + '<g id="staff" style="stroke:#999999;stroke-width:1;">'
    + '<line x1="10.5" y1="11.5" x2="300.5" y2="11.5"  />'
    + '<line x1="10.5" y1="27.5" x2="300.5" y2="27.5"  />'
    + '<line x1="10.5" y1="43.5" x2="300.5" y2="43.5"  />'
    + '<line x1="10.5" y1="59.5" x2="300.5" y2="59.5"  />'
    + '</g>'
    + '<circle cx="80" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="80" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
    + '<circle cx="136" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="136" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
    + '<circle cx="248" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="248" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
    + '<circle cx="276" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="276" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
    + '<circle cx="52" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="52" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
    + '<circle cx="108" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="108" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
    + '<circle cx="164" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="164" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">3</text>'
    + '<circle cx="220" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="220" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">0</text>'
    + '<circle cx="24" cy="43" r="10" style="fill:#eaeaea;" />'
    + '<text x="24" y="48" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
    + '<circle cx="192" cy="43" r="10" style="fill:#eaeaea;" />'
    + '<text x="192" y="48" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">0</text>'
    + '</svg>',
}, {
  skip: false,
  name: 'Guitar',
  tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
  hasLabels: true,
  tabs: [
    ['-', '12', '-', '10', '-', '9', '-', '-', '-', '-', '-', '-', '-', '9', '-', '10', '-', '9', '-', '-', '-', '-', '-', '-', '-', '9', '-', '-', '-', '9', '-', '-', '-', '-', '-', '|'],
    ['-', '-', '-', '-', '-', '-', '-', '66', '-', '10', '-', '12', '-', '-', '-', '-', '-', '-', '-', '18', '-', '10', '-', '12', '-', '-', '-', '33', '-', '-', '-', '12', '-', '10', '-', '|'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '5', '-', '2', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '|'],
  ],
  expectedResult: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 526 110" width="526px" height="110px">'
    + '<g id="staff" style="stroke:#999999;stroke-width:1;">'
    + '<line x1="22.5" y1="11.5" x2="524.5" y2="11.5"  />'
    + '<line x1="22.5" y1="27.5" x2="524.5" y2="27.5"  />'
    + '<line x1="22.5" y1="43.5" x2="524.5" y2="43.5"  />'
    + '<line x1="22.5" y1="59.5" x2="524.5" y2="59.5"  />'
    + '<line x1="22.5" y1="75.5" x2="524.5" y2="75.5"  />'
    + '<line x1="22.5" y1="91.5" x2="524.5" y2="91.5"  />'
    + '</g>'
    + '<circle cx="36" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="36" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">12</text>'
    + '<circle cx="64" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="64" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">10</text>'
    + '<circle cx="92" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="92" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">9</text>'
    + '<circle cx="204" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="204" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">9</text>'
    + '<circle cx="232" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="232" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">10</text>'
    + '<circle cx="260" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="260" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">9</text>'
    + '<circle cx="372" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="372" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">9</text>'
    + '<circle cx="428" cy="11" r="10" style="fill:#eaeaea;" />'
    + '<text x="428" y="16" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">9</text>'
    + '<line x1="524.5" y1="11" x2="524.5" y2="91" style="stroke:#999999;stroke-width:1;" />'
    + '<circle cx="120" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="120" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">66</text>'
    + '<circle cx="148" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="148" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">10</text>'
    + '<circle cx="176" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="176" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">12</text>'
    + '<circle cx="288" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="288" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">18</text>'
    + '<circle cx="316" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="316" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">10</text>'
    + '<circle cx="344" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="344" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">12</text>'
    + '<circle cx="400" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="400" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">33</text>'
    + '<circle cx="456" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="456" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">12</text>'
    + '<circle cx="484" cy="27" r="10" style="fill:#eaeaea;" />'
    + '<text x="484" y="32" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">10</text>'
    + '<line x1="524.5" y1="11" x2="524.5" y2="91" style="stroke:#999999;stroke-width:1;" />'
    + '<line x1="524.5" y1="11" x2="524.5" y2="91" style="stroke:#999999;stroke-width:1;" />'
    + '<circle cx="288" cy="59" r="10" style="fill:#eaeaea;" />'
    + '<text x="288" y="64" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
    + '<line x1="524.5" y1="11" x2="524.5" y2="91" style="stroke:#999999;stroke-width:1;" />'
    + '<circle cx="260" cy="75" r="10" style="fill:#eaeaea;" />'
    + '<text x="260" y="80" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">1</text>'
    + '<line x1="524.5" y1="11" x2="524.5" y2="91" style="stroke:#999999;stroke-width:1;" />'
    + '<circle cx="204" cy="91" r="10" style="fill:#eaeaea;" />'
    + '<text x="204" y="96" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">5</text>'
    + '<circle cx="232" cy="91" r="10" style="fill:#eaeaea;" />'
    + '<text x="232" y="96" style="font:bold 12pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#000000;text-anchor:middle;">2</text>'
    + '<line x1="524.5" y1="11" x2="524.5" y2="91" style="stroke:#999999;stroke-width:1;" />'
    + '<text x="1" y="15.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">E</text>'
    + '<text x="1" y="31.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">B</text>'
    + '<text x="1" y="47.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">G</text>'
    + '<text x="1" y="63.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">D</text>'
    + '<text x="1" y="79.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">A</text>'
    + '<text x="1" y="95.8" style="font:10pt Arial, Helvetica, Verdana, Geneva, sans-serif;fill:#999999;text-anchor:start;">E</text>'
    + '</svg>',
}];

export default Tests;
