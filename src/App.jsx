import { useState } from "react";
import generateArray from "./generateArray.js";
import SortButton from "./SortButton.jsx";

export default function App() {
  const [list, setList] = useState(generateArray(6));
  const [inProgress, setInProgress] = useState(false);
  const sortingAlgorithms = ["Merge Sort", "Bubble Sort", "Selection Sort"];
  const [checked, setChecked] = useState("");
  const [completed, setCompleted] = useState(false);
  const [sorted, setSorted] = useState(false);

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

  if (inProgress) {
    const delay = completed ? 500 : Math.max(0, Math.floor(2400 / list.length));
    setTimeout(sort, delay);
  }

  function sort() {
    if (checked === "Merge Sort") {
      mergeSort();
    } else if (checked === "Bubble Sort") {
      bubbleSort();
    } else {
      selectionSort();
    }
  }

  function selectionSort() {
    if (!inProgress) {
      setInProgress(true);
      setSorted(false);
      return;
    }

    if (completed) {
      setSorted(true);
      setCompleted(false);
      setInProgress(false);
      setSelectionState(initialSelectionState);
      return;
    }
    const { a, bMin, b, swappers } = selectionState;

    if (swappers.swapped) {
      updateA();
      return;
    }

    const temp = [...list];
    if (swappers.indices.length > 0) {
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

    let newBMin = bMin;
    if (list[b] < list[bMin]) {
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

  function mergeSort() {
    const { width, left, right, end, a, b, swappers } = mergeState;
    if (!inProgress) {
      setInProgress(true);
      setSorted(false);
      return;
    }

    if (completed) {
      setSorted(true);
      setMergeState(initialMergeState);
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
      return;
    }

    if (completed) {
      setSorted(true);
      setBubbleState(initialBubbleState);
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

  return (
    <div className="p-4 pb-16 h-screen flex flex-col bg-slate-300">
      <div className="flex justify-center gap-x-5 mb-4">
        <input
          type="range"
          min="2"
          max="200"
          value={list.length}
          disabled={inProgress}
          onChange={(e) => {
            const size = +e.target.value;
            setList(generateArray(size));
            setSorted(false);
          }}
        />
        {sortingAlgorithms.map((algo) => (
          <label className="flex items-center gap-0.5" key={algo}>
            <input
              type="radio"
              name="algorithm"
              value={algo}
              checked={algo === checked}
              onChange={(e) => {
                setChecked(e.target.value);
              }}
            />
            <span>{algo}</span>
          </label>
        ))}
        {checked === "" || (
          <SortButton inProgress={inProgress} onClick={sort} />
        )}
      </div>

      <div className="flex gap-0.5 flex-grow justify-center">
        {list.map((num, i) => {
          let bg = "bg-slate-800";

          if (inProgress) {
            if (checked === "Bubble Sort") {
              const { index, swappers, maxIndex } = bubbleState;
              if ([index, index + 1].includes(i)) {
                bg = "bg-green-300";
              }
              if (swappers.indices.includes(i)) {
                bg = "bg-red-300";
              }
              if (i > maxIndex) {
                bg = "bg-purple-300";
              }
            } else if (checked === "Merge Sort") {
              const { swappers, a, b, width } = mergeState;
              if (i === a || i === b) {
                bg = "bg-green-300";
              }
              if (swappers.indices.includes(i)) {
                bg = "bg-red-300";
              }
              if (width * 2 >= list.length && i < a) {
                bg = "bg-purple-300";
              }
            } else {
              const { a, b, bMin, swappers } = selectionState;
              if (i === a) {
                bg = "bg-blue-300";
              }
              if (i === bMin) {
                bg = "bg-yellow-300";
              }
              if (i === b) {
                bg = "bg-green-300";
              }
              if (swappers.indices.includes(i)) {
                bg = "bg-red-300";
              }
              if (i < a) {
                bg = "bg-purple-300";
              }
            }
          }

          if (sorted) {
            bg = "bg-purple-300";
          }

          if (completed) {
            bg = "bg-green-300";
          }

          return (
            <div
              key={i}
              style={{ height: `${num}%` }}
              className={`w-8 ${bg}`}
            />
          );
        })}
      </div>
    </div>
  );
}
