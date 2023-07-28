import { useState } from "react";
import generateArray from "./generateArray.js";
import SortButton from "./SortButton.jsx";
import useBubbleSort from "./useBubbleSort.js";
import useMergeSort from "./useMergeSort.js";
import useQuickSort from "./useQuickSort.js";
import useSelectionSort from "./useSelectionSort.js";

export default function App() {
  const [list, setList] = useState(generateArray(6));
  const [inProgress, setInProgress] = useState(false);
  const [checked, setChecked] = useState("");
  const [completed, setCompleted] = useState(false);
  const [sorted, setSorted] = useState(false);

  const { mergeSort, mergeState } = useMergeSort(
    list,
    setList,
    completed,
    setCompleted,
    inProgress,
    setInProgress,
    setSorted,
  );

  const { bubbleSort, bubbleState } = useBubbleSort(
    list,
    setList,
    completed,
    setCompleted,
    inProgress,
    setInProgress,
    setSorted,
  );

  const { quickSort, quickState } = useQuickSort(
    list,
    setList,
    completed,
    setCompleted,
    inProgress,
    setInProgress,
    setSorted,
  );

  const { selectionSort, selectionState } = useSelectionSort(
    list,
    setList,
    completed,
    setCompleted,
    inProgress,
    setInProgress,
    setSorted,
  );

  const sortingAlgorithms = {
    "Merge Sort": mergeSort,
    "Bubble Sort": bubbleSort,
    "Selection Sort": selectionSort,
    "Quick Sort": quickSort,
  };

  if (inProgress) {
    const delay = completed ? 500 : Math.max(0, Math.floor(2400 / list.length));
    setTimeout(sortingAlgorithms[checked], delay);
  }

  return (
    <div className="flex h-screen min-w-[600px] flex-col bg-slate-300 p-4 pb-8">
      <div className="mb-4 flex justify-center gap-x-5">
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
        {Object.keys(sortingAlgorithms).map((algo) => (
          <label className="flex items-center gap-0.5" key={algo}>
            <input
              type="radio"
              name="algorithm"
              value={algo}
              disabled={inProgress}
              checked={algo === checked}
              onChange={(e) => {
                setChecked(e.target.value);
              }}
            />
            <span>{algo}</span>
          </label>
        ))}
        <SortButton
          disabled={checked === "" || inProgress}
          onClick={sortingAlgorithms[checked]}
        />
      </div>

      <div className="flex flex-grow justify-center gap-[1px]">
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
            } else if (checked === "Selection Sort") {
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
            } else {
              const { stack, a, b, pivots, swappers } = quickState;
              if (stack.length) {
                const { y } = stack[stack.length - 1];
                if (i === y) {
                  bg = "bg-yellow-300";
                }
              }
              if (pivots.includes(i)) {
                bg = "bg-purple-300";
              }
              if (i === a) {
                bg = "bg-green-300";
              }
              if (i === b) {
                bg = "bg-blue-300";
              }
              if (swappers.indices.includes(i)) {
                bg = "bg-red-300";
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
              className={`w-8 ${bg} min-w-[1px]`}
            />
          );
        })}
      </div>
    </div>
  );
}
