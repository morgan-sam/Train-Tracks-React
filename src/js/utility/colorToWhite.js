export const colorToWhiteArray = (hexColor, numberOfShades) => {
	const colorArray = convertHexToRgbArray(hexColor);
	return createColorMatrixByStep(colorArray, numberOfShades);
};

function convertHexToRgbArray(hexColor) {
	const parseStringAsArray = hexColor.replace('#', '').match(/.{1,2}/g);
	return parseStringAsArray.map((el) => parseInt(Number(`0x${el}`), 10));
}
function getColorStepValues(colorArray, numberOfShades) {
	return colorArray.map((el) => (255 - el) / (numberOfShades - 1));
}

function createColorMatrixByStep(colorArray, numberOfShades) {
	let colorMatrix = [];
	const colorStepValues = getColorStepValues(colorArray, numberOfShades);
	for (let iteration = 0; iteration < numberOfShades; iteration++) {
		const color = colorArray.map((el, index) => el + iteration * colorStepValues[index]);
		colorMatrix.push(color);
	}
	return colorMatrix;
}

console.log(colorToWhiteArray('#008080', 10));
