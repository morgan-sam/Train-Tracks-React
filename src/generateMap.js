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
	// for (let i = 0; i < 20; i++) {
	while (!mapComplete) {
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
			legalMoves = legalMoves.filter((move) => checkIfTargetMovePossible(move, generatedMap.end, generatedMap));

			//if possible remove moves that result in 2x2 of tracks, but if needed to move to exit then oblige

			//get non hook moves hook:
			const nonHookMoves = legalMoves.filter((move) => !checkIfMoveWillBeHook(move, generatedMap));

			//only apply if nonHookMoves is a non empty array
			if (Array.isArray(nonHookMoves) && nonHookMoves.length) legalMoves = nonHookMoves;

			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
			// let currentMoveDir = findMoveDirection(nextMove, generatedMap.tiles[generatedMap.tiles.length - 1]);
		}
		return nextMove;
	}

	function checkIfMoveWillBeHook(prospectiveMove, generatedMap) {
		let wasCorner = false;
		if (generatedMap.tiles.length > 2) {
			const tileThreeAgo = generatedMap.tiles[generatedMap.tiles.length - 3];
			const tileTwoAgo = generatedMap.tiles[generatedMap.tiles.length - 2];
			const tileOneAgo = generatedMap.tiles[generatedMap.tiles.length - 1];

			const firstMove = findMoveDirection(tileTwoAgo, tileThreeAgo);
			const secondMove = findMoveDirection(tileOneAgo, tileTwoAgo);
			const thirdMove = findMoveDirection(prospectiveMove, tileOneAgo);

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

	function findMoveDirection(currentMove, lastMove) {
		let moveDirection = 'none';

		const moveCalc = [ currentMove[0] - lastMove[0], currentMove[1] - lastMove[1] ];

		if (compareArrays(moveCalc, [ 0, -1 ])) moveDirection = 0; //= 'up';
		if (compareArrays(moveCalc, [ 1, 0 ])) moveDirection = 1; //= 'right';
		if (compareArrays(moveCalc, [ 0, 1 ])) moveDirection = 2; //= 'down';
		if (compareArrays(moveCalc, [ -1, 0 ])) moveDirection = 3; //= 'left';

		return moveDirection;
	}

	function checkIfTargetMovePossible(prospectiveMove, targetMove, generatedMap) {
		//spread across all squares bound by border and other tracks
		//use getLegalMoves() to find where to move
		//add all tiles to a new array
		//go until exit hit or no other moves
		//if exit then return true
		//if no exit return false
		let targetMovePossible = false;
		let newTiles;
		if (compareArrays(prospectiveMove, targetMove)) {
			targetMovePossible = true;
		} else {
			let takenTiles = [ ...generatedMap.tiles ];
			waveSpread(prospectiveMove, takenTiles);
			takenTiles.forEach(function(el) {
				if ((el[0] === targetMove[0]) & (el[1] === targetMove[1])) targetMovePossible = true;
			});
		}
		return targetMovePossible;

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
