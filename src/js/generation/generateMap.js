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
import { findDirectionFromMove } from '../utility/directionsConversions.js';
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
		mapHeight: passedParameters.size,
		...passedParameters.genParams
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
		if (genMap.parameters.iterative)
			legalMoves = legalMoves.filter((move) => checkIfPossibleToReachTargetIterative(move, genMap));
		else legalMoves = legalMoves.filter((move) => checkIfPossibleToReachTarget(move, genMap));
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

function getTilesInEachDirection(currentTile, generatedTiles) {
	let tilesInEachDirection = [];
	for (let i = 0; i < 4; i++) {
		let sign = Math.ceil((i % 3) / 2) * 2 + 1; //
		let lineTiles = generatedTiles.filter((tile) => tile[i % 2] === currentTile[i % 2]);
		let directionTiles = lineTiles.filter((tile) => tile[(i + 1) % 2] * -sign < currentTile[(i + 1) % 2] * -sign);
		tilesInEachDirection.push(directionTiles);
	}
	return tilesInEachDirection;
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

function getDirectionOfEachMove(allTiles, parameters) {
	let directions = [];
	directions.push(getStartingDirection(allTiles[0], parameters));
	for (let i = 0; i < allTiles.length - 1; i++) {
		let currentMoveDir = findDirectionFromMove(allTiles[i + 1], allTiles[i]);
		directions.push(currentMoveDir);
	}
	directions.push(getEndingDirection(allTiles[allTiles.length - 1], parameters));
	return directions;
}

function getStartingDirection(start, parameters) {
	const possibleStartDirections = getPossibleStartDirections(start, parameters);
	return possibleStartDirections[randomIntFromInterval(0, possibleStartDirections.length - 1)];
}

function getEndingDirection(end, parameters) {
	const possibleEndDirections = getPossibleEndDirections(end, parameters);
	return possibleEndDirections[randomIntFromInterval(0, possibleEndDirections.length - 1)];
}

function getPossibleStartDirections(start, parameters) {
	const { mapWidth, mapHeight } = parameters;
	let possibleDirections = [];
	if (start[0] === 0) possibleDirections.push(1); // comes in from left
	if (start[1] === 0) possibleDirections.push(2); // comes in from top
	if (start[0] === mapWidth - 1) possibleDirections.push(3); // comes in from right
	if (start[1] === mapHeight - 1) possibleDirections.push(0); // comes in from bottom
	return possibleDirections;
}

function getPossibleEndDirections(end, parameters) {
	const { mapWidth, mapHeight } = parameters;
	let possibleDirections = [];
	if (end[0] === 0) possibleDirections.push(3); // leaves via left
	if (end[1] === 0) possibleDirections.push(0); // leaves via top
	if (end[0] === mapWidth - 1) possibleDirections.push(1); // leaves via right
	if (end[1] === mapHeight - 1) possibleDirections.push(2); // leaves via bottom
	return possibleDirections;
}

function directionsToTrackRailType(dirs) {
	let railTypeArray = [];
	for (let i = 0; i < dirs.length; i++) {
		if ((dirs[i] === 0 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 2))
			railTypeArray.push('vertical');
		if ((dirs[i] === 1 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 3))
			railTypeArray.push('horizontal');
		if ((dirs[i] === 2 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 0))
			railTypeArray.push('topRightCorner');
		if ((dirs[i] === 3 && dirs[i + 1] === 2) || (dirs[i] === 0 && dirs[i + 1] === 1))
			railTypeArray.push('bottomRightCorner');
		if ((dirs[i] === 0 && dirs[i + 1] === 3) || (dirs[i] === 1 && dirs[i + 1] === 2))
			railTypeArray.push('bottomLeftCorner');
		if ((dirs[i] === 1 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 3))
			railTypeArray.push('topLeftCorner');
	}
	return railTypeArray;
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

function checkIfPossibleToReachTarget(startingTile, genMap) {
	let possibleToReach = false;
	if (compareArrays(startingTile, genMap.end)) {
		possibleToReach = true;
	} else {
		let reachableTiles = [ ...genMap.tiles ];
		reachableTiles.push(spreadInAllDirections(startingTile, reachableTiles, genMap));
		reachableTiles.forEach(function(el) {
			if (compareArrays(el, genMap.end)) possibleToReach = true;
		});
	}
	return possibleToReach;
}

function spreadInAllDirections(prospectiveMove, hitTiles, genMap) {
	const newMapObj = { ...genMap, tiles: hitTiles };
	const newTiles = getLegalMoves(prospectiveMove, newMapObj);
	if (isNonEmptyArray(newTiles)) {
		newTiles.forEach(function(el) {
			hitTiles.push(el);
			hitTiles.push(spreadInAllDirections(el, hitTiles, newMapObj));
		});
	}
	return hitTiles;
}
