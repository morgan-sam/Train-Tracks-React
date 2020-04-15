import { getLegalMoves } from './genericGenMapFunctions.js';
import { removeDuplicateArraysFromMatrix, checkIfArrayIsInMatrix } from '../../utility/utilityFunctions.js';

export const checkIfPossibleToReachTargetIterative = (move, genMap) => {
	const { mapWidth, mapHeight } = genMap.parameters;
	let tiles = [ ...genMap.tiles ];
	let currentMoves = [ move ]; // convert array to matrix of length 1
	for (let i = 0; i < mapWidth * mapHeight; i++) {
		let legalMoves = currentMoves.map((el) => {
			return getLegalMoves(el, { ...genMap, tiles });
		});
		legalMoves = [].concat.apply([], legalMoves);
		currentMoves.forEach((move) => tiles.push(move));
		currentMoves = [];
		if (legalMoves.length === 0) break;
		legalMoves = removeDuplicateArraysFromMatrix(legalMoves);
		legalMoves.forEach((move) => currentMoves.push(move));
	}
	const possible = checkIfArrayIsInMatrix(genMap.end, tiles);
	return possible;
};
