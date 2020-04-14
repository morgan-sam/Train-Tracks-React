import {
	isNonEmptyArray,
	removeDuplicateArraysFromMatrix,
	checkIfArrayIsInMatrix
} from '../../utility/utilityFunctions.js';
import { getLegalMoves } from '../genericGenerationFunctions.js';

export const removeMovesWithLessTilesFromExit = (legalMoves, genMap) => {
	const moveWithMore = getMovesWithMoreTilesAwayFromExit(legalMoves, genMap);
	if (isNonEmptyArray(moveWithMore)) return [ ...moveWithMore ];
	else return legalMoves;
};

function getMovesWithMoreTilesAwayFromExit(legalMoves, genMap) {
	let pathLengths = legalMoves.map((el) => getMinimumDistanceToExit(el, genMap));
	const indices = getIndicesOfLargestElementsInArray(pathLengths);
	let moves = [];
	for (let i = 0; i < indices.length; i++) {
		moves.push(legalMoves[indices[i]]);
	}
	return moves;
}
const getMinimumDistanceToExit = (move, genMap) => {
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
		if (checkIfArrayIsInMatrix(genMap.end, tiles)) return i;
		legalMoves = removeDuplicateArraysFromMatrix(legalMoves);
		legalMoves.forEach((move) => currentMoves.push(move));
	}
};

const getIndicesOfLargestElementsInArray = (array) => {
	const largestValue = array[array.indexOf(Math.max(...array))];
	let largestIndices = [];
	for (let i = 0; i < array.length; i++) {
		if (array[i] === largestValue) largestIndices.push(i);
	}
	return largestIndices;
};
