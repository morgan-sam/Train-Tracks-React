function removeSealingMoves(legalMoves, generatedTiles, endCoordinate) {
	if (!checkIfMapCovered(generatedTiles, 0.5)) {
		legalMoves = legalMoves.filter((move) => !checkIfMoveSeals(move, generatedTiles, endCoordinate));
	}
	return legalMoves;
}

function checkIfMapCovered(generatedTiles, modifier) {
	const mapCoverage = modifier * mapWidth * mapHeight;
	return generatedTiles.length >= mapCoverage;
}

function checkIfMoveSeals(move, generatedTiles, endCoordinate) {
	const nextLegalMoves = getLegalMoves(move, generatedTiles);
	let pathSealed = false;
	nextLegalMoves.forEach((nextMove) => {
		if (!checkIfPossibleToReachTarget(nextMove, endCoordinate, [ ...generatedTiles, move ])) {
			pathSealed = true;
		}
	});
	return pathSealed;
}
