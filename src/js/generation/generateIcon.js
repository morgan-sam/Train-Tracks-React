import curvedtrack from '../../img/curvedtrack.png';
import straighttrack from '../../img/straighttrack.png';

export const generateMapIcon = async (mapObject) => {
	const canvas = await generateCanvas();
	const image = await canvas.toDataURL('image/png');
	return image;
};

function generateCanvas() {
	let canvas = document.createElement('canvas');
	canvas.width = 200;
	canvas.height = 200;
	let context = canvas.getContext('2d');

	context.beginPath();
	// const mapWidth = mapObject.headerLabels.x.length;
	// const mapHeight = mapObject.headerLabels.y.length;

	context.fillStyle = 'blue';
	context.fillRect(0, 0, 200, 200);
	context.fillStyle = 'red';
	context.fillRect(0, 0, 150, 100);
	const img = new Image();
	img.onload = function() {
		context.drawImage(img, 0, 0);
	};
	img.src = straighttrack;

	context.stroke();
	return canvas;
}
