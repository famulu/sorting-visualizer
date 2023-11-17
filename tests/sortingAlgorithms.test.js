import { quickSortGenerator, hoareQuickSortGenerator, selectionSortGenerator, bubbleSortGenerator, insertionSortGenerator, mergeSortGenerator } from '../src/sortingAlgorithms';
import generateArray from "../src/generateArray";

import { test, expect } from 'vitest';
const sortingAlgorithms = [
    quickSortGenerator,
    hoareQuickSortGenerator,
    selectionSortGenerator,
    bubbleSortGenerator,
    insertionSortGenerator,
    mergeSortGenerator
];

sortingAlgorithms.forEach((sortGenerator) => {
    const algorithmName = sortGenerator.name;

    test(`${algorithmName} sorts an array of integers`, () => {
        const array = [5, 3, 8, 4, 6];
        const generator = sortGenerator(array);
        let sortedArray;
        for (let result of generator) {
            sortedArray = result.array;
        }
        expect(sortedArray).toEqual([3, 4, 5, 6, 8]);
    });

    test(`${algorithmName} sorts an already sorted array`, () => {
        const array = [1, 2, 3, 4, 5];
        const generator = sortGenerator(array);
        let sortedArray;
        for (let result of generator) {
            sortedArray = result.array;
        }
        expect(sortedArray).toEqual([1, 2, 3, 4, 5]);
    });

    test(`${algorithmName} sorts a reverse sorted array`, () => {
        const array = [5, 4, 3, 2, 1];
        const generator = sortGenerator(array);
        let sortedArray;
        for (let result of generator) {
            sortedArray = result.array;
        }
        expect(sortedArray).toEqual([1, 2, 3, 4, 5]);
    });

    test(`${algorithmName} sorts an array with duplicate elements`, () => {
        const array = [5, 3, 8, 4, 6, 3, 5];
        const generator = sortGenerator(array);
        let sortedArray;
        for (let result of generator) {
            sortedArray = result.array;
        }
        expect(sortedArray).toEqual([3, 3, 4, 5, 5, 6, 8]);
    });

    test(`${algorithmName} sorts a large array of random integers`, () => {
        const array = generateArray(1000); // generates an array of 1000 random integers
        const generator = sortGenerator(array);
        let sortedArray;
        for (let result of generator) {
            sortedArray = result.array;
        }
        for (let i = 0; i < sortedArray.length - 1; i++) {
            expect(sortedArray[i]).toBeLessThanOrEqual(sortedArray[i + 1]);
        }
    });
});
