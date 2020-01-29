export const generateNewMap = (rows, columns) => {
	let generatedMap = {};
	let [ startCoordinate, endCoordinate ] = generateStartEndPoints();
	generatedMap = {
		start: startCoordinate,
		end: endCoordinate,
		tiles: [ startCoordinate ],
		direction: []
	};

	let mapComplete = false;
	let lastMove = startCoordinate;
	for (let i = 0; i < 15; i++) {
		// while (!mapComplete) {
		let nextMove = newMove(lastMove, generatedMap);
		generatedMap.tiles.push(nextMove);
		lastMove = nextMove;
		if (generatedMap.end[0] === nextMove[0] && generatedMap.end[1] === nextMove[1]) {
			mapComplete = true;
		}
	}

	return generatedMap;

	function getLegalMoves(coordinate, tiles) {
		const adjacentMoves = Array(4).fill(coordinate).map((el, i) => [ el[0] + (i - 1) % 2, el[1] + (i - 2) % 2 ]);
		let legalMoves = adjacentMoves.filter((el) => el[0] >= 0 && el[1] >= 0 && el[0] < rows && el[1] < columns);
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

			getDirectionWithLessTracks(legalMoves, generatedMap);

			legalMoves = mutateMoveArray(legalMoves, generatedMap);

			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
			// let currentMoveDir = findDirectionFromMove(nextMove, generatedMap.tiles[generatedMap.tiles.length - 1]);
		}
		return nextMove;
	}

	function mutateMoveArray(legalMoves, generatedMap) {
		//passes possible moves through several calulations to improve the generated map
		//only takes array input of moves that are possible to reach exit

		const moveMutateFunctions = [ removeHookMoves, getDirectionWithLessTracks ];

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

		function checkArrEmpty(arr) {
			if (Array.isArray(arr) && arr.length) {
				return false;
			} else {
				return true;
			}
		}
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
		const possibleDirections = legalMoves.map((move) => findDirectionFromMove(move, currentTile));
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

			// direction 0
			// i = currentTile[1]-1
			// i > -1
			// i += -1

			// direction 1
			// i = currentTile[0]+1
			// i < rows
			// i += 1

			// direction 2
			// i = currentTile[1]+1
			// i < columns
			// i += 1

			// direction 3
			// i = currentTile[0]-1
			// i > -1
			// i += -1

			// General:

			//let sign = -Math.ceil((i % 3) / 2) * 2 + 1;

			// i = currentTile[(i+1)%2]+sign
			// i*sign < edge*sign
			// i += sign

			let edge;
			switch (direction) {
				case 0:
				case 3:
					edge = 0;
					break;
				case 1:
					edge = rows - 1;
					break;
				case 2:
					edge = columns - 1;
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
			/*

			//clockwise turns

			[0,1,2]
			[1,2,3]
			[2,3,0]
			[3,0,1]

			//anticlockwise turns

			[3,2,1]
			[2,1,0]
			[1,0,3]
			[0,3,2]

			*/
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

	function findDirectionFromMove(currentMove, lastMove) {
		let moveDirection = 'none';

		const moveCalc = [ currentMove[0] - lastMove[0], currentMove[1] - lastMove[1] ];

		if (compareArrays(moveCalc, [ 0, -1 ])) moveDirection = 0; //= 'up';
		if (compareArrays(moveCalc, [ 1, 0 ])) moveDirection = 1; //= 'right';
		if (compareArrays(moveCalc, [ 0, 1 ])) moveDirection = 2; //= 'down';
		if (compareArrays(moveCalc, [ -1, 0 ])) moveDirection = 3; //= 'left';

		return moveDirection;
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

	function compareArrays(arr1, arr2) {
		let arrEqual = false;
		if (arr1.length === arr2.length) {
			arrEqual = arr1.every((v, i) => v === arr2[i]);
		}
		return arrEqual;
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
		for (let x = 0; x < rows - 1; x++) {
			coordinates.push([ x, 0 ]); //top
		}
		for (let y = 0; y < columns - 1; y++) {
			coordinates.push([ rows - 1, y ]); //right
		}
		for (let x = rows - 1; x > 0; x--) {
			coordinates.push([ x, columns - 1 ]); //bottom
		}
		for (let y = columns - 1; y > 0; y--) {
			coordinates.push([ 0, y ]); //left
		}
		return coordinates;
	}

	function randomIntFromInterval(min, max) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
};
