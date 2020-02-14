import curvedtrack from '../../img/curvedtrack.png';
import straighttrack from '../../img/straighttrack.png';

export const generateMapIcon = async () => {
	const canvas = await generateCanvas();
	const image = canvas.toDataURL('image/png');
	return image;
};

const generateCanvas = async () => {
	let canvas = document.createElement('canvas');
	canvas.width = 250;
	canvas.height = 250;
	let context = canvas.getContext('2d');
	context.fillStyle = 'blue';
	context.fillRect(0, 0, 250, 250);
	let railTrack = await loadImage(straighttrack);
	context.drawImage(railTrack, 0, 0, 250, 250);
	return canvas;
};

const loadImage = (imgURL) => {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = imgURL;
	});
};
