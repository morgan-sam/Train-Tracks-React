import seedrandom from 'seedrandom';

export const generateNewMap = (mapWidth, mapHeight, mapSeed) => {
	seedrandom(mapSeed, { global: true });
	const [ startCoordinate, endCoordinate ] = generateStartEndPoints();

	let generatedMap = {
		tiles: [ startCoordinate ],
		trackDirections: [],
		defaultTiles: []
	};

	generatedMap = generateMapTiles(generatedMap);
	generatedMap = directionsToTrackRailType(generatedMap);
	generatedMap = setDefaultTiles(generatedMap);

	const trainTrackMap = createFormattedTraintrackMap(generatedMap);
	return trainTrackMap;

	function createFormattedTraintrackMap(generatedMap) {
		let trainTrackMap = {
			tracks: [],
			headerLabels: generatedMapHeaders(generatedMap)
		};

		for (let i = 0; i < generatedMap.tiles.length; i++) {
			let isDefaultTrack = false;
			generatedMap.defaultTiles.forEach(function(defArr) {
				if (compareArrays(defArr, generatedMap.tiles[i])) isDefaultTrack = true;
			});

			trainTrackMap.tracks.push({
				tile: generatedMap.tiles[i],
				railType: generatedMap.trackDirections[i],
				defaultTrack: isDefaultTrack
			});
		}
		return trainTrackMap;
	}

	//One Clear Goal
	function generateMapTiles(generatedMap) {
		let mapComplete = false;
		let lastMove = startCoordinate;

		while (!mapComplete) {
			let nextMove = newMove(lastMove, generatedMap);
			generatedMap.tiles.push(nextMove);
			lastMove = nextMove;
			if (compareArrays(nextMove, endCoordinate)) {
				mapComplete = true;
			}
		}
		return generatedMap;
	}

	//One Clear Goal
	function getQuadrants() {
		const xHalfWay = Math.floor(mapWidth / 2);
		const yHalfWay = Math.floor(mapHeight / 2);

		// O: topLeft, 1: topRight, 2: bottomLeft, 3:bottomRight
		const quadrantCoordinates = [
			getCoordinatesOfZone(0, xHalfWay, 0, yHalfWay),
			getCoordinatesOfZone(xHalfWay, mapWidth, 0, yHalfWay),
			getCoordinatesOfZone(0, xHalfWay, yHalfWay, mapHeight),
			getCoordinatesOfZone(xHalfWay, mapWidth, yHalfWay, mapHeight)
		];

		function getCoordinatesOfZone(xLow, xHigh, yLow, yHigh) {
			let zoneArray = [];
			for (let y = yLow; y < yHigh; y++) {
				for (let x = xLow; x < xHigh; x++) {
					zoneArray.push([ x, y ]);
				}
			}
			return zoneArray;
		}

		return quadrantCoordinates;
	}

	//One Clear Goal
	function getLegalMoves(coordinate, tiles) {
		const adjacentMoves = getAdjacentTiles(coordinate);
		let legalMoves = removeOutOfBoundsMoves(adjacentMoves);
		legalMoves = removeMovesToVisitedTiles(legalMoves, tiles);
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

	//Not One Clear Goal
	function newMove(currentCoordinate, generatedMap) {
		let nextMove;
		let legalMoves = getLegalMoves(currentCoordinate, generatedMap.tiles);
		if (legalMoves.length === 1) {
			if (compareArrays(legalMoves[0], endCoordinate)) {
				return endCoordinate;
			}
		}
		if (Array.isArray(legalMoves) && legalMoves.length) {
			legalMoves = legalMoves.filter((move) => checkPossibleExits(move, endCoordinate, generatedMap));
			legalMoves = mutateMoveArray(legalMoves, generatedMap);
			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
		}
		return nextMove;
	}

	//One Clear Goal
	function mutateMoveArray(legalMoves, generatedMap) {
		//passes possible moves through several calulations to improve the generated map
		//only takes array input of moves that are possible to reach exit

		const moveMutateFunctions = [ removeHookMoves ];

		for (let i = 0; i < moveMutateFunctions.length; i++) {
			let currentFunc = moveMutateFunctions[i];
			let mutatedMoveArray = currentFunc(legalMoves, generatedMap);
			if (checkArrEmpty(mutatedMoveArray)) {
				break;
			} else {
				legalMoves = mutatedMoveArray;
			}
		}
		return legalMoves;
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

	//One Clear Goal
	function checkIfVisitedEachQuadrant(generatedMap) {
		const quadrants = getQuadrants();
		let visitedQuadrants = new Array(quadrants.length).fill(false);

		for (let i = 0; i < quadrants.length; i++) {
			quadrants[i].forEach(function(quadTile) {
				generatedMap.tiles.forEach(function(mapTile) {
					if (compareArrays(quadTile, mapTile)) visitedQuadrants[i] = true;
				});
			});
		}
		return visitedQuadrants;
	}

	//One Clear Goal
	function removeHookMoves(legalMoves, generatedMap) {
		if (generatedMap.tiles.length > 2) {
			legalMoves = legalMoves.filter((move) => !checkIfMoveWillBeHook(move, generatedMap));
		}
		return legalMoves;
	}

	//Clear goal but variable naming is vague
	function getTilesInEachDirection(currentTile, generatedMap) {
		let tilesInEachDirection = [];
		for (let i = 0; i < 4; i++) {
			let sign = -Math.ceil((i % 3) / 2) * 2 + 1;
			let lineTiles = generatedMap.tiles.filter((tile) => tile[i % 2] === currentTile[i % 2]);
			let directionTiles = lineTiles.filter((tile) => tile[(i + 1) % 2] * sign < currentTile[(i + 1) % 2] * sign);
			tilesInEachDirection.push(directionTiles);
		}
		return tilesInEachDirection;
	}

	// More than one clear goal, need wasCorner Function and 3 tiles ago Fn
	function checkIfMoveWillBeHook(prospectiveMove, generatedMap) {
		const lastThreeTiles = getLastSpecifiedAmountOfTiles(3, generatedMap.tiles);

		const firstMove = findDirectionFromMove(lastThreeTiles[1], lastThreeTiles[2]);
		const secondMove = findDirectionFromMove(lastThreeTiles[0], lastThreeTiles[1]);
		const thirdMove = findDirectionFromMove(prospectiveMove, lastThreeTiles[0]);

		const dirArr = [ firstMove, secondMove, thirdMove ];

		let wasHook = checkIfMoveArrayFormsHook(dirArr);
		return wasHook;
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
	function checkPossibleExits(prospectiveMove, targetMove, generatedMap) {
		//spread across all squares bound by border and other tracks
		//use getLegalMoves() to find where to move
		//add all tiles to a new array
		//go until exit hit or no other moves
		//if exit then return true
		//if no exit return false
		let possibleExits = 0;
		let newTiles;
		if (compareArrays(prospectiveMove, targetMove)) {
			possibleExits = true;
		} else {
			let takenTiles = [ ...generatedMap.tiles ];
			waveSpread(prospectiveMove, takenTiles);
			takenTiles.forEach(function(el) {
				if ((el[0] === targetMove[0]) & (el[1] === targetMove[1])) possibleExits += 1;
			});
		}
		return possibleExits;

		function waveSpread(prospectiveMove, takenTiles) {
			newTiles = getLegalMoves(prospectiveMove, takenTiles);
			if (Array.isArray(newTiles) && newTiles.length) {
				newTiles.forEach(function(el) {
					takenTiles.push(el);
					waveSpread(el, takenTiles);
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
	function generatedMapHeaders(generatedMap) {
		let mapHeaders = { x: [], y: [] };
		for (let i = 0; i < mapWidth; i++) {
			mapHeaders.x.push(getTilesInEachDirection([ i, -1 ], generatedMap)[2].length);
		}
		for (let i = 0; i < mapHeight; i++) {
			mapHeaders.y.push(getTilesInEachDirection([ -1, i ], generatedMap)[1].length);
		}
		return mapHeaders;
	}

	//One clear goal, uses global variables
	function getDirectionOfEachMove(generatedMap) {
		let directions = [];
		directions.push(getStartingDirection(startCoordinate));
		for (let i = 0; i < generatedMap.tiles.length - 1; i++) {
			let currentMoveDir = findDirectionFromMove(generatedMap.tiles[i + 1], generatedMap.tiles[i]);
			directions.push(currentMoveDir);
		}
		directions.push(getEndingDirection(endCoordinate));
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
	function directionsToTrackRailType(generatedMap) {
		const dirs = getDirectionOfEachMove(generatedMap);
		for (let i = 0; i < dirs.length; i++) {
			if ((dirs[i] === 0 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 2)) {
				generatedMap.trackDirections.push('vertical');
			}
			if ((dirs[i] === 1 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 3)) {
				generatedMap.trackDirections.push('horizontal');
			}
			if ((dirs[i] === 2 && dirs[i + 1] === 1) || (dirs[i] === 3 && dirs[i + 1] === 0)) {
				generatedMap.trackDirections.push('topRightCorner');
			}
			if ((dirs[i] === 3 && dirs[i + 1] === 2) || (dirs[i] === 0 && dirs[i + 1] === 1)) {
				generatedMap.trackDirections.push('bottomRightCorner');
			}
			if ((dirs[i] === 0 && dirs[i + 1] === 3) || (dirs[i] === 1 && dirs[i + 1] === 2)) {
				generatedMap.trackDirections.push('bottomLeftCorner');
			}
			if ((dirs[i] === 1 && dirs[i + 1] === 0) || (dirs[i] === 2 && dirs[i + 1] === 3)) {
				generatedMap.trackDirections.push('topLeftCorner');
			}
		}
		return generatedMap;
	}

	//Messy function, needs refactoring
	function setDefaultTiles(generatedMap) {
		const tileCount = generatedMap.tiles.length;
		generatedMap.defaultTiles.push(startCoordinate);
		for (let i = 0; i < Math.floor(tileCount / 8); i++) {
			generatedMap.defaultTiles.push(generatedMap.tiles[randomIntFromInterval(1, tileCount - 1)]);
		}
		generatedMap.defaultTiles.push(endCoordinate);
		generatedMap.defaultTiles = generatedMap.defaultTiles.filter(
			(el, i) => generatedMap.defaultTiles.indexOf(el) === i
		);
		return generatedMap;
	}

	///UTILITY FUNCTIONS

	function randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min); // min and max included
	}

	function checkArrEmpty(arr) {
		if (Array.isArray(arr) && arr.length) {
			return false;
		} else {
			return true;
		}
	}
};
export const compareArrays = (arr1, arr2) => {
	let arrEqual = false;
	if (arr1.length === arr2.length) {
		arrEqual = arr1.every((v, i) => v === arr2[i]);
	}
	return arrEqual;
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

function print(value) {
	console.log(JSON.parse(JSON.stringify(value)));
}
