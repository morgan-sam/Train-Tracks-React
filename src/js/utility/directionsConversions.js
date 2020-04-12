import { compareArrays } from './utilityFunctions';

export const findDirectionFromMove = (currentMove, lastMove) => {
	let moveDirection;
	const moveCalc = differenceBetweenTwoMoves(currentMove, lastMove);
	if (compareArrays(moveCalc, [ 0, -1 ])) moveDirection = 0; //= 'up';
	if (compareArrays(moveCalc, [ 1, 0 ])) moveDirection = 1; //= 'right';
	if (compareArrays(moveCalc, [ 0, 1 ])) moveDirection = 2; //= 'down';
	if (compareArrays(moveCalc, [ -1, 0 ])) moveDirection = 3; //= 'left';
	return moveDirection;
};

function differenceBetweenTwoMoves(moveOne, moveTwo) {
	return [ moveOne[0] - moveTwo[0], moveOne[1] - moveTwo[1] ];
}

export const directionsToTrackRailType = (dirs) => {
	let railTypeArray = [];
	for (let i = 0; i < dirs.length; i++) {
		if ((dirs[i] === 0 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 2))
			railTypeArray.push('vertical');
		if ((dirs[i] === 1 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 3))
			railTypeArray.push('horizontal');
		if ((dirs[i] === 2 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 0))
			railTypeArray.push('topRightCorner');
		if ((dirs[i] === 3 && dirs[i + 1] === 2) || (dirs[i] === 0 && dirs[i + 1] === 1))
			railTypeArray.push('bottomRightCorner');
		if ((dirs[i] === 0 && dirs[i + 1] === 3) || (dirs[i] === 1 && dirs[i + 1] === 2))
			railTypeArray.push('bottomLeftCorner');
		if ((dirs[i] === 1 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 3))
			railTypeArray.push('topLeftCorner');
	}
	return railTypeArray;
};

export const getTilesInEachDirection = (currentTile, generatedTiles) => {
	let tilesInEachDirection = [];
	for (let i = 0; i < 4; i++) {
		let sign = Math.ceil((i % 3) / 2) * 2 + 1; //
		let lineTiles = generatedTiles.filter((tile) => tile[i % 2] === currentTile[i % 2]);
		let directionTiles = lineTiles.filter((tile) => tile[(i + 1) % 2] * -sign < currentTile[(i + 1) % 2] * -sign);
		tilesInEachDirection.push(directionTiles);
	}
	return tilesInEachDirection;
};
