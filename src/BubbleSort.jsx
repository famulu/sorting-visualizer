import { useState } from "react";
import generateArray from "./generateArray.js";
import SortButton from "./SortButton.jsx";

export default function BubbleSort() {
  const [list, setList] = useState(() => generateArray(4));
  const [index, setIndex] = useState(0);
  // Exclusive upper bound of index. Any index above maxIndex is undefined or already sorted
  const [maxIndex, setMaxIndex] = useState(list.length - 1);
  // Optimization: If no swaps occur in a pass, then list is sorted
  const [swapCount, setSwapCount] = useState(0);
  const [swappers, setSwappers] = useState({
    indices: [],
    swapped: false,
  });
  const [completed, setCompleted] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  // if (inProgress) {
  //   const delay = completed ? 500 : Math.max(0, Math.floor(2400 / list.length - 30));
  //   setTimeout(handleClick, delay);
  // }

  function updateIndex() {
    const nextIndex = index + 1;
    if (nextIndex >= maxIndex) {
      const nextMaxIndex = maxIndex - 1;
      if (nextMaxIndex === 0 || swapCount === 0) {
        setMaxIndex(-1);
        setCompleted(true);
      } else {
        setSwapCount(0);
        setIndex(0);
        setMaxIndex(nextMaxIndex);
      }
    } else {
      setIndex(nextIndex);
    }
  }

  function handleClick() {
    if (!inProgress) {
      setInProgress(true);
      setIndex(0);
      setMaxIndex(list.length - 1);
      setSwapCount(0);
      return;
    }

    if (completed) {
      setInProgress(false);
      setCompleted(false);
      return;
    }

    if (swappers.swapped) {
      setSwappers({
        indices: [],
        swapped: false,
      });
      updateIndex();
      return;
    }

    const copy = [...list];
    if (swappers.indices.length > 0) {
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      setList(copy);
      setSwappers({ ...swappers, swapped: true });
    } else if (copy[index] > copy[index + 1]) {
      setSwappers({
        indices: [index, index + 1],
        swapped: false,
      });
      setSwapCount((s) => s + 1);
    } else {
      updateIndex();
    }
  }

  return (
    <div className="p-4 pb-16 h-screen flex flex-col bg-slate-300">
      <div className="flex justify-center gap-x-5 mb-4">
        <input
          type="range"
          disabled={inProgress}
          min="2"
          max="200"
          value={list.length}
          onChange={(e) => {
            const size = +e.target.value;
            setList(generateArray(size));
            setMaxIndex(size - 1);
          }}
        />
        <SortButton onClick={handleClick} inProgress={false} />
      </div>
      <div className="flex gap-0.5 flex-grow justify-center">
        {list.map((num, i) => {
          let bg = "bg-slate-800";
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

          return (
            <div
              key={i}
              style={{ height: `${num}%` }}
              className={`w-4 ${bg}`}
            />
          );
        })}
      </div>
    </div>
  );
}
