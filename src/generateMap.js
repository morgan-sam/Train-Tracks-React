export const generateNewMap = (rows, columns) => {
	let generatedMap = {};
	let [ startCoordinate, endCoordinate ] = generateStartEndPoints();
	generatedMap = {
		start: startCoordinate,
		end: endCoordinate,
		tiles: [ startCoordinate ]
	};
	console.log(Math.random());
	let lastMove = startCoordinate;
	for (let i = 0; i < 14; i++) {
		let nextMove = newMove(lastMove, generatedMap);
		generatedMap.tiles.push(nextMove);
		lastMove = nextMove;
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
		const legalMoves = getLegalMoves(currentCoordinate, generatedMap.tiles);
		if (Array.isArray(legalMoves) && legalMoves.length) {
			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
			//check if next move is equal to the exit
			//if not check if exit is possible
			console.log(checkIfExitPossible(nextMove, generatedMap));
		} else {
			nextMove = [ 0, 5 ]; //no other legal moves
		}
		return nextMove;
	}

	function checkIfExitPossible(prospectiveMove, generatedMap) {
		//spread across all squares bound by border and other tracks
		//use getLegalMoves() to find where to move
		//add all tiles to a new array
		//go until exit hit or no other moves
		//if exit then return true
		//if no exit return false
		let newTiles;
		let takenTiles = [ ...generatedMap.tiles ];
		waveSpread(prospectiveMove, takenTiles);

		let exitPossible = false;
		takenTiles.forEach(function(el) {
			if ((el[0] === generatedMap.end[0]) & (el[1] === generatedMap.end[1])) exitPossible = true;
		});
		return exitPossible;

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
