import { useState } from "react";

export default function App() {
  const [list, setList] = useState(generateArray);
  const [loopIndices, setLoopIndices] = useState({
    i: 0,
    j: 0,
    maxJ: list.length - 1,
  });
  const [toSwap, setToSwap] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [clicked, setClicked] = useState(false);

  if (clicked && completed !== 2) {
    setTimeout(handleClick, 50);
  }

  function handleClick() {
    setClicked(true);

    if (completed > 0) {
      setCompleted(2);
      setClicked(false);
      return;
    }

    if (swapped) {
      setSwapped(false);
      return;
    }
    const copy = [...list];
    const { j } = loopIndices;
    if (toSwap) {
      [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
      setList(copy);
      setToSwap(false);
      setSwapped(true);
      return;
    } else if (copy[j] > copy[j + 1]) {
      setToSwap(true);
      return;
    }

    loopIndices.j += 1;
    if (loopIndices.j >= loopIndices.maxJ) {
      loopIndices.i += 1;
      loopIndices.j = 0;
      loopIndices.maxJ -= 1;
    }

    if (loopIndices.i === list.length - 1) {
      setCompleted(1);
    }

    setLoopIndices({ ...loopIndices });
  }

  const bgColor = toSwap || swapped ? "bg-red-300" : "bg-green-300";

  const buttonBg = clicked
    ? "bg-slate-200"
    : "bg-gradient-to-r from-indigo-500 to-pink-500";

  return (
    <div className="px-4 pt-2">
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          type="button"
          className={`${buttonBg} text-slate-50 p-2 rounded-lg drop-shadow-lg transition ease-in-out duration-500 hover:scale-110`}
        >
          Sort
        </button>
      </div>
      <div className="flex flex-row h-screen gap-2">
        {list.map((num, i) => {
          let bg = "bg-slate-800";
          if ([loopIndices.j, loopIndices.j + 1].includes(i)) {
            bg = bgColor;
          }
          if (i > loopIndices.maxJ) {
            bg = "bg-purple-300";
          }

          if (completed === 1) {
            bg = "bg-green-300";
          }

          if (completed === 2) {
            bg = "bg-purple-300";
          }

          return (
            <div
              key={i}
              style={{ height: `${num}%` }}
              className={`w-4 ${bg} flex-shrink-0`}
            />
          );
        })}
      </div>
    </div>
  );
}

function generateArray() {
  const arr = [];
  for (let i = 0; i < 25; i++) {
    arr.push(Math.ceil(Math.random() * 100));
  }
  return arr;
}
