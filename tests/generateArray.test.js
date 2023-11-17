import generateArray from "../src/generateArray";
import { test, expect } from "vitest";

test("generateArray creates an array of the correct size", () => {
  const size = 10;
  const array = generateArray(size);
  expect(array.length).toBe(size);
});

test("generateArray creates an array with elements in the range 1 to 100", () => {
  const size = 100;
  const array = generateArray(size);
  array.forEach((element) => {
    expect(element).toBeGreaterThanOrEqual(1);
    expect(element).toBeLessThanOrEqual(100);
  });
});
