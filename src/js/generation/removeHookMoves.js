function removeHookMoves(legalMoves, generatedTiles, endCoordinate) {
	if (generatedTiles.length > 2) {
		legalMoves = legalMoves.filter((move) => !checkIfMoveWillBeHook(move, generatedTiles));
	}
	return legalMoves;
}

function checkIfMoveWillBeHook(prospectiveMove, generatedTiles) {
	const lastThreeTiles = getLastSpecifiedAmountOfTiles(3, generatedTiles);
	const prospectiveLastFourTiles = [ prospectiveMove, ...lastThreeTiles ];
	const dirArr = getSeriesOfDirectionsFromMoveArray(prospectiveLastFourTiles);
	let wasHook = checkIfMoveArrayFormsHook(dirArr);
	return wasHook;
}

function getSeriesOfDirectionsFromMoveArray(moves) {
	let directions = [];
	for (let i = 0; i < moves.length - 1; i++) {
		directions.unshift(findDirectionFromMove(moves[i], moves[i + 1]));
	}
	return directions;
}

function getLastSpecifiedAmountOfTiles(numberOfTiles, tiles) {
	return tiles.slice(Math.max(tiles.length - numberOfTiles, 0)).reverse();
}

function checkIfMoveArrayFormsHook(moveArray) {
	let movesFormHook = false;
	if (
		compareArrays(moveArray, [ 0, 1, 2 ]) ||
		compareArrays(moveArray, [ 1, 2, 3 ]) ||
		compareArrays(moveArray, [ 2, 3, 0 ]) ||
		compareArrays(moveArray, [ 3, 0, 1 ])
	) {
		movesFormHook = true;
	}
	if (
		compareArrays(moveArray, [ 3, 2, 1 ]) ||
		compareArrays(moveArray, [ 2, 1, 0 ]) ||
		compareArrays(moveArray, [ 1, 0, 3 ]) ||
		compareArrays(moveArray, [ 0, 3, 2 ])
	) {
		movesFormHook = true;
	}
	return movesFormHook;
}
