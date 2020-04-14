///UTILITY FUNCTIONS

export const randomIntFromInterval = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
};

export const removeArrayValue = (array, value) => {
	if (isNonEmptyArray(array)) {
		const index = array.indexOf(value);
		if (index > -1) {
			array.splice(index, 1);
		}
		return array;
	} else {
		return null;
	}
};

export const findIndexOfArrayInMatrix = (array, matrix) => {
	let index = -1;
	for (let i = 0; i < matrix.length; i++) {
		if (compareArrays(array, matrix[i])) index = i;
	}
	return index;
};

export const compareArrays = (arr1, arr2) => {
	let arrEqual = false;
	if (arr1.length === arr2.length) {
		arrEqual = arr1.every((v, i) => v === arr2[i]);
	}
	return arrEqual;
};

export const getIndexOfLongestArrayInMatrix = (matrix) => {
	let index = -1;
	let curMaxLength = 0;
	for (let i = 0; i < matrix.length; i++) {
		if (matrix[i].length > curMaxLength) {
			index = i;
			curMaxLength = matrix[i].length;
		}
	}
	return index;
};

export const isNonEmptyArray = (array) => {
	//return false if equal to [] or data type other than array
	return Array.isArray(array) && array.length > 0;
};

export const print = (value) => {
	console.log(JSON.parse(JSON.stringify(value)));
};

export const removeDuplicateArraysFromMatrix = (matrix) => {
	return matrix.filter((el, loopIndex) => {
		const elIndex = findIndexOfArrayInMatrix(el, matrix);
		if (loopIndex === elIndex) return true;
		else return false;
	});
};

export const removeNonDuplicateArraysFromMatrix = (matrix) => {
	return matrix.filter((el, loopIndex) => {
		const elIndex = findIndexOfArrayInMatrix(el, matrix);
		if (loopIndex === elIndex) return false;
		else return true;
	});
};

export const removeArraysFromMatrix = (arrays, matrix) => {
	arrays.forEach(function(arr) {
		matrix = matrix.filter((el) => !compareArrays(el, arr));
	});
	return matrix;
};

export const getRandomSeed = () => {
	return Math.floor(Math.random() * Math.pow(10, 15));
};

export const convertRemToPx = (rem) => {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const checkIfArrayIsInMatrix = (array, matrix) => {
	const count = matrix.filter((el) => compareArrays(array, el));
	return Boolean(count.length);
};

export const findCommonArraysOfAllMatrices = (arrayOfMatrices) => {
	const matricesUnique = arrayOfMatrices.map((mat) => removeDuplicateArraysFromMatrix(mat));
	let commonArrays = matricesUnique[0];
	for (let i = 0; i < matricesUnique.length - 1; i++) {
		let combinedArrays = [ ...commonArrays, ...matricesUnique[i + 1] ];
		commonArrays = removeNonDuplicateArraysFromMatrix(combinedArrays);
	}
	return commonArrays;
};

export const randomArrayEntry = (array) => {
	return array[randomIntFromInterval(0, array.length - 1)];
};

export const shiftPushArray = (array, items) => {
	return array.slice(items.length).concat(items);
};

export const halveArray = (array) => {
	const halfIndex = Math.floor(array.length / 2);
	return array.slice(0, halfIndex);
};

export const shuffleArray = (array) => {
	let remaining = array.length;
	let temp, index;
	while (remaining) {
		index = Math.floor(Math.random() * remaining);
		remaining--;
		temp = array[remaining];
		array[remaining] = array[index];
		array[index] = temp;
	}

	return array;
};
