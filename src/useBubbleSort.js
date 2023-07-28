import { useState } from "react";

export default function useBubbleSort(
  list,
  setList,
  completed,
  setCompleted,
  inProgress,
  setInProgress,
  setSorted,
) {
  const initialBubbleState = {
    index: 0,
    maxIndex: list.length - 1,
    swapCount: 0,
    swappers: {
      indices: [],
      swapped: false,
    },
  };
  const [bubbleState, setBubbleState] = useState(initialBubbleState);

  function bubbleSort() {
    const { index, maxIndex, swapCount, swappers } = bubbleState;

    function updateIndex() {
      const nextIndex = index + 1;
      if (nextIndex >= maxIndex) {
        const nextMaxIndex = maxIndex - 1;
        if (nextMaxIndex === 0 || swapCount === 0) {
          setBubbleState((b) => ({ ...b, maxIndex: -1 }));
          setCompleted(true);
        } else {
          setBubbleState((b) => ({
            ...b,
            swapCount: 0,
            index: 0,
            maxIndex: nextMaxIndex,
          }));
        }
      } else {
        setBubbleState((b) => ({ ...b, index: nextIndex }));
      }
    }

    if (!inProgress) {
      setInProgress(true);
      setSorted(false);
      setBubbleState(initialBubbleState);
      return;
    }

    if (completed) {
      setSorted(true);
      setInProgress(false);
      setCompleted(false);
      return;
    }

    if (swappers.swapped) {
      setBubbleState((b) => ({
        ...b,
        swappers: {
          indices: [],
          swapped: false,
        },
      }));
      updateIndex();
      return;
    }

    const copy = [...list];
    if (swappers.indices.length > 0) {
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      setList(copy);
      setBubbleState((b) => ({
        ...b,
        swappers: { ...swappers, swapped: true },
      }));
    } else if (copy[index] > copy[index + 1]) {
      setBubbleState((b) => ({
        ...b,
        swapCount: swapCount + 1,
        swappers: {
          indices: [index, index + 1],
          swapped: false,
        },
      }));
    } else {
      updateIndex();
    }
  }

  return { bubbleSort, bubbleState };
}
