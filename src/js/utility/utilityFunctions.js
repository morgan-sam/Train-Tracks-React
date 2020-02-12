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

export const compareArrays = (arr1, arr2) => {
	let arrEqual = false;
	if (arr1.length === arr2.length) {
		arrEqual = arr1.every((v, i) => v === arr2[i]);
	}
	return arrEqual;
};

export const isNonEmptyArray = (array) => {
	//return false if equal to [] or data type other than array
	return Array.isArray(array) && array.length > 0;
};

export const print = (value) => {
	console.log(JSON.parse(JSON.stringify(value)));
};
