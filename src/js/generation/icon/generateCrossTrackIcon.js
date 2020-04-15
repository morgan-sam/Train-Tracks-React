import { convertRemToPx } from 'js/utility/utilityFunctions';

export const generateCrossTrackIcon = (tileRemSize) => {
	const tilePixelSize = convertRemToPx(tileRemSize);
	const canvas = generateCanvas(tilePixelSize);
	const image = canvas.toDataURL('image/png');
	return image;
};

const generateCanvas = (tilePixelSize) => {
	let canvas = document.createElement('canvas');

	canvas.width = tilePixelSize;
	canvas.height = tilePixelSize;
	canvas.context = drawWhiteBackground(canvas);
	canvas.context = clearCross(canvas, tilePixelSize / 3);
	return canvas;
};

const drawWhiteBackground = (canvas) => {
	let context = canvas.getContext('2d');
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	return context;
};

const clearCross = (canvas, radius) => {
	let context = canvas.getContext('2d');
	let x = canvas.width / 2;
	let y = canvas.height / 2;
	const cw = 6; //cross width
	const cl = 40; //cross length
	context.save();
	context.beginPath();
	context.translate(x, y);
	context.rotate(45 * Math.PI / 180);
	context.rect(-2, -cl / 2, cw, cl);
	context.rotate(90 * Math.PI / 180);
	context.rect(-2, -cl / 2, cw, cl);
	context.clip();
	context.translate(-x, -y);
	context.clearRect(0, 0, canvas.width, canvas.height);
};
