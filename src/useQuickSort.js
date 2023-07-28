import { useState } from "react";

export default function useQuickSort(
  list,
  setList,
  completed,
  setCompleted,
  inProgress,
  setInProgress,
  setSorted,
) {
  const initialQuickState = {
    stack: [{ x: 0, y: list.length - 1 }],
    a: 0,
    b: 0,
    pivots: [],
    swappers: {
      indices: [],
      swapped: false,
    },
  };
  const [quickState, setQuickState] = useState(initialQuickState);

  function quickSort() {
    if (!inProgress) {
      setInProgress(true);
      setSorted(false);
      setQuickState(initialQuickState);
      return;
    }

    if (completed) {
      setSorted(true);
      setCompleted(false);
      setInProgress(false);
      return;
    }

    const { stack, a, b, pivots, swappers } = quickState;

    if (swappers.swapped) {
      const newA = a + 1;
      const newB = b + 1;
      setQuickState((q) => ({
        ...q,
        a: newA,
        b: newB,
        swappers: {
          indices: [],
          swapped: false,
        },
      }));
      return;
    }

    if (swappers.indices.length > 0) {
      const temp = [...list];
      [temp[a], temp[b]] = [temp[b], temp[a]];
      setList(temp);
      setQuickState((q) => ({
        ...q,
        swappers: {
          ...swappers,
          swapped: true,
        },
      }));
      return;
    }

    if (stack.length === 0) {
      setCompleted(true);
      return;
    }

    const { x, y } = stack[stack.length - 1];
    const pivot = list[y];

    if (b >= y) {
      const temp = [...list];
      [temp[a], temp[y]] = [temp[y], temp[a]];
      setList(temp);
      const newPivots = [...pivots];
      newPivots.push(a);
      const tempStack = [...stack];
      tempStack.pop();
      if (a + 1 < y) {
        tempStack.push({ x: a + 1, y: y });
      } else {
        newPivots.push(a + 1);
      }
      if (a - 1 > x) {
        tempStack.push({ x: x, y: a - 1 });
      } else {
        newPivots.push(a - 1);
      }
      setQuickState((q) => ({ ...q, stack: tempStack, pivots: newPivots }));
      if (tempStack.length > 0) {
        const newA = tempStack[tempStack.length - 1].x;
        const newB = tempStack[tempStack.length - 1].x;
        setQuickState((q) => ({ ...q, a: newA, b: newB }));
      }
      return;
    }

    if (list[b] <= pivot) {
      setQuickState((s) => ({
        ...s,
        swappers: {
          indices: [a, b],
          swapped: false,
        },
      }));
      return;
    }

    setQuickState((q) => ({ ...q, b: b + 1 }));
  }

  return { quickSort, quickState };
}
