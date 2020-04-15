import seedrandom from 'seedrandom';

import { randomIntFromInterval, compareArrays, isNonEmptyArray } from 'js/utility/utilityFunctions';
import {
	directionsToTrackRailType,
	getTilesInEachDirection,
	getDirectionOfEachMove
} from 'js/utility/directionsConversions.js';

import { generateStartEndPoints } from 'js/generation/map/generateStartEndPoints';
import { getLegalMoves } from 'js/generation/map/genericGenMapFunctions';
import { checkIfPossibleToReachTargetIterative } from 'js/generation/map/checkIfPossibleToReachTargetIterative';
import { generateDefaultTileIndices } from 'js/generation/map/generateDefaultTileIndices';

import { removeExitMove } from 'js/generation/map/mutateMoveArray/removeExitMove';
import { removeAroundExitMoves } from 'js/generation/map/mutateMoveArray/removeAroundExitMoves';
import { removeSealingMoves } from 'js/generation/map/mutateMoveArray/removeSealingMoves';
import { removeHookMoves } from 'js/generation/map/mutateMoveArray/removeHookMoves';
import { removeMovesWithLessTilesFromExit } from 'js/generation/map/mutateMoveArray/removeMovesWithLessTilesFromExit';

export const generateNewMap = (passedParameters) => {
	seedrandom(passedParameters.seed, { global: true });

	const parameters = {
		mapWidth: passedParameters.size,
		mapHeight: passedParameters.size,
		difficulty: passedParameters.difficulty
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
