import { useState, useRef, useEffect } from "react";
import {
  bubbleSortGenerator,
  insertionSortGenerator,
  quickSortGenerator,
  selectionSortGenerator,
  mergeSortGenerator,
  hoareQuickSortGenerator,
} from "./sortingAlgorithms";
import generateArray from "./generateArray";
import SortButton from "./SortButton";

const DEFAULT_ARRAY_SIZE = 6;
const sorters = {
  "Bubble Sort": {
    generator: bubbleSortGenerator,
    colorFunction: bubbleSortColors,
  },
  "Quick Sort (Hoare)": {
    generator: hoareQuickSortGenerator,
    colorFunction: hoareQuickSortColors,
  },
  "Insertion Sort": {
    generator: insertionSortGenerator,
    colorFunction: insertionSortColors,
  },
  "Quick Sort (Lomuto)": {
    generator: quickSortGenerator,
    colorFunction: quickSortColors,
  },
  "Selection Sort": {
    generator: selectionSortGenerator,
    colorFunction: selectionSortColors,
  },
  "Merge Sort": {
    generator: mergeSortGenerator,
    colorFunction: mergeSortColors,
  },
};

export default function App() {
  const [list, setList] = useState(() => generateArray(DEFAULT_ARRAY_SIZE));
  const [selectedSorter, setSelectedSorter] = useState("Bubble Sort");
  const sortGenerator = useRef(null);
  const [colors, setColors] = useState(() =>
    Array(list.length).fill("bg-slate-800"),
  );
  const [state, setState] = useState("waiting");

  useEffect(() => {
    console.log("Running effect")
    let timeoutId;
    if (state === "sorting") {
      const { value, done } = sortGenerator.current.next();
      console.log({ value, done });
      if (!done) {
        timeoutId = setTimeout(
          () => {
            setList(value.array);
            setColors(sorters[selectedSorter].colorFunction(value));
          },
          Math.floor(2400 / list.length),
        );
      } else {
        setColors(Array(list.length).fill("bg-green-300"));
        setState("flashing");
      }
    } else if (state === "flashing") {
      timeoutId = setTimeout(
        () => {
          setColors(Array(list.length).fill("bg-purple-300"))
          setState("waiting")
        },
        500,
      );
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [selectedSorter, list.length, state, colors]);

  return (
    <div className="flex h-screen min-w-[600px] flex-col bg-slate-300 p-4 pb-8">
      <div className="mb-4 flex justify-center gap-x-5">
        <input
          type="range"
          min="2"
          max="200"
          value={list.length}
          disabled={state === "sorting"}
          onChange={(e) => {
            const size = +e.target.value;
            const newList = generateArray(size);
            setList(newList);
            setColors(Array(newList.length).fill("bg-slate-800"));
          }}
        />
        {Object.keys(sorters).map((sorterKey) => (
          <label className="flex items-center gap-0.5" key={sorterKey}>
            <input
              type="radio"
              value={sorterKey}
              checked={selectedSorter === sorterKey}
              onChange={(e) => setSelectedSorter(e.target.value)}
              disabled={state === "sorting"}
            />
            {sorterKey}
          </label>
        ))}

        <SortButton
          disabled={state === "sorting"}
          onClick={() => {
            sortGenerator.current = sorters[selectedSorter].generator(list);
            setState("sorting");
            const { value, done } = sortGenerator.current.next();
            console.log({ value, done });
            if (!done) {
              setList(value.array);
              setColors(sorters[selectedSorter].colorFunction(value));
            } else {
              setColors(Array(list.length).fill("bg-green-300"));
              setState("flashing");
            }
          }}
        />
      </div>
      <div className="flex flex-grow justify-center gap-[1px]">
        {list.map((num, i) => {
          const bg = colors[i];

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

function bubbleSortColors({ array, i, j, state }) {
  const colors = Array(array.length).fill("bg-slate-800");
  if (state === "pre-compare") {
    colors[j] = "bg-green-300";
    colors[j + 1] = "bg-green-300";
  } else if (state === "pre-swap" || state === "post-swap") {
    colors[j] = "bg-red-300";
    colors[j + 1] = "bg-red-300";
  }

  // The last i elements are already sorted
  for (let k = colors.length - i; k < colors.length; k++) {
    colors[k] = "bg-purple-300";
  }

  return colors;
}

function quickSortColors({ array, end, i, partitionIndex, pivots, state }) {
  const colors = Array(array.length).fill("bg-slate-800");
  pivots.forEach((i) => (colors[i] = "bg-purple-300"));

  if (state === "pre-compare") {
    colors[i] = "bg-blue-300";
    colors[end] = "bg-yellow-300";
    colors[partitionIndex] = "bg-green-300";
  } else if (state === "pre-swap 1" || state === "post-swap 1") {
    colors[i] = "bg-red-300";
    colors[end] = "bg-yellow-300";
    colors[partitionIndex] = "bg-red-300";
  } else if (state === "pre-swap 2" || state === "post-swap 2") {
    colors[partitionIndex] = "bg-orange-300";
    colors[end] = "bg-orange-300";
  }

  return colors;
}

function hoareQuickSortColors({ array, left, right, pivotIndex, state }) {
  const colors = Array(array.length).fill("bg-slate-800");
  colors[pivotIndex] = "bg-yellow-300";
  if (state === "pre-compare") {
    colors[left] = "bg-green-300";
    colors[right] = "bg-blue-300";
  } else if (state === "pre-swap" || state === "post-swap") {
    colors[left] = "bg-red-300";
    colors[right] = "bg-red-300";
  }
  return colors;
}

function insertionSortColors({ array, i, j, state }) {
  const colors = Array(array.length).fill("bg-slate-800");
  colors[i] = "bg-yellow-300";
  if (state === "pre-swap" || state === "post-swap") {
    colors[j] = "bg-red-300";
    colors[j + 1] = "bg-red-300";
  } else if (state === "pre-compare") {
    colors[j] = "bg-green-300";
    colors[j + 1] = "bg-green-300";
  }
  return colors;
}

function selectionSortColors({ array, start, min, i, state }) {
  const colors = Array(array.length).fill("bg-slate-800");
  colors[min] = "bg-yellow-300";
  colors[start] = "bg-green-300";
  if (state === "pre-compare") {
    colors[i] = "bg-blue-300";
  } else if (state === "pre-swap" || state === "post-swap") {
    colors[min] = "bg-red-300";
    colors[start] = "bg-red-300";
  }

  for (let a = 0; a < start; a++) {
    colors[a] = "bg-purple-300";
  }

  return colors;
}

function mergeSortColors({ array, left, right, start, end, state }) {
  const colors = Array(array.length).fill("bg-slate-800");
  if (start === 0 && end === array.length - 1) {
    for (let i = 0; i < left; i++) {
      colors[i] = "bg-purple-300";
    }
  }
  if (state === "pre-compare") {
    colors[left] = "bg-green-300";
    colors[right] = "bg-green-300";
  } else if (state === "pre-move-left") {
    colors[left] = "bg-red-300";
    colors[right] = "bg-green-300";
  } else if (state === "post-move-left") {
    colors[left - 1] = "bg-red-300";
    colors[right] = "bg-green-300";
  } else if (state === "pre-move-right") {
    colors[right] = "bg-red-300";
    colors[left] = "bg-green-300";
  } else if (state === "post-move-right") {
    colors[left - 1] = "bg-red-300";
    colors[left] = "bg-green-300";
  }
  return colors;
}
