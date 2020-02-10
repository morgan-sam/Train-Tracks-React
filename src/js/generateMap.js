import seedrandom from 'seedrandom';

export const generateNewMap = (mapWidth, mapHeight, mapSeed) => {
	seedrandom(mapSeed, { global: true });
	let [ startCoordinate, endCoordinate ] = generateStartEndPoints();
	let generatedMap = {
		start: startCoordinate,
		end: endCoordinate,
		tiles: [ startCoordinate ],
		headerLabels: {
			x: [],
			y: []
		},
		trackDirections: [],
		defaultTiles: []
	};

	generatedMap = findTrackPath(generatedMap);
	getQuadrants(generatedMap);
	generatedMap = addHeadersToGeneratedMap(generatedMap);
	generatedMap = convertDirectionToTrackDirection(generatedMap);
	generatedMap = setDefaultTiles(generatedMap);

	const trainTrackMap = createFormattedTraintrackMap(generatedMap);
	return trainTrackMap;

	function createFormattedTraintrackMap(generatedMap) {
		let trainTrackMap = {
			tracks: [],
			headerLabels: generatedMap.headerLabels
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

	function findTrackPath(generatedMap) {
		let mapComplete = false;
		let lastMove = startCoordinate;

		while (!mapComplete) {
			let nextMove = newMove(lastMove, generatedMap);
			generatedMap.tiles.push(nextMove);
			lastMove = nextMove;
			if (generatedMap.end[0] === nextMove[0] && generatedMap.end[1] === nextMove[1]) {
				mapComplete = true;
			}
		}
		return generatedMap;
	}

	//create function to check track present in each quadrant

	function getQuadrants(generatedMap) {
		const xHalfWay = Math.floor(mapWidth / 2);
		const yHalfWay = Math.floor(mapHeight / 2);

		let quadrantCoordinates = {
			topLeft: getCoordinatesOfZone(0, xHalfWay, 0, yHalfWay),
			topRight: getCoordinatesOfZone(xHalfWay, mapWidth, 0, yHalfWay),
			bottomLeft: getCoordinatesOfZone(0, xHalfWay, yHalfWay, mapHeight),
			bottomRight: getCoordinatesOfZone(xHalfWay, mapWidth, yHalfWay, mapHeight)
		};

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

	//create function to check track length at least mapWidth * mapHeight / 3

	function getTrackLength(generatedMap) {
		const length = generatedMap.tiles.length;
		console.log(length);
	}

	function getLegalMoves(coordinate, tiles) {
		const adjacentMoves = Array(4).fill(coordinate).map((el, i) => [ el[0] + (i - 1) % 2, el[1] + (i - 2) % 2 ]);
		let legalMoves = adjacentMoves.filter(
			(el) => el[0] >= 0 && el[1] >= 0 && el[0] < mapWidth && el[1] < mapHeight
		);
		legalMoves = legalMoves.filter(function(move) {
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

	function newMove(currentCoordinate, generatedMap) {
		let nextMove;
		let legalMoves = getLegalMoves(currentCoordinate, generatedMap.tiles);
		if (legalMoves.length === 1) {
			if (legalMoves[0][0] === generatedMap.end[0] && legalMoves[0][1] === generatedMap.end[1]) {
				return generatedMap.end;
			}
		}
		if (Array.isArray(legalMoves) && legalMoves.length) {
			legalMoves = legalMoves.filter((move) => checkPossibleExits(move, generatedMap.end, generatedMap));
			legalMoves = mutateMoveArray(legalMoves, generatedMap);
			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
		}
		return nextMove;
	}

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

	function removeHookMoves(legalMoves, generatedMap) {
		legalMoves = legalMoves.filter((move) => !checkIfMoveWillBeHook(move, generatedMap));
		return legalMoves;
	}

	function removeOnePossibleMoves(legalMoves, generatedMap) {
		legalMoves = legalMoves.filter((move) => !checkIfNextMoveWillHaveOnePossibleMove(move, generatedMap));
		return legalMoves;
	}

	function getDirectionWithLessTracks(legalMoves, generatedMap) {
		const currentTile = generatedMap.tiles[generatedMap.tiles.length - 1];
		const tilesInEachDirection = getTilesInEachDirection(currentTile, generatedMap);
		const emptyTiles = getAdjacentEmptyTilesForEachDirection(currentTile, legalMoves, tilesInEachDirection);
		const maxFreeTiles = emptyTiles.reduce(function(prev, current) {
			return prev.freeTiles > current.freeTiles ? prev : current;
		});
		return [ findMoveFromDirection(currentTile, maxFreeTiles.direction) ];
	}

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

	function getAdjacentEmptyTilesForEachDirection(currentTile, legalMoves, tilesInEachDirection) {
		//Doesn't both getting free tiles of non legal moves
		let freeTilesInEachDirection = legalMoves.map(function(move) {
			let direction = findDirectionFromMove(move, currentTile);
			let freeTiles = 0;

			let edge;
			switch (direction) {
				case 0:
				case 3:
					edge = 0;
					break;
				case 1:
					edge = mapWidth - 1;
					break;
				case 2:
					edge = mapHeight - 1;
					break;
				default:
					edge = 'none';
					break;
			}
			const sign = Math.ceil((direction % 3) / 2) * 2 - 1;
			for (let i = currentTile[(direction + 1) % 2] + sign; i * sign <= edge * sign; i += sign) {
				const checkTile = [ i, currentTile[1] ];
				const checkedTiles = tilesInEachDirection[direction].map(function(takenTile) {
					if (compareArrays(checkTile, takenTile)) {
						return true;
					} else {
						return false;
					}
				});
				if (checkedTiles.includes(true)) {
					break;
				} else {
					freeTiles += 1;
				}
			}

			return {
				direction,
				freeTiles
			};
		});
		return freeTilesInEachDirection;
	}

	function checkIfMoveWillBeHook(prospectiveMove, generatedMap) {
		let wasCorner = false;
		if (generatedMap.tiles.length > 2) {
			const tileThreeAgo = generatedMap.tiles[generatedMap.tiles.length - 3];
			const tileTwoAgo = generatedMap.tiles[generatedMap.tiles.length - 2];
			const tileOneAgo = generatedMap.tiles[generatedMap.tiles.length - 1];

			const firstMove = findDirectionFromMove(tileTwoAgo, tileThreeAgo);
			const secondMove = findDirectionFromMove(tileOneAgo, tileTwoAgo);
			const thirdMove = findDirectionFromMove(prospectiveMove, tileOneAgo);

			const dirArr = [ firstMove, secondMove, thirdMove ];

			if (
				compareArrays(dirArr, [ 0, 1, 2 ]) ||
				compareArrays(dirArr, [ 1, 2, 3 ]) ||
				compareArrays(dirArr, [ 2, 3, 0 ]) ||
				compareArrays(dirArr, [ 3, 0, 1 ])
			) {
				wasCorner = true;
			}

			if (
				compareArrays(dirArr, [ 3, 2, 1 ]) ||
				compareArrays(dirArr, [ 2, 1, 0 ]) ||
				compareArrays(dirArr, [ 1, 0, 3 ]) ||
				compareArrays(dirArr, [ 0, 3, 2 ])
			) {
				wasCorner = true;
			}
		}
		return wasCorner;
	}

	function checkIfNextMoveWillHaveOnePossibleMove(prospectiveMove, generatedMap) {
		let onePossibleMove = true;
		let legalMoves = getLegalMoves(prospectiveMove, generatedMap.tiles);
		legalMoves = legalMoves.filter((move) => checkPossibleExits(move, generatedMap.end, generatedMap) > 1);
		if (Array.isArray(legalMoves) && legalMoves.length > 1) onePossibleMove = false;
		return onePossibleMove;
	}

	function findMoveFromDirection(currentTile, direction) {
		let newMove;
		switch (direction) {
			case 0:
				newMove = [ currentTile[0], currentTile[1] - 1 ];
				break;
			case 1:
				newMove = [ currentTile[0] + 1, currentTile[1] ];
				break;
			case 2:
				newMove = [ currentTile[0], currentTile[1] + 1 ];
				break;
			case 3:
				newMove = [ currentTile[0] - 1, currentTile[1] ];
				break;
			default:
				newMove = 'none';
				break;
		}
		return newMove;
	}

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

	function generateStartEndPoints() {
		let edges = getEdgeCoordinates();
		let startCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1);
		let endCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1);
		return [ startCoordinate[0], endCoordinate[0] ];
	}

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

	function addHeadersToGeneratedMap(generatedMap) {
		for (let i = 0; i < mapWidth; i++) {
			generatedMap.headerLabels.x.push(getTilesInEachDirection([ i, -1 ], generatedMap)[2].length);
		}
		for (let i = 0; i < mapHeight; i++) {
			generatedMap.headerLabels.y.push(getTilesInEachDirection([ -1, i ], generatedMap)[1].length);
		}
		return generatedMap;
	}

	function getDirectionOfEachMove(generatedMap) {
		let directions = [];
		directions.push(getStartingDirection(generatedMap.start));
		for (let i = 0; i < generatedMap.tiles.length - 1; i++) {
			let currentMoveDir = findDirectionFromMove(generatedMap.tiles[i + 1], generatedMap.tiles[i]);
			directions.push(currentMoveDir);
		}
		directions.push(getEndingDirection(generatedMap.end));
		return directions;
	}

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

	function convertDirectionToTrackDirection(generatedMap) {
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

	function setDefaultTiles(generatedMap) {
		const tileCount = generatedMap.tiles.length;
		generatedMap.defaultTiles.push(generatedMap.start);
		for (let i = 0; i < Math.floor(tileCount / 8); i++) {
			generatedMap.defaultTiles.push(generatedMap.tiles[randomIntFromInterval(1, tileCount - 1)]);
		}
		generatedMap.defaultTiles.push(generatedMap.end);
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

export const findDirectionFromMove = (currentMove, lastMove) => {
	let moveDirection = 'none';

	const moveCalc = [ currentMove[0] - lastMove[0], currentMove[1] - lastMove[1] ];

	if (compareArrays(moveCalc, [ 0, -1 ])) moveDirection = 0; //= 'up';
	if (compareArrays(moveCalc, [ 1, 0 ])) moveDirection = 1; //= 'right';
	if (compareArrays(moveCalc, [ 0, 1 ])) moveDirection = 2; //= 'down';
	if (compareArrays(moveCalc, [ -1, 0 ])) moveDirection = 3; //= 'left';

	return moveDirection;
};

function print(value) {
	console.log(JSON.parse(JSON.stringify(value)));
}
