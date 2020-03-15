import curvedtrack from '../../img/curvedtrack.png';
import straighttrack from '../../img/straighttrack.png';

export const convertDirectionArrayToRailTypes = (dirArr) => {
	let previousTileRailType, currentHoverTileRailType;

	if (dirArr.length === 1) {
		if (dirArr[0] % 2 === 0) previousTileRailType = 'vertical';
		if (dirArr[0] % 2 === 1) previousTileRailType = 'horizontal';

		currentHoverTileRailType = previousTileRailType;
	}
	if (dirArr.length === 2) {
		if (dirArr[0] % 2 === 0 && dirArr[1] % 2 === 0) previousTileRailType = 'vertical';
		if (dirArr[0] % 2 === 1 && dirArr[1] % 2 === 1) previousTileRailType = 'horizontal';

		if ((dirArr[0] === 0 && dirArr[1] === 1) || (dirArr[0] === 3 && dirArr[1] === 2))
			previousTileRailType = 'bottomRightCorner';
		if ((dirArr[0] === 1 && dirArr[1] === 2) || (dirArr[0] === 0 && dirArr[1] === 3))
			previousTileRailType = 'bottomLeftCorner';
		if ((dirArr[0] === 2 && dirArr[1] === 3) || (dirArr[0] === 1 && dirArr[1] === 0))
			previousTileRailType = 'topLeftCorner';
		if ((dirArr[0] === 3 && dirArr[1] === 0) || (dirArr[0] === 2 && dirArr[1] === 1))
			previousTileRailType = 'topRightCorner';

		currentHoverTileRailType = dirArr[1] % 2 === 0 ? 'vertical' : 'horizontal';
	}
	return [ previousTileRailType, currentHoverTileRailType ];
};

export const convertRailTypeToTrackImage = (railType) => {
	let trackData;
	switch (railType) {
		case 'vertical':
			trackData = {
				trackType: straighttrack,
				trackRotation: 0
			};
			break;
		case 'horizontal':
			trackData = {
				trackType: straighttrack,
				trackRotation: 90
			};
			break;
		case 'bottomLeftCorner':
			trackData = {
				trackType: curvedtrack,
				trackRotation: 0
			};
			break;
		case 'topLeftCorner':
			trackData = {
				trackType: curvedtrack,
				trackRotation: 90
			};
			break;
		case 'topRightCorner':
			trackData = {
				trackType: curvedtrack,
				trackRotation: 180
			};
			break;
		case 'bottomRightCorner':
			trackData = {
				trackType: curvedtrack,
				trackRotation: 270
			};
			break;
		case 'T':
			trackData = {
				trackType: railType,
				trackRotation: 'none'
			};
			break;
		case 'X':
			trackData = {
				trackType: railType,
				trackRotation: 'none'
			};
			break;
		default:
			trackData = { trackType: 'none', trackRotation: 'none' };
	}
	return trackData;
};

export const convertButtonClassToRailType = (e) => {
	let railType;
	if (e.target.classList.contains('axisButton')) {
		if (e.target.classList.contains('top') || e.target.classList.contains('bottom')) {
			railType = 'vertical';
		}
		if (e.target.classList.contains('right') || e.target.classList.contains('left')) {
			railType = 'horizontal';
		}
	}
	if (e.target.classList.contains('cornerButton')) {
		if (e.target.classList.contains('top-left')) {
			railType = 'topLeftCorner';
		}
		if (e.target.classList.contains('top-right')) {
			railType = 'topRightCorner';
		}
		if (e.target.classList.contains('bottom-left')) {
			railType = 'bottomLeftCorner';
		}
		if (e.target.classList.contains('bottom-right')) {
			railType = 'bottomRightCorner';
		}
	}
	if (e.target.classList.contains('centreButton')) {
		railType = 'T';
	}
	return railType;
};
