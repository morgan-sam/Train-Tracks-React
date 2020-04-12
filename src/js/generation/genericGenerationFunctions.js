import { removeArraysFromMatrix } from '../utility/utilityFunctions.js';

export const getLegalMoves = (coordinate, genMap) => {
	const adjacentMoves = getAdjacentTiles(coordinate);
	let legalMoves = removeOutOfBoundsMoves(adjacentMoves, genMap.parameters);
	legalMoves = removeMovesToVisitedTiles(legalMoves, genMap.tiles);
	return legalMoves;
};

export const removeOutOfBoundsMoves = (moves, parameters) => {
	const { mapWidth, mapHeight } = parameters;
	return moves.filter((el) => el[0] >= 0 && el[1] >= 0 && el[0] < mapWidth && el[1] < mapHeight);
};

export const removeMovesToVisitedTiles = (moves, tiles) => {
	return removeArraysFromMatrix(tiles, moves);
};

export const getAdjacentTiles = (coordinate) => {
	return Array(4).fill(coordinate).map((el, i) => [ el[0] + (i - 1) % 2, el[1] + (i - 2) % 2 ]);
};
