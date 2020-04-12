import seedrandom from 'seedrandom';

import {
	randomIntFromInterval,
	compareArrays,
	isNonEmptyArray,
	findIndexOfArrayInMatrix,
	removeDuplicateArraysFromMatrix,
	removeArraysFromMatrix,
	findCommonArraysOfAllMatrices
} from '../utility/utilityFunctions';
import {
	directionsToTrackRailType,
	getTilesInEachDirection,
	getDirectionOfEachMove
} from '../utility/directionsConversions.js';

import { generateStartEndPoints } from './generateStartEndPoints';
import { getLegalMoves, getAdjacentTiles } from './genericGenerationFunctions';
import { checkIfPossibleToReachTargetIterative } from './checkIfPossibleToReachTargetIterative';

import { removeExitMove } from './mutateMoveArray/removeExitMove';
import { removeAroundExitMoves } from './mutateMoveArray/removeAroundExitMoves';
import { removeSealingMoves } from './mutateMoveArray/removeSealingMoves';
import { removeHookMoves } from './mutateMoveArray/removeHookMoves';
import { removeMovesWithLessTilesFromExit } from './mutateMoveArray/removeMovesWithLessTilesFromExit';

export const generateNewMap = (passedParameters) => {
	seedrandom(passedParameters.seed, { global: true });

	const parameters = {
		mapWidth: passedParameters.size,
		mapHeight: passedParameters.size
	};

	let trainTrackMap = {
		tracks: [],
		headerLabels: []
	};

	const allTiles = generateMapTiles(parameters);
	const moveDirections = getDirectionOfEachMove(allTiles, parameters);
	const railTypes = directionsToTrackRailType(moveDirections);
	const defaultTilesIndices = generateDefaultTileIndices(allTiles, parameters);

	trainTrackMap.headerLabels = generateMapHeaders(allTiles, parameters);

	for (let i = 0; i < allTiles.length; i++) {
		let isDefaultTrack = defaultTilesIndices.includes(i);

		trainTrackMap.tracks.push({
			tile: allTiles[i],
			railType: railTypes[i],
			defaultTrack: isDefaultTrack
		});
	}
	return trainTrackMap;
};

function generateMapTiles(parameters) {
	const [ start, end ] = generateStartEndPoints(parameters);

	let genMap = {
		start,
		end,
		tiles: [ start ],
		current: start,
		parameters
	};

	let mapComplete = false;

	while (!mapComplete) {
		let nextMove = newMove(genMap);
		genMap.tiles.push(nextMove);
		genMap.current = nextMove;
		if (compareArrays(nextMove, genMap.end)) {
			mapComplete = true;
		}
	}
	return genMap.tiles;
}

function newMove(genMap) {
	let nextMove;
	let legalMoves = getLegalMoves(genMap.current, genMap);

	if (checkIfOnlyLegalMoveIsExit(legalMoves, genMap.end)) {
		nextMove = genMap.end;
	} else {
		legalMoves = legalMoves.filter((move) => checkIfPossibleToReachTargetIterative(move, genMap));
		legalMoves = mutateMoveArray(legalMoves, genMap);
		nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
	}
	return nextMove;
}

function checkIfOnlyLegalMoveIsExit(legalMoves, endCoordinate) {
	return legalMoves.length === 1 && compareArrays(legalMoves[0], endCoordinate);
}

function mutateMoveArray(legalMoves, genMap) {
	let moveMutateFunctions = [];

	moveMutateFunctions.push(removeExitMove);
	moveMutateFunctions.push(removeAroundExitMoves);
	moveMutateFunctions.push(removeSealingMoves);
	moveMutateFunctions.push(removeHookMoves);
	moveMutateFunctions.push(removeMovesWithLessTilesFromExit);

	for (let i = 0; i < moveMutateFunctions.length; i++) {
		let currentFunc = moveMutateFunctions[i];
		let mutatedMoveArray = currentFunc(legalMoves, genMap);
		if (!isNonEmptyArray(mutatedMoveArray)) {
			break;
		} else {
			legalMoves = mutatedMoveArray;
		}
	}
	return legalMoves;
}

function generateMapHeaders(allTiles, parameters) {
	const { mapWidth, mapHeight } = parameters;
	let mapHeaders = { x: [], y: [] };
	for (let i = 0; i < mapWidth; i++) {
		mapHeaders.x.push(getTilesInEachDirection([ i, -1 ], allTiles)[2].length);
	}
	for (let i = 0; i < mapHeight; i++) {
		mapHeaders.y.push(getTilesInEachDirection([ -1, i ], allTiles)[1].length);
	}
	return mapHeaders;
}

function generateDefaultTileIndices(allTiles, parameters) {
	let indices = [];
	indices.push(...getAllTwoByTwoDefaultIndices(allTiles, parameters));
	indices.push(...getStartAndEndIndices(allTiles));
	return [ ...new Set(indices) ];
}

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
