export function* quickSortGenerator(initialArray) {
  const array = [...initialArray];

  if (array.length <= 1) {
    return array;
  }

  const stack = [{ start: 0, end: array.length - 1 }];
  const pivots = new Set();

  while (stack.length) {
    const { start, end } = stack.pop();

    const pivot = array[end];
    let partitionIndex = start;

    for (let i = start; i < end; i++) {
      yield { array, end, partitionIndex, i, pivots, state: "pre-compare" };
      if (array[i] <= pivot) {
        yield { array, end, partitionIndex, i, pivots, state: "pre-swap 1" };
        [array[i], array[partitionIndex]] = [array[partitionIndex], array[i]];
        yield { array, end, partitionIndex, i, pivots, state: "post-swap 1" };
        partitionIndex++;
      }
    }

    yield { array, end, partitionIndex, pivots, state: "pre-swap 2" };
    // Place pivot in the correct position
    [array[partitionIndex], array[end]] = [array[end], array[partitionIndex]];
    pivots.add(partitionIndex);
    yield { array, end, partitionIndex, pivots, state: "post-swap 2" };

    // Push subarrays into the stack
    // Subarrays must have at least 2 elements
    if (partitionIndex + 1 < end) {
      stack.push({ start: partitionIndex + 1, end });
    } else {
      pivots.add(end);
    }

    if (partitionIndex - 1 > start) {
      stack.push({ start, end: partitionIndex - 1 });
    } else {
      pivots.add(start);
    }
  }

  return array;
}

export function* hoareQuickSortGenerator(initialArray) {
  const array = [...initialArray];

  if (array.length <= 1) {
    return array;
  }

  const stack = [{ start: 0, end: array.length - 1 }];

  while (stack.length) {
    const { start, end } = stack.pop();
    let pivotIndex = Math.floor(start + (end - start) / 2);
    const pivot = array[pivotIndex];
    let left = start - 1;
    let right = end + 1;

    while (true) {
      do {
        left++;
        yield { array, left, right, pivotIndex, state: "pre-compare" };
      } while (array[left] < pivot);
      do {
        right--;
        yield { array, left, right, pivotIndex, state: "pre-compare" };
      } while (array[right] > pivot);

      if (left >= right) {
        break;
      }

      yield { array, left, right, pivotIndex, state: "pre-swap" };
      [array[left], array[right]] = [array[right], array[left]];
      if (left === pivotIndex) {
        pivotIndex = right;
      } else if (right === pivotIndex) {
        pivotIndex = left;
      }
      yield { array, left, right, pivotIndex, state: "post-swap" };
    }

    if (right + 1 < end) {
      stack.push({ start: right + 1, end });
    }
    if (start < right) {
      stack.push({ start, end: right });
    }
  }

  return array;
}

export function* selectionSortGenerator(initialArray) {
  const array = [...initialArray];

  for (let start = 0; start < array.length - 1; start++) {
    let min = start;
    for (let i = start + 1; i < array.length; i++) {
      yield { array, start, min, i, state: "pre-compare" };
      if (array[i] < array[min]) {
        min = i;
      }
    }

    yield { array, start, min, state: "post-compare" };

    if (min !== start) {
      yield { array, start, min, state: "pre-swap" };
      [array[min], array[start]] = [array[start], array[min]];
      yield { array, start, min, state: "post-swap" };
    }
  }
  return array;
}

export function* bubbleSortGenerator(initialArray) {
  const array = [...initialArray];
  for (let i = 0; i < array.length - 1; i++) {
    let swapOccurred = false;
    for (let j = 0; j < array.length - i - 1; j++) {
      yield { array: [...array], i, j, state: "pre-compare" };
      if (array[j] > array[j + 1]) {
        yield { array: [...array], i, j, state: "pre-swap" };
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapOccurred = true;
        yield { array: [...array], i, j, state: "post-swap" };
      }
    }
    if (!swapOccurred) {
      break;
    }
  }
  return array;
}

export function* insertionSortGenerator(initialArray) {
  const array = [...initialArray];

  for (let i = 1; i < array.length; i++) {
    for (let j = i - 1; j > -1; j--) {
      yield { array, i, j, state: "pre-compare" };
      if (array[j + 1] < array[j]) {
        yield { array, i, j, state: "pre-swap" };
        [array[j + 1], array[j]] = [array[j], array[j + 1]];
        yield { array, i, j, state: "post-swap" };
      } else {
        break;
      }
    }
  }

  return array;
}

export function* mergeSortGenerator(initialArray) {
  const array = [...initialArray];

  if (array.length <= 1) {
    return array;
  }

  const stack = [{ start: 0, end: array.length - 1 }];
  const tempArray = Array(array.length);
  const mergeOperations = [];

  while (stack.length) {
    const { start, end } = stack.pop();

    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      stack.push({ start, end: mid });
      stack.push({ start: mid + 1, end });
      mergeOperations.push({ start, mid, end });
    }
  }

  while (mergeOperations.length) {
    const { start, mid, end } = mergeOperations.pop();
    let i = start;
    let j = mid + 1;
    let k = start;

    while (i <= mid && j <= end) {
      yield {
        ...outputIntermediateMergeSortArray(
          array,
          tempArray,
          start,
          mid,
          end,
          i,
          j,
          k,
        ),
        start,
        end,
        state: "pre-compare",
      };

      if (array[i] <= array[j]) {
        tempArray[k++] = array[i++];
      } else {
        yield {
          ...outputIntermediateMergeSortArray(
            array,
            tempArray,
            start,
            mid,
            end,
            i,
            j,
            k,
          ),
          start,
          end,
          state: "pre-move-right",
        };
        tempArray[k++] = array[j++];
        yield {
          ...outputIntermediateMergeSortArray(
            array,
            tempArray,
            start,
            mid,
            end,
            i,
            j,
            k,
          ),
          start,
          end,
          state: "post-move-right",
        };
      }
    }

    while (i <= mid) {
      tempArray[k++] = array[i++];
    }

    while (j <= end) {
      tempArray[k++] = array[j++];
    }

    for (i = start; i <= end; i++) {
      array[i] = tempArray[i];
    }
  }

  return array;
}

function outputIntermediateMergeSortArray(
  array,
  tempArray,
  start,
  mid,
  end,
  i,
  j,
  k,
) {
  const output = [...array];

  let a = start;

  for (let b = start; b < k; b++) {
    output[a] = tempArray[b];
    a++;
  }
  const left = a;
  for (let b = i; b <= mid; b++) {
    output[a] = array[b];
    a++;
  }
  const right = a;
  for (let b = j; b <= end; b++) {
    output[a] = array[b];
    a++;
  }

  return { array: output, left, right, k };
}
