import { useState } from "react";

export default function useMergeSort(
  list,
  setList,
  completed,
  setCompleted,
  inProgress,
  setInProgress,
  setSorted,
) {
  const initialMergeState = {
    width: 1,
    left: 0,
    right: Math.min(1, list.length),
    end: Math.min(2, list.length),
    a: 0,
    b: Math.min(1, list.length),
    swappers: {
      indices: [],
      swapped: false,
    },
  };
  const [mergeState, setMergeState] = useState(initialMergeState);

  function mergeSort() {
    const { width, left, right, end, a, b, swappers } = mergeState;
    if (!inProgress) {
      setInProgress(true);
      setMergeState(initialMergeState);
      setSorted(false);
      return;
    }

    if (completed) {
      setSorted(true);
      setCompleted(false);
      setInProgress(false);
      return;
    }

    let newA = a;
    let newB = b;
    let newRight = right;

    if (swappers.swapped) {
      newB = b + 1;
      newA = a + 1;
      newRight = right + 1;
      setMergeState((m) => ({
        ...m,
        swappers: { indices: [], swapped: false },
      }));
    } else if (swappers.indices.length > 0) {
      let i = b;
      let temp = [...list];
      while (i > a) {
        [temp[i], temp[i - 1]] = [temp[i - 1], temp[i]];
        i--;
      }
      setMergeState((m) => ({
        ...m,
        swappers: { indices: [a, a + 1], swapped: true },
      }));
      setList([...temp]);
      return;
    } else if (a < right && (b >= end || list[a] <= list[b])) {
      newA = a + 1;
    } else {
      setMergeState((m) => ({
        ...m,
        swappers: { indices: [a, b], swapped: false },
      }));
      return;
    }
    setMergeState((m) => ({ ...m, a: newA, b: newB, right: newRight }));

    if (newA >= newRight || newB >= end) {
      let newLeft = left + 2 * width;
      let newRight = newLeft + width;
      if (newLeft < list.length && newRight < list.length) {
        setMergeState((m) => ({
          ...m,
          left: newLeft,
          right: newRight,
          end: Math.min(newLeft + 2 * width, list.length),
          a: newLeft,
          b: newRight,
        }));
      } else {
        let newWidth = width * 2;
        if (newWidth < list.length) {
          const newLeft = 0;
          const newRight = Math.min(newLeft + newWidth, list.length);
          const newEnd = Math.min(newLeft + 2 * newWidth, list.length);

          setMergeState((m) => ({
            ...m,
            width: newWidth,
            left: newLeft,
            right: newRight,
            end: newEnd,
            a: newLeft,
            b: newRight,
          }));
        } else {
          setCompleted(true);
          setMergeState((m) => ({
            ...m,
            a: list.length,
          }));
        }
      }
    }
  }

  return { mergeSort, mergeState };
}
