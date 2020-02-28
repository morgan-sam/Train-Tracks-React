export const colorToWhiteArray = (hexColor, numberOfShades) => {
	const colorArray = convertHexToRgbArray(hexColor);
	const colorMatrix = createColorMatrixByStep(colorArray, Math.ceil(numberOfShades));
	return colorMatrix.map((el) => convertRgbArrayToHex(el));
};

function convertHexToRgbArray(hexColor) {
	const parseStringAsArray = hexColor.replace('#', '').match(/.{1,2}/g);
	return parseStringAsArray.map((el) => parseInt(Number(`0x${el}`), 10));
}

function convertRgbArrayToHex(rgbArray) {
	console.log(rgbArray);
	const hexCode = rgbArray
		.map(function(el) {
			const value = el.toString(16);
			if (value === '0') return '00';
			else return value;
		})
		.join('');
	return '#' + hexCode;
}

function getColorStepValues(colorArray, numberOfShades) {
	return colorArray.map((el) => (255 - el) / (numberOfShades - 1));
}

function createColorMatrixByStep(colorArray, numberOfShades) {
	let colorMatrix = [];
	const colorStepValues = getColorStepValues(colorArray, numberOfShades);
	for (let iteration = 0; iteration < numberOfShades; iteration++) {
		const color = colorArray.map((el, index) => Math.floor(el + iteration * colorStepValues[index]));
		colorMatrix.push(color);
	}
	return colorMatrix;
}
