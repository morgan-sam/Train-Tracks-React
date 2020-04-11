import seedrandom from 'seedrandom';

import {
	randomIntFromInterval,
	compareArrays,
	isNonEmptyArray,
	findIndexOfArrayInMatrix,
	removeDuplicateArraysFromMatrix,
	removeArraysFromMatrix
} from '../utility/utilityFunctions';

export const generateNewMap = (gameParameters) => {
	const { seed, size, pathFinding } = gameParameters;
	const [ mapWidth, mapHeight ] = [ size, size ];
	seedrandom(seed, { global: true });

	let trainTrackMap = {
		tracks: [],
		headerLabels: []
	};

	const allTiles = generateMapTiles();
	const moveDirections = getDirectionOfEachMove(allTiles);
	const railTypes = directionsToTrackRailType(moveDirections);
	const defaultTilesIndices = generateDefaultTileIndices(allTiles);

	trainTrackMap.headerLabels = generateMapHeaders(allTiles);

	for (let i = 0; i < allTiles.length; i++) {
		let isDefaultTrack = defaultTilesIndices.includes(i);

		trainTrackMap.tracks.push({
			tile: allTiles[i],
			railType: railTypes[i],
			defaultTrack: isDefaultTrack
		});
	}
	return trainTrackMap;

	function generateMapTiles() {
		const [ startCoordinate, endCoordinate ] = generateStartEndPoints();
		let generatedTiles = [ startCoordinate ];
		let mapComplete = false;
		let lastMove = startCoordinate;
		while (!mapComplete) {
			let nextMove = newMove(lastMove, generatedTiles, endCoordinate);
			generatedTiles.push(nextMove);
			lastMove = nextMove;
			if (compareArrays(nextMove, endCoordinate)) {
				mapComplete = true;
			}
		}
		return generatedTiles;
	}

	function getLegalMoves(coordinate, generatedTiles) {
		const adjacentMoves = getAdjacentTiles(coordinate);
		let legalMoves = removeOutOfBoundsMoves(adjacentMoves);
		legalMoves = removeMovesToVisitedTiles(legalMoves, generatedTiles);
		return legalMoves;
	}

	function getAdjacentTiles(coordinate) {
		return Array(4).fill(coordinate).map((el, i) => [ el[0] + (i - 1) % 2, el[1] + (i - 2) % 2 ]);
	}

	function removeOutOfBoundsMoves(moves) {
		return moves.filter((el) => el[0] >= 0 && el[1] >= 0 && el[0] < mapWidth && el[1] < mapHeight);
	}

	function removeMovesToVisitedTiles(moves, tiles) {
		let legalMoves = moves.filter(function(move) {
			let boo = false;
			tiles.forEach(function(remove) {
				if (compareArrays(move, remove)) {
					boo = true;
				}
			});
			return !boo;
		});
		return legalMoves;
	}

	function newMove(currentCoordinate, generatedTiles, endCoordinate) {
		let nextMove;
		let legalMoves = getLegalMoves(currentCoordinate, generatedTiles);

		if (checkIfOnlyLegalMoveIsExit(legalMoves, endCoordinate)) {
			nextMove = endCoordinate;
		} else {
			legalMoves = legalMoves.filter((move) => checkIfPossibleToReachTarget(move, endCoordinate, generatedTiles));
			legalMoves = mutateMoveArray(legalMoves, generatedTiles, endCoordinate);
			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
		}
		return nextMove;
	}

	function checkIfOnlyLegalMoveIsExit(legalMoves, endCoordinate) {
		return legalMoves.length === 1 && compareArrays(legalMoves[0], endCoordinate);
	}

	function mutateMoveArray(legalMoves, generatedTiles, endCoordinate) {
		let moveMutateFunctions = [];
		//
		// moveMutateFunctions.push(removeSealingMoves)
		// moveMutateFunctions.push(removeAroundExitMoves)
		// moveMutateFunctions.push(removeHookMoves)
		// if (pathFinding) moveMutateFunctions.push(removeMovesWithLessTilesFromExit);

		for (let i = 0; i < moveMutateFunctions.length; i++) {
			let currentFunc = moveMutateFunctions[i];
			let mutatedMoveArray = currentFunc(legalMoves, generatedTiles, endCoordinate);
			if (!isNonEmptyArray(mutatedMoveArray)) {
				break;
			} else {
				legalMoves = mutatedMoveArray;
			}
		}
		return legalMoves;
	}

	////////////////////////////////////////////////////////////
	////////////////////// NEW SECTION /////////////////////////
	////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

	//Single goal but structure is obtuse and variable naming is vague
	function getTilesInEachDirection(currentTile, generatedTiles) {
		let tilesInEachDirection = [];
		for (let i = 0; i < 4; i++) {
			let sign = Math.ceil((i % 3) / 2) * 2 + 1; //
			let lineTiles = generatedTiles.filter((tile) => tile[i % 2] === currentTile[i % 2]);
			let directionTiles = lineTiles.filter(
				(tile) => tile[(i + 1) % 2] * -sign < currentTile[(i + 1) % 2] * -sign
			);
			tilesInEachDirection.push(directionTiles);
		}
		return tilesInEachDirection;
	}

	function checkIfPossibleToReachTarget(startingTile, targetTile, generatedTiles) {
		let possibleToReach = false;
		if (compareArrays(startingTile, targetTile)) {
			possibleToReach = true;
		} else {
			let takenTiles = [ ...generatedTiles ];
			takenTiles.push(spreadInAllDirections(startingTile, takenTiles));
			takenTiles.forEach(function(el) {
				if (compareArrays(el, targetTile)) possibleToReach = true;
			});
		}
		return possibleToReach;
	}

	function spreadInAllDirections(prospectiveMove, hitTiles) {
		const newTiles = getLegalMoves(prospectiveMove, hitTiles);
		if (isNonEmptyArray(newTiles)) {
			newTiles.forEach(function(el) {
				hitTiles.push(el);
				hitTiles.push(spreadInAllDirections(el, hitTiles));
			});
		}
		return hitTiles;
	}

	function generateStartEndPoints() {
		let edges = getEdgeCoordinatesClockwiseOrder();
		let startCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1)[0];
		let endCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1)[0];
		return [ startCoordinate, endCoordinate ];
	}

	function getEdgeCoordinatesClockwiseOrder() {
		let coordinates = [];
		for (let x = 0; x < mapWidth - 1; x++) coordinates.push([ x, 0 ]); //top
		for (let y = 0; y < mapHeight - 1; y++) coordinates.push([ mapWidth - 1, y ]); //right
		for (let x = mapWidth - 1; x > 0; x--) coordinates.push([ x, mapHeight - 1 ]); //bottom
		for (let y = mapHeight - 1; y > 0; y--) coordinates.push([ 0, y ]); //left
		return coordinates;
	}

	function generateMapHeaders(allTiles) {
		let mapHeaders = { x: [], y: [] };
		for (let i = 0; i < mapWidth; i++) {
			mapHeaders.x.push(getTilesInEachDirection([ i, -1 ], allTiles)[2].length);
		}
		for (let i = 0; i < mapHeight; i++) {
			mapHeaders.y.push(getTilesInEachDirection([ -1, i ], allTiles)[1].length);
		}
		return mapHeaders;
	}

	function getDirectionOfEachMove(allTiles) {
		let directions = [];
		directions.push(getStartingDirection(allTiles[0]));
		for (let i = 0; i < allTiles.length - 1; i++) {
			let currentMoveDir = findDirectionFromMove(allTiles[i + 1], allTiles[i]);
			directions.push(currentMoveDir);
		}
		directions.push(getEndingDirection(allTiles[allTiles.length - 1]));
		return directions;
	}

	function getStartingDirection(start) {
		const possibleStartDirections = getPossibleStartDirections(start);
		return possibleStartDirections[randomIntFromInterval(0, possibleStartDirections.length - 1)];
	}

	function getEndingDirection(end) {
		const possibleEndDirections = getPossibleEndDirections(end);
		return possibleEndDirections[randomIntFromInterval(0, possibleEndDirections.length - 1)];
	}

	function getPossibleStartDirections(start) {
		let possibleDirections = [];
		if (start[0] === 0) possibleDirections.push(1); // comes in from left
		if (start[1] === 0) possibleDirections.push(2); // comes in from top
		if (start[0] === mapWidth - 1) possibleDirections.push(3); // comes in from right
		if (start[1] === mapHeight - 1) possibleDirections.push(0); // comes in from bottom
		return possibleDirections;
	}

	function getPossibleEndDirections(end) {
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

	function generateDefaultTileIndices(allTiles) {
		let indices = [];
		indices.push(...getAllTwoByTwoDefaultIndices(allTiles));
		indices.push(...getStartAndEndIndices(allTiles));
		return [ ...new Set(indices) ];
	}

	function getStartAndEndIndices(allTiles) {
		return [ 0, allTiles.length - 1 ];
	}

	function getAllTwoByTwoDefaultIndices(allTiles) {
		let defaultCoordinates = iterateThroughEachPossibleSquare(allTiles);
		defaultCoordinates = removeDefaultTilesWithMoreThanOneAdjacent(defaultCoordinates);
		const defaultIndices = defaultCoordinates.map((el) => findIndexOfArrayInMatrix(el, allTiles));
		return defaultIndices;
	}

	function iterateThroughEachPossibleSquare() {
		let nonDefaultTrackTiles = allTiles;
		let defaultCoordinates = [];
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 2; x++) {
				const coordinates = getSquareDefaultCoordinates(nonDefaultTrackTiles, x, y);
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

	function getSquareDefaultCoordinates(nonDefaultTrackTiles, xOffset, yOffset) {
		const squares = splitMapIntoSquares(xOffset, yOffset);
		const fullSquares = filterForFullSquares(nonDefaultTrackTiles, squares);
		const defaultCoordinates = getRandomNonDuplicateCoordinatesFromMatrix(fullSquares);
		return defaultCoordinates;
	}

	function getRandomNonDuplicateCoordinatesFromMatrix(matrix) {
		const coordinates = matrix.map((el) => el[randomIntFromInterval(0, el.length - 1)]);
		return removeDuplicateArraysFromMatrix(coordinates);
	}

	function filterForFullSquares(allTiles, squares) {
		const fullSquares = squares.filter((rec) => checkIfSquareIsFull(rec, allTiles));
		return fullSquares;
	}

	function checkIfSquareIsFull(rec, allTiles) {
		let tileCount = 0;
		rec.forEach(function(recTile) {
			allTiles.forEach(function(tile) {
				if (compareArrays(recTile, tile)) tileCount++;
			});
		});
		return tileCount === 4;
	}

	function splitMapIntoSquares(xOffset, yOffset) {
		let squares = [];
		for (let y = yOffset; y < mapHeight - 1 - yOffset; y += 2) {
			for (let x = xOffset; x < mapWidth - 1 - xOffset; x += 2) {
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
};

export const findDirectionFromMove = (currentMove, lastMove) => {
	let moveDirection;
	const moveCalc = differenceBetweenTwoMoves(currentMove, lastMove);
	if (compareArrays(moveCalc, [ 0, -1 ])) moveDirection = 0; //= 'up';
	if (compareArrays(moveCalc, [ 1, 0 ])) moveDirection = 1; //= 'right';
	if (compareArrays(moveCalc, [ 0, 1 ])) moveDirection = 2; //= 'down';
	if (compareArrays(moveCalc, [ -1, 0 ])) moveDirection = 3; //= 'left';
	return moveDirection;
};

function differenceBetweenTwoMoves(moveOne, moveTwo) {
	return [ moveOne[0] - moveTwo[0], moveOne[1] - moveTwo[1] ];
}
