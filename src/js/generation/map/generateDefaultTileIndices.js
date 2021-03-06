import {
	randomIntFromInterval,
	findIndexOfArrayInMatrix,
	removeDuplicateArraysFromMatrix,
	removeArraysFromMatrix,
	findCommonArraysOfAllMatrices,
	halveArray,
	shuffleArray
} from 'js/utility/utilityFunctions';
import { getAdjacentTiles } from 'js/generation/map/genericGenMapFunctions';

// Definitive indices are required for a single solution without trial and error
export const generateDefaultTileIndices = (allTiles, parameters) => {
	const definitiveIndices = getAllTwoByTwoDefaultIndices(allTiles, parameters);
	const mapInfo = { mapLength: allTiles.length, difficulty: parameters.difficulty };
	const optionalIndices = modifyDefinitiveIndices(definitiveIndices, mapInfo);
	const mandatoryIndices = getStartAndEndIndices(allTiles);
	return [ ...new Set([ ...optionalIndices, ...mandatoryIndices ]) ];
};

const modifyDefinitiveIndices = (definitiveIndices, mapInfo) => {
	const { mapLength, difficulty } = mapInfo;
	const helperIndices = getHelperIndices(definitiveIndices, mapLength);
	if (difficulty === 1) return [ ...definitiveIndices, ...helperIndices ];
	if (difficulty === 2) return [ ...definitiveIndices, ...halveArray(helperIndices) ];
	if (difficulty === 3) return definitiveIndices;
	if (difficulty === 4) return halveArray(definitiveIndices);
	if (difficulty === 5) return [];
};

const getHelperIndices = (indices, mapLength) => {
	const all = [ ...Array(mapLength).keys() ];
	const possible = all.filter((el) => indices.indexOf(el) === -1);
	const shuffled = shuffleArray(possible);
	return halveArray(shuffled);
};

const getStartAndEndIndices = (allTiles) => {
	return [ 0, allTiles.length - 1 ];
};

const getAllTwoByTwoDefaultIndices = (allTiles, parameters) => {
	let defaultCoordinates = iterateThroughEachPossibleSquare(allTiles, parameters);
	defaultCoordinates = removeDefaultTilesWithMoreThanOneAdjacent(defaultCoordinates);
	const defaultIndices = defaultCoordinates.map((el) => findIndexOfArrayInMatrix(el, allTiles));
	return [ ...new Set(defaultIndices) ];
};
const iterateThroughEachPossibleSquare = (allTiles, parameters) => {
	let nonDefaultTrackTiles = allTiles;
	let defaultCoordinates = [];
	for (let y = 0; y < 2; y++) {
		for (let x = 0; x < 2; x++) {
			const offset = { x, y };
			const coordinates = getSquareDefaultCoordinates(nonDefaultTrackTiles, offset, parameters);
			defaultCoordinates.push(coordinates);
			nonDefaultTrackTiles = removeArraysFromMatrix(coordinates, allTiles);
		}
	}
	return [].concat(...defaultCoordinates);
};

const removeDefaultTilesWithMoreThanOneAdjacent = (defaultCoordinates) => {
	let currentDefaultTiles = [ ...defaultCoordinates ];
	return defaultCoordinates.filter((tile) => {
		const adjDefTileCount = getAdjacentDefaultTileCount(tile, currentDefaultTiles);
		const moreThanOneAdj = adjDefTileCount > 1;
		if (moreThanOneAdj) currentDefaultTiles = removeArraysFromMatrix([ tile ], currentDefaultTiles);
		return !moreThanOneAdj;
	});
};

const getAdjacentDefaultTileCount = (tile, currentDefaultTiles) => {
	const adjTiles = getAdjacentTiles(tile);
	const nonDefTiles = removeArraysFromMatrix(currentDefaultTiles, adjTiles);
	return 4 - nonDefTiles.length;
};

const getSquareDefaultCoordinates = (nonDefaultTrackTiles, offset, parameters) => {
	const squares = splitMapIntoSquares(offset, parameters);
	const fullSquares = filterForFullSquares(nonDefaultTrackTiles, squares);
	const defaultCoordinates = getRandomNonDuplicateCoordinatesFromMatrix(fullSquares);
	return defaultCoordinates;
};

const getRandomNonDuplicateCoordinatesFromMatrix = (matrix) => {
	const coordinates = matrix.map((el) => el[randomIntFromInterval(0, el.length - 1)]);
	return removeDuplicateArraysFromMatrix(coordinates);
};

const filterForFullSquares = (allTiles, squares) => {
	return squares.filter((square) => checkIfSquareIsFull(square, allTiles));
};

const checkIfSquareIsFull = (square, allTiles) => {
	return findCommonArraysOfAllMatrices([ square, allTiles ]).length === 4;
};

const splitMapIntoSquares = (offset, parameters) => {
	const { mapWidth, mapHeight } = parameters;
	let squares = [];
	for (let y = offset.y; y < mapHeight - 1 - offset.y; y += 2) {
		for (let x = offset.x; x < mapWidth - 1 - offset.x; x += 2) {
			squares.push(getTwoByTwoSquare(x, y));
		}
	}
	return squares;
};

const getTwoByTwoSquare = (x, y) => {
	let square = [];
	for (let b = 0; b < 2; b++) {
		for (let a = 0; a < 2; a++) {
			square.push([ a + x, b + y ]);
		}
	}
	return square;
};
