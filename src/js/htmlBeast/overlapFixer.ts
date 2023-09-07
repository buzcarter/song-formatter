/**
 * Correct overlapping chord names/diagrams in songs rendered by UGS
 */

interface Box {
  top: number,
  left: number,
  right: number,
  width: number,
}

/**
 * returns `true` if Box A overlaps Box B. Detailed horizontal check, we "cheat" the
 * vertical check by assuming that tops must be equal to collide (a simplification
 * over a full height check.)
 */
function checkOverlap(a: Box, b: Box): boolean {
  // "cheat" vertical check
  if (a.top !== b.top) {
    return false;
  }

  if ((b.left > a.right) || (b.right < a.left)) {
    // overlap not possible
    return false;
  }
  if ((b.left > a.left) && (b.left < a.right)) {
    return true;
  }
  if ((b.right > a.left) && (b.right < a.right)) {
    return true;
  }
  return false;
}

/**
 * returns object with width and left & right offsets `element` to be measured
 */
function getBox(ele: HTMLElement): Box {
  const box = getOffsets(ele);
  box.width = getWidth(ele);

  // due to how CSS & HTML is defined it's possible that the <em> wrapping the
  // chord name is actually wider than the <strong>, let's check.
  // BTW: this will happen on the "mini-chord diagram" option
  const em = ele.getElementsByTagName('em')[0];
  if (em) {
    const emWidth = getWidth(em);
    if (emWidth > box.width) {
      // console.log('box strong.width: ' + box.width + 'px, em.width: ' + emWidth +'px');
      box.width = emWidth + 2;
    }
  }

  box.right = box.left + box.width;
  return box;
}

/**
 * source: http://www.cjboco.com/blog.cfm/post/determining-an-elements-width-and-height-using-javascript/
 */
function getWidth(ele: HTMLElement): number {
  if ('clip' in ele) {
    // @ts-ignore-next-line
    return ele.clip.width;
  }

  return 'pixelWidth' in ele.style ? ele.style.pixelWidth as number : ele.offsetWidth;
}

/**
 * Returns JSON with left, right, top, and width properties. ONLY left and top are calculate,
 * width & right need to be added later.
 * source: http://stackoverflow.com/questions/442404/dynamically-retrieve-the-position-x-y-of-an-html-element
 * @return {JSON}
 */
function getOffsets(ele: HTMLElement): Box {
  const box = {
    top: 0,
    left: 0,
    right: 0,
    width: 0,
  };

  // eslint-disable-next-line no-restricted-globals
  while (ele && !isNaN(ele.offsetLeft) && !isNaN(ele.offsetTop)) {
    box.left += ele.offsetLeft - ele.scrollLeft;
    box.top += ele.offsetTop - ele.scrollTop;
    // @ts-ignore-next-line
    ele = ele.offsetParent;
  }

  return box;
}

/**
 * checks (and fixes if problem is presetn) two code tags
 */
function checkChords(codeA: HTMLElement, codeB: HTMLElement): void {
  const strongA = codeA.getElementsByTagName('strong')[0];
  const strongB = codeB.getElementsByTagName('strong')[0];

  if (!strongA || !strongB) {
    return;
  }

  const boxA = getBox(strongA);
  const boxB = getBox(strongB);

  if (checkOverlap(boxA, boxB)) {
    const width = boxA.right - boxB.left + 1;
    codeA.style.paddingRight = `${width < 1 ? 1 : width}px`;
  }
}

/**
 * Runs through the element looking for UkeGeek chords (based on HTML) and
 * adjust the horizontal spacing if any of the chords overlap.
 * @param element containing the UGS HTML song
 */
export function Fix(ele: HTMLElement): void {
  const elements = Array.from(ele.querySelectorAll('code'));
  elements
    .forEach((e) => { e.style.paddingRight = '0px'; });
  elements
    .slice(0, -1)
    .forEach((e, i) => checkChords(e, elements[i + 1]));
}
