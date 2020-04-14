import {
	randomIntFromInterval,
	findIndexOfArrayInMatrix,
	removeDuplicateArraysFromMatrix,
	removeArraysFromMatrix,
	findCommonArraysOfAllMatrices
} from '../utility/utilityFunctions';
import { getAdjacentTiles } from './genericGenerationFunctions';

export const generateDefaultTileIndices = (allTiles, parameters) => {
	let optionalIndices = getAllTwoByTwoDefaultIndices(allTiles, parameters);
	const mandatoryIndices = getStartAndEndIndices(allTiles);
	return [ ...new Set([ ...optionalIndices, ...mandatoryIndices ]) ];
};

function getStartAndEndIndices(allTiles) {
	return [ 0, allTiles.length - 1 ];
}

function getAllTwoByTwoDefaultIndices(allTiles, parameters) {
	let defaultCoordinates = iterateThroughEachPossibleSquare(allTiles, parameters);
	defaultCoordinates = removeDefaultTilesWithMoreThanOneAdjacent(defaultCoordinates);
	const defaultIndices = defaultCoordinates.map((el) => findIndexOfArrayInMatrix(el, allTiles));
	return defaultIndices;
}
function iterateThroughEachPossibleSquare(allTiles, parameters) {
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
}

function removeDefaultTilesWithMoreThanOneAdjacent(defaultCoordinates) {
	let currentDefaultTiles = [ ...defaultCoordinates ];
	return defaultCoordinates.filter(function(tile) {
		const adjDefTileCount = getAdjacentDefaultTileCount(tile, currentDefaultTiles);
		const moreThanOneAdj = adjDefTileCount > 1;
		if (moreThanOneAdj) currentDefaultTiles = removeArraysFromMatrix([ tile ], currentDefaultTiles);
		return !moreThanOneAdj;
	});
}

function getAdjacentDefaultTileCount(tile, currentDefaultTiles) {
	const adjTiles = getAdjacentTiles(tile);
	const nonDefTiles = removeArraysFromMatrix(currentDefaultTiles, adjTiles);
	return 4 - nonDefTiles.length;
}

function getSquareDefaultCoordinates(nonDefaultTrackTiles, offset, parameters) {
	const squares = splitMapIntoSquares(offset, parameters);
	const fullSquares = filterForFullSquares(nonDefaultTrackTiles, squares);
	const defaultCoordinates = getRandomNonDuplicateCoordinatesFromMatrix(fullSquares);
	return defaultCoordinates;
}

function getRandomNonDuplicateCoordinatesFromMatrix(matrix) {
	const coordinates = matrix.map((el) => el[randomIntFromInterval(0, el.length - 1)]);
	return removeDuplicateArraysFromMatrix(coordinates);
}

function filterForFullSquares(allTiles, squares) {
	return squares.filter((square) => checkIfSquareIsFull(square, allTiles));
}

function checkIfSquareIsFull(square, allTiles) {
	return findCommonArraysOfAllMatrices([ square, allTiles ]).length === 4;
}

function splitMapIntoSquares(offset, parameters) {
	const { mapWidth, mapHeight } = parameters;
	let squares = [];
	for (let y = offset.y; y < mapHeight - 1 - offset.y; y += 2) {
		for (let x = offset.x; x < mapWidth - 1 - offset.x; x += 2) {
			squares.push(getTwoByTwoSquare(x, y));
		}
	}
	return squares;
}

function getTwoByTwoSquare(x, y) {
	let square = [];
	for (let b = 0; b < 2; b++) {
		for (let a = 0; a < 2; a++) {
			square.push([ a + x, b + y ]);
		}
	}
	return square;
}
