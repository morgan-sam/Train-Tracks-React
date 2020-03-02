import curvedtrack from '../../img/curvedtrack.png';
import straighttrack from '../../img/straighttrack.png';
import { print } from '../utility/utilityFunctions';

export const generateMapIcon = async (mapObject, complete = false) => {
	const options = {
		headers: true,
		complete: true,
		dimensions: 250
	};
	const canvas = await generateCanvas(mapObject, options);
	const image = canvas.toDataURL('image/png');
	return image;
};

export const generateMapBackground = async (mapObject) => {
	const options = {
		headers: false,
		complete: false,
		dimensions: 64 * mapObject.headerLabels.x.length
	};
	const canvas = await generateCanvas(mapObject, options);
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

const generateCanvas = async (mapObject, options) => {
	let canvas = document.createElement('canvas');

	const mapWidth = mapObject.headerLabels.x.length;
	const mapHeight = mapObject.headerLabels.y.length;

	canvas.width = options.dimensions;
	canvas.height = options.dimensions;
	const gridMapWidth = mapWidth + options.headers;
	const gridMapHeight = mapHeight + options.headers;
	print(gridMapWidth, gridMapHeight);
	const iconTileWidth = canvas.width / gridMapWidth;
	const iconTileHeight = canvas.height / gridMapHeight;

	let context = canvas.getContext('2d');

	let curvedTrackImage = await loadImage(curvedtrack);
	let straightTrackImage = await loadImage(straighttrack);

	const drawRotatedImage = (el) => {
		let rotation = getRotationFromRailType(el.railType);
		context.save();
		context.translate(
			el.tile[0] * iconTileWidth + iconTileWidth / 2,
			(el.tile[1] + options.headers) * iconTileHeight + iconTileHeight / 2
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

	const drawStraightImage = (el) => {
		context.drawImage(
			el.railType === 'vertical' || el.railType === 'horizontal' ? straightTrackImage : curvedTrackImage,
			el.tile[0] * iconTileWidth,
			(el.tile[1] + options.headers) * iconTileHeight,
			iconTileWidth,
			iconTileHeight
		);
	};

	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);

	mapObject.tracks.forEach((el) => {
		if (options.complete || el.defaultTrack) {
			if (
				el.railType === 'horizontal' ||
				el.railType === 'topLeftCorner' ||
				el.railType === 'topRightCorner' ||
				el.railType === 'bottomRightCorner'
			) {
				drawRotatedImage(el);
			} else {
				drawStraightImage(el);
			}
		}
	});

	(function drawGrid() {
		for (let i = 0; i < gridMapWidth * gridMapHeight; i++) {
			let x = i % gridMapWidth;
			let y = Math.floor(i / gridMapHeight);
			if (options.headers && (x === mapWidth || y === 0)) drawHeaderBox(x, y);
			context.fillStyle = 'black';
			context.strokeRect(x * iconTileWidth, y * iconTileHeight, iconTileWidth, iconTileHeight);
		}
	})();

	function drawHeaderBox(x, y) {
		drawHeaderBoxBackground(x, y);
		if ((y === 0 && x !== mapWidth) || (x === mapWidth && y !== 0)) drawHeaderBoxText(x, y);
	}

	function drawHeaderBoxBackground(x, y) {
		context.fillStyle = '#FFE4B5';
		context.fillRect(x * iconTileWidth, y * iconTileHeight, iconTileWidth, iconTileHeight);
	}

	function drawHeaderBoxText(x, y) {
		context.fillStyle = 'black';
		context.font = '1.5rem Georgia';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(getHeaderBoxText(x, y), (x + 0.5) * iconTileWidth, (y + 0.5) * iconTileHeight);
	}

	function getHeaderBoxText(x, y) {
		let headerText = 'ERROR';
		if (y === 0 && x !== mapWidth) headerText = mapObject.headerLabels.x[x];
		if (x === mapWidth && y !== 0) headerText = mapObject.headerLabels.y[y - 1];
		return headerText;
	}

	(function cutOutBackgroundBox() {
		const boxWidth = 250;
		const boxHeight = 150;
		context.clearRect(
			(mapWidth + 1) * iconTileWidth / 2 - boxWidth / 2,
			(mapHeight - 1) * iconTileHeight / 2 - boxHeight / 2,
			boxWidth,
			boxHeight
		);
		context.strokeRect(
			(mapWidth + 1) * iconTileWidth / 2 - boxWidth / 2,
			(mapHeight - 1) * iconTileHeight / 2 - boxHeight / 2,
			boxWidth,
			boxHeight
		);
	})();

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
