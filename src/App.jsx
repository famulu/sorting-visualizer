import { useState } from "react";

export default function App() {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(Math.ceil(Math.random() * 100));
  }

  const [list, setList] = useState(arr);

  function sort() {
    function merge(left, right) {
      let sortedArr = []; // the sorted items will go here
      while (left.length && right.length) {
        // Insert the smallest item into sortedArr
        if (left[0] < right[0]) {
          sortedArr.push(left.shift());
        } else {
          sortedArr.push(right.shift());
        }
      }
      // Use spread operators to create a new array, combining the three arrays
      return [...sortedArr, ...left, ...right];
    }

    function mergeSort(arr) {
      // Base case
      if (arr.length <= 1) return arr;
      let mid = Math.floor(arr.length / 2);
      // Recursive calls
      let left = mergeSort(arr.slice(0, mid));
      let right = mergeSort(arr.slice(mid));
      return merge(left, right);
    }

    setList(mergeSort(list));
  }

  return (
    <div className="px-4 pt-2">
      <div className="flex justify-center">
        <button
          onClick={sort}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 text-slate-50 p-2 rounded-lg drop-shadow-lg transition ease-in-out duration-500 hover:scale-110"
        >
          Sort
        </button>
      </div>
      <div className="flex flex-row h-screen gap-2">
        {list.map((num, i) => (
          <div
            key={i}
            style={{ height: `${num}%` }}
            className="bg-slate-800 w-4"
          ></div>
        ))}
      </div>
    </div>
  );
}
