import { randomIntFromInterval } from './utilityFunctions';
const ROYGBIV_HEX_CODES = [ '#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee' ];

export const generateRandomRGBColor = () => {
	let minValue = 100;
	const modAmount = 0.8;
	const r = randomIntFromInterval(minValue, 255);
	r > 255 - minValue / 2 ? (minValue *= modAmount) : (minValue /= modAmount);
	const g = randomIntFromInterval(minValue, 255);
	g > 255 - minValue / 2 ? (minValue *= modAmount) : (minValue /= modAmount);
	const b = randomIntFromInterval(minValue, 255);
	return `rgb(${[ r, g, b ]})`;
};

export const colorToWhiteArray = (hexColor, numberOfShades) => {
	const colorArray = convertHexToRgbArray(hexColor);
	const colorData = {
		colorOneArray: colorArray,
		colorTwoArray: [ 255, 255, 255 ],
		numberOfShades: Math.ceil(numberOfShades)
	};
	const colorMatrix = createColorMatrixByStep(colorData);
	return colorMatrix.map((el) => convertRgbArrayToHex(el));
};

function convertHexToRgbArray(hexColor) {
	const parseStringAsArray = hexColor.replace('#', '').match(/.{1,2}/g);
	return parseStringAsArray.map((el) => parseInt(Number(`0x${el}`), 10));
}

function convertRgbArrayToHex(rgbArray) {
	const hexCode = rgbArray
		.map(function(el) {
			const value = el.toString(16);
			if (value === '0') return '00';
			else return value;
		})
		.join('');
	return '#' + hexCode;
}

function getColorStepValues(colorData) {
	const { colorOneArray, colorTwoArray, numberOfShades } = colorData;
	return colorOneArray.map((el, i) => (colorTwoArray[i] - el) / (numberOfShades - 1));
}

function createColorMatrixByStep(colorData) {
	const { colorOneArray, numberOfShades } = colorData;
	let colorMatrix = [];
	const colorStepValues = getColorStepValues(colorData);
	for (let iteration = 0; iteration < numberOfShades; iteration++) {
		const color = colorOneArray.map((el, index) => Math.floor(el + iteration * colorStepValues[index]));
		colorMatrix.push(color);
	}
	return colorMatrix;
}

const colorToColorArray = (colorOne, colorTwo, numberOfShades) => {
	const colorOneArray = convertHexToRgbArray(colorOne);
	const colorTwoArray = convertHexToRgbArray(colorTwo);
	const colorData = {
		colorOneArray,
		colorTwoArray,
		numberOfShades: Math.ceil(numberOfShades)
	};
	const colorMatrix = createColorMatrixByStep(colorData);
	return colorMatrix.map((el) => convertRgbArrayToHex(el));
};

export const roygbivArray = () => {
	let roygbivArray = [];
	for (let i = 0; i < ROYGBIV_HEX_CODES.length - 1; i++) {
		const rainbowPart = colorToColorArray(ROYGBIV_HEX_CODES[i], ROYGBIV_HEX_CODES[i + 1], 100);
		roygbivArray.push(rainbowPart);
	}
	roygbivArray = roygbivArray.flat();
	return roygbivArray;
};
