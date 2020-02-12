import seedrandom from 'seedrandom';

export const generateNewMap = (mapWidth, mapHeight, mapSeed) => {
	seedrandom(mapSeed, { global: true });

	let trainTrackMap = {
		tracks: [],
		headerLabels: []
	};

	const allTiles = generateMapTiles();
	const moveDirections = getDirectionOfEachMove(allTiles);
	const railTypes = directionsToTrackRailType(moveDirections);
	const defaultTilesIndices = generateDefaultTileIndices(allTiles.length);

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

	//One Clear Goal
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

	//One Clear Goal
	function getLegalMoves(coordinate, generatedTiles) {
		const adjacentMoves = getAdjacentTiles(coordinate);
		let legalMoves = removeOutOfBoundsMoves(adjacentMoves);
		legalMoves = removeMovesToVisitedTiles(legalMoves, generatedTiles);
		return legalMoves;
	}

	//One Clear Goal
	function getAdjacentTiles(coordinate) {
		return Array(4).fill(coordinate).map((el, i) => [ el[0] + (i - 1) % 2, el[1] + (i - 2) % 2 ]);
	}

	//One Clear Goal
	function removeOutOfBoundsMoves(moves) {
		return moves.filter((el) => el[0] >= 0 && el[1] >= 0 && el[0] < mapWidth && el[1] < mapHeight);
	}

	//One Clear Goal
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

	//One Goal
	function newMove(currentCoordinate, generatedTiles, endCoordinate) {
		let nextMove;
		let legalMoves = getLegalMoves(currentCoordinate, generatedTiles);

		if (checkIfOnlyLegalMoveIsExit(legalMoves, endCoordinate)) {
			nextMove = endCoordinate;
		} else {
			legalMoves = legalMoves.filter((move) => checkIfPossibleToReachTarget(move, endCoordinate, generatedTiles));
			legalMoves = mutateMoveArray(legalMoves, generatedTiles);
			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
		}
		return nextMove;
	}

	function checkIfOnlyLegalMoveIsExit(legalMoves, endCoordinate) {
		return legalMoves.length === 1 && compareArrays(legalMoves[0], endCoordinate);
	}

	//One Clear Goal
	function mutateMoveArray(legalMoves, generatedTiles) {
		//passes possible moves through several calulations to improve the generated map
		//only takes array input of moves that are possible to reach exit

		const moveMutateFunctions = [ removeHookMoves ];

		for (let i = 0; i < moveMutateFunctions.length; i++) {
			let currentFunc = moveMutateFunctions[i];
			let mutatedMoveArray = currentFunc(legalMoves, generatedTiles);
			if (!isNonEmptyArray(mutatedMoveArray)) {
				break;
			} else {
				legalMoves = mutatedMoveArray;
			}
		}
		return legalMoves;
	}

	//One Clear Goal
	function removeHookMoves(legalMoves, generatedTiles) {
		if (generatedTiles.length > 2) {
			legalMoves = legalMoves.filter((move) => !checkIfMoveWillBeHook(move, generatedTiles));
		}
		return legalMoves;
	}

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

	function checkIfMoveWillBeHook(prospectiveMove, generatedTiles) {
		const lastThreeTiles = getLastSpecifiedAmountOfTiles(3, generatedTiles);
		const prospectiveLastFourTiles = [ prospectiveMove, ...lastThreeTiles ];
		const dirArr = getSeriesOfDirectionsFromMoveArray(prospectiveLastFourTiles);
		let wasHook = checkIfMoveArrayFormsHook(dirArr);
		return wasHook;
	}

	function getSeriesOfDirectionsFromMoveArray(moves) {
		let directions = [];
		for (let i = 0; i < moves.length - 1; i++) {
			directions.unshift(findDirectionFromMove(moves[i], moves[i + 1]));
		}
		return directions;
	}

	function getLastSpecifiedAmountOfTiles(numberOfTiles, tiles) {
		return tiles.slice(Math.max(tiles.length - numberOfTiles, 0)).reverse();
	}

	function checkIfMoveArrayFormsHook(moveArray) {
		let movesFormHook = false;
		if (
			compareArrays(moveArray, [ 0, 1, 2 ]) ||
			compareArrays(moveArray, [ 1, 2, 3 ]) ||
			compareArrays(moveArray, [ 2, 3, 0 ]) ||
			compareArrays(moveArray, [ 3, 0, 1 ])
		) {
			movesFormHook = true;
		}
		if (
			compareArrays(moveArray, [ 3, 2, 1 ]) ||
			compareArrays(moveArray, [ 2, 1, 0 ]) ||
			compareArrays(moveArray, [ 1, 0, 3 ]) ||
			compareArrays(moveArray, [ 0, 3, 2 ])
		) {
			movesFormHook = true;
		}
		return movesFormHook;
	}

	//Almost one clear goal but variable naming is wrong/vague
	function checkIfPossibleToReachTarget(startingTile, targetTile, generatedTiles) {
		//spread across all squares bound by border and other tracks
		//use getLegalMoves() to find where to move
		//add all tiles to a new array
		//go until exit hit or no other moves
		//if exit then return true
		//if no exit return false
		let possibleExits = 0;
		if (compareArrays(startingTile, targetTile)) {
			possibleExits = true;
		} else {
			let takenTiles = [ ...generatedTiles ];
			spreadInAllDirections(startingTile, takenTiles);
			takenTiles.forEach(function(el) {
				if ((el[0] === targetTile[0]) & (el[1] === targetTile[1])) possibleExits += 1;
			});
		}
		return possibleExits;

		function spreadInAllDirections(prospectiveMove, takenTiles) {
			const newTiles = getLegalMoves(prospectiveMove, takenTiles);
			if (isNonEmptyArray(newTiles)) {
				newTiles.forEach(function(el) {
					takenTiles.push(el);
					spreadInAllDirections(el, takenTiles);
				});
			}
		}
	}

	//One clear goal
	function generateStartEndPoints() {
		let edges = getEdgeCoordinates();
		let startCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1)[0];
		let endCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1)[0];
		return [ startCoordinate, endCoordinate ];
	}

	//One clear goal
	function getEdgeCoordinates() {
		//calculates coordinates around edge in clockwise order
		let coordinates = [];
		for (let x = 0; x < mapWidth - 1; x++) {
			coordinates.push([ x, 0 ]); //top
		}
		for (let y = 0; y < mapHeight - 1; y++) {
			coordinates.push([ mapWidth - 1, y ]); //right
		}
		for (let x = mapWidth - 1; x > 0; x--) {
			coordinates.push([ x, mapHeight - 1 ]); //bottom
		}
		for (let y = mapHeight - 1; y > 0; y--) {
			coordinates.push([ 0, y ]); //left
		}
		return coordinates;
	}

	//One clear goal
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

	//One clear goal
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

	//Slightly mixed goals
	function getStartingDirection(start) {
		let possibleDirections = [];
		if (start[0] === 0) {
			possibleDirections.push(1); // comes in from left
		}
		if (start[1] === 0) {
			possibleDirections.push(2); // comes in from top
		}
		if (start[0] === mapWidth - 1) {
			possibleDirections.push(3); // comes in from right
		}
		if (start[1] === mapHeight - 1) {
			possibleDirections.push(0); // comes in from bottom
		}
		return possibleDirections[randomIntFromInterval(0, possibleDirections.length - 1)];
	}

	//Slightly mixed goals
	function getEndingDirection(end) {
		let possibleDirections = [];
		if (end[0] === 0) {
			possibleDirections.push(3); // leaves via left
		}
		if (end[1] === 0) {
			possibleDirections.push(0); // leaves via top
		}
		if (end[0] === mapWidth - 1) {
			possibleDirections.push(1); // leaves via right
		}
		if (end[1] === mapHeight - 1) {
			possibleDirections.push(2); // leaves via bottom
		}
		return possibleDirections[randomIntFromInterval(0, possibleDirections.length - 1)];
	}

	//One clear goal, but should be passed directions instead of calling getDirectionOfEachMove()
	function directionsToTrackRailType(dirs) {
		let railTypeArray = [];
		for (let i = 0; i < dirs.length; i++) {
			if ((dirs[i] === 0 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 2)) {
				railTypeArray.push('vertical');
			}
			if ((dirs[i] === 1 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 3)) {
				railTypeArray.push('horizontal');
			}
			if ((dirs[i] === 2 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 0)) {
				railTypeArray.push('topRightCorner');
			}
			if ((dirs[i] === 3 && dirs[i + 1] === 2) || (dirs[i] === 0 && dirs[i + 1] === 1)) {
				railTypeArray.push('bottomRightCorner');
			}
			if ((dirs[i] === 0 && dirs[i + 1] === 3) || (dirs[i] === 1 && dirs[i + 1] === 2)) {
				railTypeArray.push('bottomLeftCorner');
			}
			if ((dirs[i] === 1 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 3)) {
				railTypeArray.push('topLeftCorner');
			}
		}
		return railTypeArray;
	}

	function generateDefaultTileIndices(tileCount) {
		let indices = [ 0, tileCount - 1 ];
		for (let i = 0; i < Math.floor(tileCount / 8); i++) {
			indices.push(randomIntFromInterval(1, tileCount - 1));
		}
		return [ ...new Set(indices) ];
	}

	///UTILITY FUNCTIONS

	function randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
	}
};
export const compareArrays = (arr1, arr2) => {
	let arrEqual = false;
	if (arr1.length === arr2.length) {
		arrEqual = arr1.every((v, i) => v === arr2[i]);
	}
	return arrEqual;
};

