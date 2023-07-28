import { useState } from "react";

export default function useSelectionSort(
  list,
  setList,
  completed,
  setCompleted,
  inProgress,
  setInProgress,
  setSorted,
) {
  const initialSelectionState = {
    a: 0,
    bMin: 0,
    b: 1,
    swappers: {
      indices: [],
      swapped: false,
    },
  };
  const [selectionState, setSelectionState] = useState(initialSelectionState);

  function selectionSort() {
    if (!inProgress) {
      setInProgress(true);
      setSorted(false);
      setSelectionState(initialSelectionState);
      return;
    }

    if (completed) {
      setSorted(true);
      setCompleted(false);
      setInProgress(false);
      return;
    }
    const { a, bMin, b, swappers } = selectionState;

    if (swappers.swapped) {
      updateA();
      return;
    }

    if (swappers.indices.length > 0) {
      const temp = [...list];
      [temp[bMin], temp[a]] = [temp[a], temp[bMin]];
      setList(temp);
      setSelectionState((s) => ({
        ...s,
        swappers: { ...swappers, swapped: true },
      }));
      return;
    }

    if (b >= list.length) {
      if (bMin === a) {
        updateA();
      } else {
        setSelectionState((s) => ({
          ...s,
          swappers: {
            indices: [bMin, a],
            swapped: false,
          },
        }));
      }
      return;
    }

    if (list[b] < list[bMin]) {
      let newBMin = bMin;
      newBMin = b;
      setSelectionState((s) => ({ ...s, bMin: newBMin }));
    }
    const newB = b + 1;
    setSelectionState((s) => ({ ...s, b: newB }));

    function updateA() {
      const newA = a + 1;
      const newB = newA + 1;
      setSelectionState((s) => ({
        ...s,
        a: newA,
        b: newB,
        bMin: newA,
        swappers: {
          indices: [],
          swapped: false,
        },
      }));
      if (newA >= list.length - 1) {
        setSelectionState((s) => ({ ...s, a: list.length }));
        setCompleted(true);
      }
    }
  }

  return { selectionSort, selectionState };
}
