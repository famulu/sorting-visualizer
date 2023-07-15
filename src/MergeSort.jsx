import { useState } from "react";

export default function MergeSort({ list, setList, inProgress, finished }) {
  const initialState = {
    width: 1,
    left: 0,
    right: Math.min(1, list.length),
    end: Math.min(2, list.length),
    a: 0,
    b: Math.min(1, list.length),
  };
  const [width, setWidth] = useState(initialState.width);
  const [left, setLeft] = useState(initialState.left);
  const [right, setRight] = useState(initialState.right);
  const [end, setEnd] = useState(initialState.end);
  const [a, setA] = useState(initialState.a);
  const [b, setB] = useState(initialState.b);
  const [swappers, setSwappers] = useState({
    indices: [],
    swapped: false,
  });
  const [completed, setCompleted] = useState(false);

  if (inProgress) {
    const delay = completed ? 500 : Math.max(0, Math.floor(2400 / list.length));
    setTimeout(handleClick, delay);
  }

  function handleClick() {
    if (!inProgress) {
      setLeft(initialState.left);
      setWidth(initialState.width);
      setA(initialState.a);
      setB(initialState.b);
      setRight(initialState.right);
      setEnd(initialState.end);
      return;
    }

    if (completed) {
      setCompleted(false);
      finished();

      return;
    }

    let newA = a;
    let newB = b;
    let newRight = right;

    if (swappers.swapped) {
      newB = b + 1;
      newA = a + 1;
      newRight = right + 1;
      setSwappers({ indices: [], swapped: false });
    } else if (swappers.indices.length > 0) {
      let i = b;
      let temp = [...list];
      while (i > a) {
        [temp[i], temp[i - 1]] = [temp[i - 1], temp[i]];
        i--;
      }
      setSwappers({ indices: [a, a + 1], swapped: true });
      setList([...temp]);
      return;
    } else if (a < right && (b >= end || list[a] <= list[b])) {
      newA = a + 1;
    } else {
      setSwappers({ indices: [a, b], swapped: false });
      return;
    }
    setA(newA);
    setB(newB);
    setRight(newRight);

    if (newA >= newRight || newB >= end) {
      let newLeft = left + 2 * width;
      let newRight = newLeft + width;
      if (newLeft < list.length && newRight < list.length) {
        setLeft(newLeft);
        setRight(newRight);
        setEnd(Math.min(newLeft + 2 * width, list.length));

        setA(newLeft);
        setB(newRight);
      } else {
        let newWidth = width * 2;
        if (newWidth < list.length) {
          setWidth(newWidth);

          const newLeft = 0;
          setLeft(newLeft);

          const newRight = Math.min(newLeft + newWidth, list.length);
          setRight(newRight);

          setEnd(Math.min(newLeft + 2 * newWidth, list.length));

          setA(newLeft);
          setB(newRight);
        } else {
          setCompleted(true);
        }
      }
    }
  }

  return (
    <div className="p-4 pb-16 h-screen flex flex-col bg-slate-300">
      <div className="flex gap-0.5 flex-grow justify-center">
        {list.map((num, i) => {
          let bg = "bg-slate-800";
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
