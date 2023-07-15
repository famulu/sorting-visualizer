function selectionSort(array) {
  const temp = [...array];
  for (let i = 0; i < temp.length - 1; i++) {
    let jMin = i;
    for (let j = i + 1; j < temp.length; j++) {
      if (temp[j] < temp[jMin]) {
        jMin = j;
      }
    }

    if (jMin !== i) {
      [temp[jMin], temp[i]] = [temp[i], temp[jMin]];
    }
  }
  return temp;
}
