function removeAroundExitMoves(legalMoves, generatedTiles, endCoordinate) {
	legalMoves = legalMoves.filter((move) => !checkIfMoveIsAroundExitTile(move, endCoordinate));
	return legalMoves;
}

function checkIfMoveIsAroundExitTile(move, endCoordinate) {
	const tilesAroundExit = chooseSurroundOrAdjacentExitTiles(move, endCoordinate);
	let moveIsAdjExit = false;
	tilesAroundExit.forEach(function(tile) {
		if (compareArrays(move, tile)) moveIsAdjExit = true;
	});
	return moveIsAdjExit;
}

function chooseSurroundOrAdjacentExitTiles(move, endCoordinate) {
	if (checkIfTilesAdjacent(move, endCoordinate)) {
		return getTilesSurroundingExit(endCoordinate);
	} else {
		return getTilesAdjacentAndExit(endCoordinate);
	}
}

function checkIfTilesAdjacent(tileOne, tileTwo) {
	const adjacentTiles = getTilesAdjacentAndExit(tileTwo);
	const tileIsAdjacent = findIndexOfArrayInMatrix(tileOne, adjacentTiles) !== -1;
	return tileIsAdjacent;
}

function getTilesSurroundingExit(endCoordinate) {
	const adjacentTiles = getSurroundingTiles(endCoordinate);
	return removeOutOfBoundsMoves([ ...adjacentTiles, endCoordinate ]);
}

function getSurroundingTiles(coordinate) {
	let tileArray = [];
	for (let a = -1; a <= 1; a++) {
		for (let b = -1; b <= 1; b++) {
			tileArray.push([ coordinate[0] + a, coordinate[1] + b ]);
		}
	}
	return tileArray;
}

function getTilesAdjacentAndExit(endCoordinate) {
	const adjacentTiles = getAdjacentTiles(endCoordinate);
	return removeOutOfBoundsMoves([ ...adjacentTiles, endCoordinate ]);
}
