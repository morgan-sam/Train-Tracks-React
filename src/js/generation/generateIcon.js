import curvedtrack from '../../img/curvedtrack.png';
import straighttrack from '../../img/straighttrack.png';

export const generateMapIcon = async (mapObject) => {
	const canvas = await generateCanvas(mapObject);
	const image = canvas.toDataURL('image/png');
	return image;
};
const getRotationFromRailType = (railType) => {
	let rotation;
	switch (railType) {
		case 'horizontal':
			rotation = 90;
			break;
		case 'topLeftCorner':
			rotation = 90;
			break;
		case 'topRightCorner':
			rotation = 180;
			break;
		case 'bottomRightCorner':
			rotation = 270;
			break;
		default:
			rotation = 0;
	}
	return rotation;
};

const generateCanvas = async (mapObject) => {
	let canvas = document.createElement('canvas');

	const mapWidth = mapObject.headerLabels.x.length;
	const mapHeight = mapObject.headerLabels.y.length;

	canvas.width = 300;
	canvas.height = 300;
	const iconTileWidth = canvas.width / mapWidth;
	const iconTileHeight = canvas.height / mapHeight;

	let context = canvas.getContext('2d');
	context.fillStyle = 'white';
	context.fillRect(0, 0, 300, 300);
	let curvedTrackImage = await loadImage(curvedtrack);
	let straightTrackImage = await loadImage(straighttrack);
	console.log(mapObject);

	const drawRotatedImage = (el) => {
		let rotation = getRotationFromRailType(el.railType);
		console.log(rotation);
		context.save();
		context.translate(
			el.tile[0] * iconTileWidth + iconTileWidth / 2,
			el.tile[1] * iconTileHeight + iconTileHeight / 2
		);
		context.rotate(rotation * (Math.PI / 180));
		context.drawImage(
			el.railType === 'vertical' || el.railType === 'horizontal' ? straightTrackImage : curvedTrackImage,
			-iconTileWidth / 2,
			-iconTileHeight / 2,
			iconTileWidth,
			iconTileHeight
		);
		context.restore();
	};
	mapObject.tracks.forEach((el) => {
		if (
			el.railType === 'horizontal' ||
			el.railType === 'topLeftCorner' ||
			el.railType === 'topRightCorner' ||
			el.railType === 'bottomRightCorner'
		) {
			drawRotatedImage(el);
		} else {
			context.drawImage(
				el.railType === 'vertical' || el.railType === 'horizontal' ? straightTrackImage : curvedTrackImage,
				el.tile[0] * iconTileWidth,
				el.tile[1] * iconTileHeight,
				iconTileWidth,
				iconTileHeight
			);
		}
	});

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
