import generateArray from "./generateArray";

function validateSorter(sorter) {
  if (typeof sorter !== "function") {
    throw new Error("sorter must be a function");
  }

  for (let i = 0; i < 1; i++) {
    for (let j = 10; j < 11; j++) {
      const array = generateArray(j);
      const sortedA = sorter(array);
      const sortedB = array.toSorted((a, b) => a - b);

      if (sortedA.length !== sortedB.length) {
        throw Error("Array lengths are not equal");
      }

      for (let k = 0; k < sortedA.length; k++) {
        if (sortedA[k] !== sortedB[k]) {
          console.log({ sortedA, sortedB });
          throw Error("Arrays are not equal");
        }
      }
    }
  }

  console.log("All tests passed!");
}