export const isNonEmptyArray = (array) => {
	//return false if equal to [] or data type other than array
	return Array.isArray(array) && array.length > 0;
};

//One Clear Goal
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

// function print(value) {
// 	console.log(JSON.parse(JSON.stringify(value)));
// }

/*
//One Clear Goal
function getQuadrants() {
	const xHalfWay = Math.floor(mapWidth / 2);
	const yHalfWay = Math.floor(mapHeight / 2);

	// O: topLeft, 1: topRight, 2: bottomLeft, 3:bottomRight
	const quadrantCoordinates = [
		getCoordinatesOfBoundZone(0, xHalfWay, 0, yHalfWay),
		getCoordinatesOfBoundZone(xHalfWay, mapWidth, 0, yHalfWay),
		getCoordinatesOfBoundZone(0, xHalfWay, yHalfWay, mapHeight),
		getCoordinatesOfBoundZone(xHalfWay, mapWidth, yHalfWay, mapHeight)
	];
	return quadrantCoordinates;
}

//One Clear Goal
function getCoordinatesOfBoundZone(xLow, xHigh, yLow, yHigh) {
	let zoneArray = [];
	for (let y = yLow; y < yHigh; y++) {
		for (let x = xLow; x < xHigh; x++) {
			zoneArray.push([ x, y ]);
		}
	}
	return zoneArray;
}

//One Clear Goal
function getQuadrantOfCoordinate(coordinate) {
	let coordinateQuadrant;
	const quadrants = getQuadrants();
	for (let i = 0; i < quadrants.length; i++) {
		quadrants[i].forEach(function(el) {
			if (compareArrays(el, coordinate)) coordinateQuadrant = i;
		});
	}
	return coordinateQuadrant;
}

*/
