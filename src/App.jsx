import { useState } from "react";
import generateArray from "./generateArray.js";
import SortButton from "./SortButton.jsx";

export default function App() {
  const [list, setList] = useState(generateArray(6));
  const [inProgress, setInProgress] = useState(false);
  const sortingAlgorithms = ["Merge Sort", "Bubble Sort"];
  const [checked, setChecked] = useState("");

  const initialBubbleState = {
    index: 0,
    maxIndex: list.length - 1,
    swapCount: 0,
    swappers: {
      indices: [],
      swapped: false,
    },
    completed: false,
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
    completed: false,
  };
  const [mergeState, setMergeState] = useState(initialMergeState);

  if (inProgress) {
    const delay = Math.max(0, Math.floor(2400 / list.length));
    setTimeout(sort, delay);
  }

  function sort() {
    if (checked === "Merge Sort") {
      mergeSort();
    } else {
      bubbleSort();
    }
  }

  function mergeSort() {
    const { width, left, right, end, a, b, swappers, completed } = mergeState;
    if (!inProgress) {
      setInProgress(true);
      setMergeState(initialMergeState);
      return;
    }

    if (completed) {
      setMergeState((m) => ({ ...m, completed: false }));
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
          setMergeState((m) => ({
            ...m,
            completed: true,
          }));
        }
      }
    }
  }

  function bubbleSort() {
    const { index, maxIndex, swapCount, swappers, completed } = bubbleState;

    function updateIndex() {
      const nextIndex = index + 1;
      if (nextIndex >= maxIndex) {
        const nextMaxIndex = maxIndex - 1;
        if (nextMaxIndex === 0 || swapCount === 0) {
          setBubbleState((b) => ({ ...b, maxIndex: -1, completed: true }));
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
      setBubbleState(initialBubbleState);
      return;
    }

    if (completed) {
      setInProgress(false);
      setBubbleState({ ...bubbleState, completed: false });
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
            setBubbleState((b) => ({ ...b, maxIndex: size - 1 }));
          }}
        />
        {sortingAlgorithms.map((algo) => (
          <label className="flex items-center gap-0.5">
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
        {checked === "" || <SortButton inProgress={false} onClick={sort} />}
      </div>

      <div className="flex gap-0.5 flex-grow justify-center">
        {list.map((num, i) => {
          let bg = "bg-slate-800";
          if (checked === "Bubble Sort") {
            const { index, swappers, maxIndex, completed } = bubbleState;
            if (inProgress && [index, index + 1].includes(i)) {
              bg = "bg-green-300";
            }
            if (swappers.indices.includes(i)) {
              bg = "bg-red-300";
            }
            if (i > maxIndex) {
              bg = "bg-purple-300";
            }

            if (completed) {
              bg = "bg-green-300";
            }
          } else {
            const { swappers, completed, a, b } = mergeState;
            if (completed) {
              bg = "bg-green-300";
            } else if (inProgress) {
              if (swappers.indices.length > 0) {
                if (swappers.indices.includes(i)) {
                  bg = "bg-red-300";
                }
              } else if (i === a || i === b) {
                bg = "bg-green-300";
              }
            }
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
