export default function generateArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.ceil(Math.random() * 100));
  }
  return arr;
}
