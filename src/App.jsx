import { useState } from "react";
import generateArray from "./generateArray.js";
import SortButton from "./SortButton.jsx";

export default function App() {
  const [list, setList] = useState(generateArray(6));
  const [inProgress, setInProgress] = useState(false);
  const sortingAlgorithms = {
    "Merge Sort": mergeSort,
    "Bubble Sort": bubbleSort,
    "Selection Sort": selectionSort,
    "Quick Sort": quickSort,
  };
  const [checked, setChecked] = useState("");
  const [completed, setCompleted] = useState(false);
  const [sorted, setSorted] = useState(false);

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

  if (inProgress) {
    const delay = completed ? 500 : Math.max(0, Math.floor(2400 / list.length));
    setTimeout(sortingAlgorithms[checked], delay);
  }

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
        {Object.keys(sortingAlgorithms).map((algo) => (
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
        <SortButton
          disabled={checked === "" || inProgress}
          onClick={sortingAlgorithms[checked]}
        />
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
              className={`w-8 ${bg}`}
            />
          );
        })}
      </div>
    </div>
  );
}

// function selectionSort2() {
//   if (!inProgress) {
//     setInProgress(true);
//     setSorted(false);
//     setSelectionState(initialSelectionState);
//     return;
//   }
//
//   if (completed) {
//     setSorted(true);
//     setCompleted(false);
//     setInProgress(false);
//     return;
//   }
//
//   const { a, bMin, b, swappers } = selectionState;
//
//   if (a >= list.length - 1) {
//     setSelectionState((s) => ({ ...s, a: list.length }));
//     setCompleted(true);
//     return
//   }
//
//   if (b >= list.length) {
//     const temp = [...list]
//     if (bMin !== a) {
//       [temp[bMin], temp[a]] = [temp[a], temp[bMin]]
//     }
//     setList(temp)
//     const newA = a + 1
//     const newBMin = newA
//     const newB = newA + 1
//     setSelectionState((s) => ({...s, a: newA, b: newB, bMin: newBMin}))
//     return;
//   }
//
//   if (list[b] >= list[bMin]) {
//     setSelectionState((s) => ({...s, b: b + 1}))
//     return
//   }
//
//   setSelectionState((s) => ({...s, b: b + 1, bMin: b}))
// }
