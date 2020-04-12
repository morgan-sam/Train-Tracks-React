import { getLegalMoves } from './getLegalMoves.js';
import { removeDuplicateArraysFromMatrix, checkIfArrayIsInMatrix } from '../utility/utilityFunctions.js';

const checkIfPossibleToReachTargetIterative = (move, genMap) => {
	const { mapWidth, mapHeight } = genMap.parameters;
	let tiles = [ ...genMap.tiles ];
	let currentMoves = [ move ]; // convert array to matrix of length 1

	for (let i = 0; i < mapWidth * mapHeight; i++) {
		let legalMoves = currentMoves.map((el) => {
			return getLegalMoves(el, { ...genMap, tiles });
		})[0];
		currentMoves.forEach((move) => tiles.push(move));
		currentMoves = [];
		if (legalMoves.length === 0) break;
		legalMoves = removeDuplicateArraysFromMatrix(legalMoves);
		legalMoves.forEach((move) => currentMoves.push(move));
	}
	return checkIfArrayIsInMatrix(genMap.end, tiles);
};

const genMap = {
	start: [ 0, 0 ],
	end: [ 5, 5 ],
	tiles: [ [ 1, 0 ], [ 1, 1 ], [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 4, 1 ], [ 4, 2 ], [ 4, 3 ], [ 4, 4 ], [ 4, 5 ] ],
	parameters: {
		mapWidth: 6,
		mapHeight: 6
	}
};
var t0 = performance.now();
const boo = checkIfPossibleToReachTargetIterative(genMap.start, genMap);
var t1 = performance.now();
console.log('Call to checkIfPossibleToReachTargetIterative took ' + (t1 - t0) + ' milliseconds.');
console.log(boo);

// start loop
// find legal moves of all currentMoves
//// break if legal moves length is zero
// remove duplicates of legal moves
// empty currentMoves into tiles
// move all legal moves to currentMoves

/////////////CHECK DEPTH OF LEGAL MOVES

// repeat loop

// return true is end in tiles, return false if not
