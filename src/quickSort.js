import generateArray from "./generateArray.js";

function quickSort(arr) {
  let count = 0;
  let swapCount = 0;
  const temp = [...arr];
  // Stack for storing start and end index
  const stack = [{ x: 0, y: temp.length - 1 }];

  //Iterate the stack
  while (stack.length) {
    // Get the start and end from the stack
    const { x, y } = stack[stack.length - 1];

    // Pick the last element as pivot
    const pivot = temp[y];
    let a = x;

    for (let b = x; b < y; b++) {
      count++;
      if (temp[b] <= pivot) {
        swapCount++;
        [temp[a], temp[b]] = [temp[b], temp[a]];
        a++;
      }
    }

    swapCount++;
    [temp[a], temp[y]] = [temp[y], temp[a]];

    stack.pop();

    // Push sub array with fewer elements than pivot into the stack
    if (a - 1 > x) {
      stack.push({ x: x, y: a - 1 });
    }

    // Push sub array with greater elements than pivot into the stack
    if (a + 1 < y) {
      stack.push({ x: a + 1, y: y });
    }
  }

  return [temp, count, swapCount];
}

function hoareQuickSort(arr) {
  let count = 0;
  let swapCount = 0;
  const temp = [...arr];
  // Stack for storing start and end index
  const stack = [{ x: 0, y: temp.length - 1 }];

  //Iterate the stack
  while (stack.length) {
    // Get the start and end from the stack
    const { x, y } = stack[stack.length - 1];

    // Pick the last element as pivot
    const pivotIndex = Math.floor(x + (y - x) / 2);
    const pivot = temp[pivotIndex];
    let a = x - 1;
    let b = y + 1;

    while (true) {
      do {
        count++;
        a++;
      } while (temp[a] < pivot);
      do {
        count++;
        b--;
      } while (temp[b] > pivot);

      if (a >= b) {
        break;
      }
      swapCount++;
      [temp[a], temp[b]] = [temp[b], temp[a]];
    }

    stack.pop();

    // Push sub array with greater elements than pivot into the stack
    if (b + 1 >= 0 && b + 1 < y) {
      stack.push({ x: b + 1, y: y });
    }
    // Push sub array with fewer elements than pivot into the stack
    if (x >= 0 && x < b) {
      stack.push({ x: x, y: b });
    }
  }

  return [temp, count, swapCount];
}

function main() {
  let qWin = 0;
  let hWin = 0;
  let hCount = 0;
  let hSwapCount = 0;
  let qCount = 0;
  let qSwapCount = 0;
  for (let j = 0; j < 40_000; j++) {
    const a = generateArray(200);

    const t0 = performance.now();
    const [, h, hs] = hoareQuickSort(a);
    hCount += h
    hSwapCount += hs
    const t1 = performance.now();
    const [, q, qs] = quickSort(a);
    qCount += q
    qSwapCount += qs
    const t2 = performance.now();
    if (t2 - t1 < t1 - t0) {
      qWin++;
    } else {
      hWin++;
    }
  }
  console.log({ hCount, hSwapCount, qCount, qSwapCount });
  console.log({h: hCount + 3 * hSwapCount, q: qCount + 3 * qSwapCount})
  console.log({ length: 200, qWin, hWin });
}

main();
