import { useState } from "react";
import generateArray from "./generateArray.js";
import SortButton from "./SortButton.jsx";
import BubbleSort from "./BubbleSort.jsx";
import MergeSort from "./MergeSort.jsx";

export default function App() {
  const [list, setList] = useState(generateArray(6));
  const [inProgress, setInProgress] = useState(false);
  const sortingAlgorithms = ["Merge Sort", "Bubble Sort"];
  const [checked, setChecked] = useState("");

  let Sort = BubbleSort;
  if (checked === "Merge Sort") {
    Sort = MergeSort;
  }

  return (
    <div className="p-4 pb-16 h-screen flex flex-col bg-slate-300">
      <div className="flex justify-center gap-x-5 mb-4">
        <input
          type="range"
          min="2"
          max="200"
          value={list.length}
          onChange={(e) => {
            const size = +e.target.value;
            setList(generateArray(size));
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
        {checked === "" || (
          <SortButton
            inProgress={inProgress}
            onClick={() => setInProgress(true)}
          />
        )}
      </div>

      <Sort
        inProgress={inProgress}
        finished={() => setInProgress(false)}
        list={list}
        setList={setList}
      />
    </div>
  );
}
