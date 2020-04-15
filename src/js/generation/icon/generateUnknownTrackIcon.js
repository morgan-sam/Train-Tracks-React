import { convertRemToPx } from 'js/utility/utilityFunctions';

export const generateUnknownTrackIcon = (tileRemSize) => {
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
	canvas.context = clearCircle(canvas, tilePixelSize / 3);
	return canvas;
};

const drawWhiteBackground = (canvas) => {
	let context = canvas.getContext('2d');
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	return context;
};

const clearCircle = (canvas, radius) => {
	let context = canvas.getContext('2d');
	let x = canvas.width / 2;
	let y = canvas.height / 2;
	context.save();
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, true);
	context.clip();
	context.clearRect(x - radius, y - radius, radius * 2, radius * 2);
	context.restore();
};
