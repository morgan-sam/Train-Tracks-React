import { compareArrays, findIndexOfArrayInMatrix } from 'js/utility/utilityFunctions';
import { removeOutOfBoundsMoves, getAdjacentTiles } from 'js/generation/map/genericGenMapFunctions';

export const removeAroundExitMoves = (legalMoves, genMap) => {
	legalMoves = legalMoves.filter((move) => !checkIfMoveIsAroundExitTile(move, genMap));
	return legalMoves;
};

const checkIfMoveIsAroundExitTile = (move, genMap) => {
	const tilesAroundExit = chooseSurroundOrAdjacentExitTiles(move, genMap);
	let moveIsAdjExit = false;
	tilesAroundExit.forEach(function(tile) {
		if (compareArrays(move, tile)) moveIsAdjExit = true;
	});
	return moveIsAdjExit;
}

const chooseSurroundOrAdjacentExitTiles = (move, genMap) => {
	if (checkIfTilesAdjacent(move, genMap)) {
		return getTilesSurroundingExit(genMap);
	} else {
		return getTilesAdjacentAndExit(genMap);
	}
}

const checkIfTilesAdjacent = (tile, genMap) => {
	const adjacentTiles = getTilesAdjacentAndExit(genMap);
	const tileIsAdjacent = findIndexOfArrayInMatrix(tile, adjacentTiles) !== -1;
	return tileIsAdjacent;
}

const getTilesSurroundingExit = (genMap) => {
	const adjacentTiles = getSurroundingTiles(genMap.end);
	return removeOutOfBoundsMoves(adjacentTiles, genMap.parameters);
}

const getSurroundingTiles = (coordinate) => {
	let tileArray = [];
	for (let a = -1; a <= 1; a++) {
		for (let b = -1; b <= 1; b++) {
			tileArray.push([ coordinate[0] + a, coordinate[1] + b ]);
		}
	}
	return tileArray;
}

const getTilesAdjacentAndExit = (genMap) => {
	const adjacentTiles = getAdjacentTiles(genMap.end);
	return removeOutOfBoundsMoves(adjacentTiles, genMap.parameters);
}
