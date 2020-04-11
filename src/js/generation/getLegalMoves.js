import { removeArraysFromMatrix } from '../utility/utilityFunctions';

export const getLegalMoves = (coordinate, genMap) => {
	const adjacentMoves = getAdjacentTiles(coordinate);
	let legalMoves = removeOutOfBoundsMoves(adjacentMoves, genMap.parameters);
	legalMoves = removeMovesToVisitedTiles(legalMoves, genMap.tiles);
	return legalMoves;
};

function removeOutOfBoundsMoves(moves, parameters) {
	const { mapWidth, mapHeight } = parameters;
	return moves.filter((el) => el[0] >= 0 && el[1] >= 0 && el[0] < mapWidth && el[1] < mapHeight);
}

function removeMovesToVisitedTiles(moves, tiles) {
	return removeArraysFromMatrix(tiles, moves);
}

function getAdjacentTiles(coordinate) {
	return Array(4).fill(coordinate).map((el, i) => [ el[0] + (i - 1) % 2, el[1] + (i - 2) % 2 ]);
}
