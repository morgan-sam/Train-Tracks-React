import { checkIfArrayIsInMatrix } from 'js/utility/utilityFunctions';
import { findDirectionFromMove } from 'js/utility/directionsConversions';

const getAdjacentTiles = (coordinate, axisMax) => {
	let adjacentTiles = [];
	if (coordinate[1] > 0) adjacentTiles.push({ tile: [ coordinate[0], coordinate[1] - 1 ], position: 0 });
	if (coordinate[0] < axisMax.x) adjacentTiles.push({ tile: [ coordinate[0] + 1, coordinate[1] ], position: 1 });
	if (coordinate[1] < axisMax.y) adjacentTiles.push({ tile: [ coordinate[0], coordinate[1] + 1 ], position: 2 });
	if (coordinate[0] > 0) adjacentTiles.push({ tile: [ coordinate[0] - 1, coordinate[1] ], position: 3 });
	return adjacentTiles;
}

export const getAdjacentTracks = (coordinate, currentMapInfo) => {
	const adjacentTiles = getAdjacentTiles(coordinate, currentMapInfo.axisMax);
	const trackCoordinates = currentMapInfo.tracksOnMap.map((el) => el.tile);
	return adjacentTiles.filter((arr) => checkIfArrayIsInMatrix(arr.tile, trackCoordinates));
};

export const convertMoveArrayToDirections = (moveArr) => {
	let directions = [];
	for (let i = 0; i < moveArr.length - 1; i++) {
		const direction = findDirectionFromMove(moveArr[i + 1], moveArr[i]);
		directions.push(direction);
	}
	return directions;
};
