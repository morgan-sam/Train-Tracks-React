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

	canvas.width = 250;
	canvas.height = 250;
	const iconTileWidth = canvas.width / (mapWidth + 1);
	const iconTileHeight = canvas.height / (mapHeight + 1);

	let context = canvas.getContext('2d');

	let curvedTrackImage = await loadImage(curvedtrack);
	let straightTrackImage = await loadImage(straighttrack);

	const drawRotatedImage = (el) => {
		let rotation = getRotationFromRailType(el.railType);
		context.save();
		context.translate(
			el.tile[0] * iconTileWidth + iconTileWidth / 2,
			(el.tile[1] + 1) * iconTileHeight + iconTileHeight / 2
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
			(el.tile[1] + 1) * iconTileHeight,
			iconTileWidth,
			iconTileHeight
		);
	};

	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);

	mapObject.tracks.forEach((el) => {
		if (el.defaultTrack) {
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
		for (let i = 0; i < (mapWidth + 1) * (mapHeight + 1); i++) {
			let x = i % (mapWidth + 1);
			let y = Math.floor(i / (mapHeight + 1));
			if (x === mapWidth || y === 0) drawHeaderBox(x, y);
			context.fillStyle = 'black';
			context.strokeRect(x * iconTileWidth, y * iconTileHeight, iconTileWidth, iconTileHeight);
		}
	})();

	function drawHeaderBox(x, y) {
		drawHeaderBoxBackground(x, y);
		drawHeaderBoxText(x, y);
	}

	function drawHeaderBoxBackground(x, y) {
		context.fillStyle = '#FFE4B5';
		context.fillRect(x * iconTileWidth, y * iconTileHeight, iconTileWidth, iconTileHeight);
	}

	function drawHeaderBoxText(x, y) {
		console.log(mapObject);
		context.fillStyle = 'black';
		context.font = '20px Georgia';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText('0', (x + 0.5) * iconTileWidth, (y + 0.5) * iconTileHeight);
	}

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
