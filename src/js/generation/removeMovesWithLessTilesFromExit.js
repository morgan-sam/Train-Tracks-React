function removeMovesWithLessTilesFromExit(legalMoves, generatedTiles, endCoordinate) {
	const moveWithMore = getMoveWithMoreTilesAwayFromExit(legalMoves, generatedTiles, endCoordinate);
	if (isNonEmptyArray(moveWithMore)) return [ moveWithMore ];
	else return legalMoves;
}

function getMoveWithMoreTilesAwayFromExit(legalMoves, generatedTiles, endCoordinate) {
	let paths = [];
	legalMoves.forEach(function(el) {
		paths.push(getShortestPathBreadthFirstSearch(el, endCoordinate, generatedTiles));
	});
	const longestIndex = getIndexOfLongestArrayInMatrix(paths);
	const moveForLongest = paths[longestIndex][0];
	return moveForLongest;
}

function getShortestPathBreadthFirstSearch(prospectiveMove, target, hitTiles) {
	let shortestPath;
	function nextPathMove(move, visitedTiles, target, iteration) {
		visitedTiles.push(move);
		const tempMapObj = {
			tiles: visitedTiles,
			parameters: genMap.parameters
		};
		const newTiles = getLegalMoves(move, tempMapObj);
		if (isNonEmptyArray(newTiles)) {
			newTiles.forEach(function(el) {
				iteration--;
				if (compareArrays(el, target)) addPathToArray(prospectiveMove, target, [ ...visitedTiles ]);
				else if (iteration > 0) nextPathMove(el, [ ...visitedTiles ], target, iteration);
			});
		}
	}

	function addPathToArray(prospectiveMove, target, visitedTiles) {
		const startIndex = findIndexOfArrayInMatrix(prospectiveMove, visitedTiles);
		const removedObstacleArray = visitedTiles.slice(startIndex);
		shortestPath = [ ...removedObstacleArray, target ];
	}

	let i = 0;
	while (!isNonEmptyArray(shortestPath)) {
		i++;
		nextPathMove(prospectiveMove, [ hitTiles ], target, i);
	}
	return shortestPath;
}
