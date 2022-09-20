export const getNodeSizeByText = (text, fontSize) => {
  const rows = String(text).split(/[\r\n]/g);
  let longestBytes = 0;
  rows && rows.forEach(item => {
    const rowByteLength = getBytesLength(item);
    longestBytes = rowByteLength > longestBytes ? rowByteLength : longestBytes;
  });
  // 背景框宽度，最长一行字节数/2 * fontsize + 2
  // 背景框宽度， 行数 * fontsize + 2
  return {
    width: Math.ceil(longestBytes / 2) * fontSize + fontSize / 4,
    height: rows.length * (fontSize + 2) + fontSize / 4,
  };
}

export const getBytesLength = (word) => {
  if (!word) {
    return 0;
  }
  let totalLength = 0;
  for (let i = 0; i < word.length; i++) {
    const c = word.charCodeAt(i);
    console.log(c)
    if ((word.match(/[A-Z]/))) {
      totalLength += 1.5;
    } else if (word === 49) {
      totalLength += 0.5
      console.log('word', word)
    } else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      totalLength += 1.2;
    } else {
      totalLength += 2;
    }
  }
  return totalLength;
};

function getCssStyle(prop) {
  return window.getComputedStyle(document.body, null).getPropertyValue(prop);
}

function getCanvasFont(fs) {
  const fontSize = fs + 'px' || getCssStyle('font-size');
  const fontFamily = getCssStyle('font-family');
  return `${fontSize} ${fontFamily}`;
}

export const getTextLengthByCanvas = (text, fontSize) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = getCanvasFont(fontSize);
  const rows = String(text).split(/[\r\n]/g);
  let maxWidth = 0;
  rows && rows.forEach(item => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const { width } = context.measureText(item)
    maxWidth = maxWidth > width ? maxWidth : width;
  })
  return {
    width: maxWidth,
    height: rows.length * (fontSize) * 1.5,
  };
}

export const pointFilter = (points) => {
  const allPoints = points;
  let i = 1;
  while (i < allPoints.length - 1) {
    const pre = allPoints[i - 1];
    const current = allPoints[i];
    const next = allPoints[i + 1];
    if ((pre.x === current.x && current.x === next.x)
      || (pre.y === current.y && current.y === next.y)) {
      allPoints.splice(i, 1);
    } else {
      i++;
    }
  }
  return allPoints;
};
