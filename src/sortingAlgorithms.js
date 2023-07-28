function quickSort(arr) {
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
      if (temp[b] <= pivot) {
        [temp[a], temp[b]] = [temp[b], temp[a]];
        a++;
      }
    }

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

  return temp;
}

function hoareQuickSort(arr) {
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
        a++;
      } while (temp[a] < pivot);
      do {
        b--;
      } while (temp[b] > pivot);

      if (a >= b) {
        break;
      }
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

  return temp;
}

function selectionSort(array) {
  const temp = [...array];
  for (let i = 0; i < temp.length - 1; i++) {
    let jMin = i;
    for (let j = i + 1; j < temp.length; j++) {
      if (temp[j] < temp[jMin]) {
        jMin = j;
      }
    }

    if (jMin !== i) {
      [temp[jMin], temp[i]] = [temp[i], temp[jMin]];
    }
  }
  return temp;
}

function bubbleSort(array) {
  const temp = [...array];
  for (let i = 0; i < temp.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < temp.length - i - 1; j++) {
      if (temp[j] > temp[j + 1]) {
        [temp[j], temp[j + 1]] = [temp[j + 1], temp[j]];
        swapped = true;
      }
    }
    if (!swapped) {
      return temp;
    }
  }

  return temp;
}

function insertionSort(array) {
  const temp = [...array];

  for (let i = 1; i < temp.length; i++) {
    const current = temp[i];

    let j = i - 1;

    while (j > -1 && current < temp[j]) {
      temp[j + 1] = temp[j];
      j--;
    }

    temp[j + 1] = current;
  }

  return temp;
}
