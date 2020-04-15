import curvedtrack from 'img/curvedtrack.png';
import straighttrack from 'img/straighttrack.png';
import { convertRemToPx } from 'js/utility/utilityFunctions';

export const generateMapIcon = async (mapObject, complete) => {
	const options = {
		headers: true,
		complete,
		dimensions: 250,
		cutOut: false
	};
	const canvas = await generateCanvas(mapObject, options);
	const image = canvas.toDataURL('image/png');
	return image;
};

export const generateMapBackground = async (mapObject, remSize) => {
	const options = {
		headers: false,
		complete: false,
		dimensions: convertRemToPx(remSize) * mapObject.headerLabels.x.length,
		cutOut: true
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

const getTrackImages = async () => {
	return await Promise.all([ loadImage(straighttrack), loadImage(curvedtrack) ]);
};

const generateCanvasObject = async (mapObject, options) => {
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');

	canvas.width = options.dimensions;
	canvas.height = options.dimensions;

	const mapWidth = mapObject.headerLabels.x.length;
	const mapHeight = mapObject.headerLabels.y.length;
	const gridMapWidth = mapWidth + options.headers;
	const gridMapHeight = mapHeight + options.headers;
	const iconTileWidth = canvas.width / gridMapWidth;
	const iconTileHeight = canvas.height / gridMapHeight;
	const [ straightTrackImage, curvedTrackImage ] = await getTrackImages();

	return {
		canvas,
		context,
		iconTile: {
			width: iconTileWidth,
			height: iconTileHeight
		},
		map: {
			width: mapWidth,
			height: mapHeight
		},
		gridMap: {
			width: gridMapWidth,
			height: gridMapHeight
		},
		trackImage: {
			straight: straightTrackImage,
			curved: curvedTrackImage
		},
		options
	};
};

const generateCanvas = async (mapObject, options) => {
	let canvasObj = await generateCanvasObject(mapObject, options);
	canvasObj.context = drawWhiteBackground(canvasObj);
	canvasObj.context = drawAllTracks(mapObject, canvasObj);
	canvasObj.context = drawGrid(mapObject, canvasObj);
	if (options.cutOut) canvasObj.context = cutOutBackgroundBox(canvasObj);

	return canvasObj.canvas;
};

const loadImage = (imgURL) => {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = imgURL;
	});
};

const drawRotatedImage = (el, canvasObj) => {
	const { context, options } = canvasObj;
	const { width, height } = canvasObj.iconTile;
	const { straight, curved } = canvasObj.trackImage;
	let rotation = getRotationFromRailType(el.railType);
	context.save();
	context.translate(el.tile[0] * width + width / 2, (el.tile[1] + options.headers) * height + height / 2);
	context.rotate(rotation * (Math.PI / 180));
	context.drawImage(
		el.railType === 'vertical' || el.railType === 'horizontal' ? straight : curved,
		-width / 2,
		-height / 2,
		width,
		height
	);
	context.restore();
	return context;
};

const drawStraightImage = (el, canvasObj) => {
	const { context, options } = canvasObj;
	const { width, height } = canvasObj.iconTile;
	const { straight, curved } = canvasObj.trackImage;
	context.drawImage(
		el.railType === 'vertical' || el.railType === 'horizontal' ? straight : curved,
		el.tile[0] * width,
		(el.tile[1] + options.headers) * height,
		width,
		height
	);
	return context;
};

const drawWhiteBackground = (canvasObj) => {
	const { canvas, context } = canvasObj;
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	return context;
};

const drawAllTracks = (mapObject, canvasObj) => {
	let { options, context } = canvasObj;
	mapObject.tracks.forEach((el) => {
		if (options.complete || el.defaultTrack) {
			if (
				el.railType === 'horizontal' ||
				el.railType === 'topLeftCorner' ||
				el.railType === 'topRightCorner' ||
				el.railType === 'bottomRightCorner'
			) {
				context = drawRotatedImage(el, canvasObj);
			} else {
				context = drawStraightImage(el, canvasObj);
			}
		}
	});
	return context;
};

function drawGrid(mapObject, canvasObj) {
	let { context, gridMap, iconTile, options, map } = canvasObj;
	for (let i = 0; i < gridMap.width * gridMap.height; i++) {
		let x = i % gridMap.width;
		let y = Math.floor(i / gridMap.height);
		if (options.headers && (x === map.width || y === 0)) {
			const drawObj = {
				tile: { x, y },
				mapObject
			};
			context = drawHeaderBox(drawObj, canvasObj);
		}
		context.fillStyle = 'black';
		context.strokeRect(x * iconTile.width, y * iconTile.height, iconTile.width, iconTile.height);
	}
	return context;
}

function drawHeaderBox(drawObj, canvasObj) {
	let context = canvasObj.context;
	let mapWidth = canvasObj.map.width;
	const { x, y } = drawObj.tile;
	context = drawHeaderBoxBackground(drawObj.tile, canvasObj);
	if ((y === 0 && x !== mapWidth) || (x === mapWidth && y !== 0)) context = drawHeaderBoxText(drawObj, canvasObj);
	return context;
}

function drawHeaderBoxBackground(tile, canvasObj) {
	let { context, iconTile } = canvasObj;
	const { x, y } = tile;
	context.fillStyle = '#FFE4B5';
	context.fillRect(x * iconTile.width, y * iconTile.height, iconTile.width, iconTile.height);
	return context;
}

function drawHeaderBoxText(drawObj, canvasObj) {
	let { context, iconTile } = canvasObj;
	const { x, y } = drawObj.tile;
	context.fillStyle = 'black';
	context.font = '1.5rem Georgia';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText(getHeaderBoxText(drawObj, canvasObj), (x + 0.5) * iconTile.width, (y + 0.5) * iconTile.height);
	return context;
}

function getHeaderBoxText(drawObj, canvasObj) {
	const mapWidth = canvasObj.map.width;
	const mapObject = drawObj.mapObject;
	const { x, y } = drawObj.tile;
	let headerText = 'ERROR';
	if (y === 0 && x !== mapWidth) headerText = mapObject.headerLabels.x[x];
	if (x === mapWidth && y !== 0) headerText = mapObject.headerLabels.y[y - 1];
	return headerText;
}

function cutOutBackgroundBox(canvasObj) {
	let { context, iconTile, map } = canvasObj;
	const boxWidth = 250;
	const boxHeight = 150;
	context.clearRect(
		(map.width + 1) * iconTile.width / 2 - boxWidth / 2,
		(map.height - 1) * iconTile.height / 2 - boxHeight / 2,
		boxWidth,
		boxHeight
	);
	context.strokeRect(
		(map.width + 1) * iconTile.width / 2 - boxWidth / 2,
		(map.height - 1) * iconTile.height / 2 - boxHeight / 2,
		boxWidth,
		boxHeight
	);
	return context;
}
