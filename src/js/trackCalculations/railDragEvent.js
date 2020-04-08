import { convertDirectionTupleToRailTypes } from '../utility/trackConversions';
import { findDirectionFromMove } from '../generation/generateMap';
import { getAdjacentTracks, convertMoveArrayToDirections } from '../trackCalculations/trackUtilities';
import { randomArrayEntry, isNonEmptyArray, compareArrays } from '../utility/utilityFunctions';

export const railDragEvent = (dragArray, currentMapInfo) => {
	const truncatedDragArray = dragArray.slice(1);
	if (dragArray[0] === null) return initialDrag(truncatedDragArray, currentMapInfo);
	else return standardDrag(dragArray);
};

const standardDrag = (dragArray) => {
	const directions = convertPathToDirectionArray(dragArray);
	const railTypes = convertDirectionTupleToRailTypes(directions);
	return railTypes.map((el, i) => {
		return { tile: dragArray[i + 1], railType: el };
	});
};

const initialDrag = (dragArray, currentMapInfo) => {
	const connectedAdjacentTracks = getConnectedAdjacentTracks(dragArray[0], currentMapInfo);
	const existingTilesBoo = doDragTilesContainTracks(dragArray, currentMapInfo);
	if (existingTilesBoo) return draggingFromExistingTiles(dragArray, currentMapInfo);
	else if (isNonEmptyArray(connectedAdjacentTracks))
		return draggingFromAdjacentConnectedTile(dragArray, connectedAdjacentTracks);
	else return standardDrag([ null, ...dragArray ]);
};

const draggingFromExistingTiles = (dragArray, currentMapInfo) => {
	const dragConnections = getDragTilesConnectedTiles(dragArray, currentMapInfo);
	const directions = getTrackDirectionPath(dragConnections, dragArray);
	const railTypeArray = convertDirectionsArrayToRailTypes(directions);
	return railTypeArray.map((el, i) => {
		return { tile: dragArray[i], railType: el };
	});
};

const getTrackDirectionPath = (dragConnections, dragArray) => {
	const dragDirection = convertMoveArrayToDirections(dragArray)[0];
	let dragPath = [];
	if (dragConnections[0]) {
		const directionToFirstTile = (dragConnections[0].position + 2) % 4;
		dragPath.push(directionToFirstTile);
	} else dragPath.push(dragDirection);
	dragPath.push(dragDirection);
	if (dragConnections[1]) dragPath.push(dragConnections[1].position);
	else dragPath.push(dragDirection);
	return dragPath;
};

const convertDirectionsArrayToRailTypes = (directions) => {
	let railTypeArray = [];
	for (let i = 0; i < directions.length - 1; i++) {
		const directionTuple = [ directions[i], directions[i + 1] ];
		const tileRailType = convertDirectionTupleToRailTypes(directionTuple)[0];
		railTypeArray.push(tileRailType);
	}
	return railTypeArray;
};

const getDragTilesConnectedTiles = (dragArray, currentMapInfo) => {
	const reversedDragArray = dragArray.slice().reverse();
	const firstConnections = getSingleDragTilesConnection(dragArray, currentMapInfo);
	const secondConnections = getSingleDragTilesConnection(reversedDragArray, currentMapInfo);
	return [ firstConnections, secondConnections ];
};

const getSingleDragTilesConnection = (dragArray, currentMapInfo) => {
	const dragRailType = getRailTypeOfTile(dragArray[0], currentMapInfo);
	if (dragRailType) {
		let dragFacingTracks = getConnectedAdjacentTracks(dragArray[0], currentMapInfo);
		dragFacingTracks = dragFacingTracks.filter((el) => !compareArrays(el.coordinate, dragArray[1]));
		const connections = dragFacingTracks.filter((el) =>
			checkIfTwoRailTypesConnected(el.position, [ dragRailType, el.railType ])
		);
		return randomArrayEntry(connections);
	} else return null;
};

const getRailTypeOfTile = (coordinate, currentMapInfo) => {
	const tiles = currentMapInfo.tracksOnMap.filter((el) => compareArrays(coordinate, el.tile));
	if (isNonEmptyArray(tiles)) return tiles[0].railType;
	else return null;
};

const checkIfTwoRailTypesConnected = (direction, railTypes) => {
	switch (direction) {
		case 0:
			if (
				((railTypes[0] === 'vertical' ||
					railTypes[0] === 'topLeftCorner' ||
					railTypes[0] === 'topRightCorner') &&
					railTypes[1] === 'vertical') ||
				(railTypes[1] === 'bottomLeftCorner' || railTypes[1] === 'bottomRightCorner')
			)
				return true;
			break;
		case 1:
			if (
				(railTypes[0] === 'horizontal' ||
					railTypes[0] === 'topRightCorner' ||
					railTypes[0] === 'bottomRightCorner') &&
				(railTypes[1] === 'horizontal' ||
					railTypes[1] === 'topLeftCorner' ||
					railTypes[1] === 'bottomLeftCorner')
			)
				return true;
			break;
		case 2:
			if (
				((railTypes[0] === 'vertical' ||
					railTypes[0] === 'bottomLeftCorner' ||
					railTypes[0] === 'bottomRightCorner') &&
					railTypes[1] === 'vertical') ||
				(railTypes[1] === 'topLeftCorner' || railTypes[1] === 'topRightCorner')
			)
				return true;
			break;
		case 3:
			if (
				(railTypes[0] === 'horizontal' ||
					railTypes[0] === 'topLeftCorner' ||
					railTypes[0] === 'bottomLeftCorner') &&
				(railTypes[1] === 'horizontal' ||
					railTypes[1] === 'topRightCorner' ||
					railTypes[1] === 'bottomRightCorner')
			)
				return true;
			break;
		default:
	}
	return false;
};

const doDragTilesContainTracks = (dragArray, currentMapInfo) => {
	const firstTileTaken = currentMapInfo.tracksOnMap.filter((el) => compareArrays(el.tile, dragArray[0])).length;
	const secondTileTaken = currentMapInfo.tracksOnMap.filter((el) => compareArrays(el.tile, dragArray[1])).length;
	return Boolean(firstTileTaken + secondTileTaken > 0);
};

const draggingFromAdjacentConnectedTile = (dragArray, connectedTracks) => {
	const connectedTiles = connectedTracks.map((el) => el.coordinate);
	const randAdj = randomArrayEntry(connectedTiles);
	const coordinates = [ randAdj, dragArray[0], dragArray[1] ];
	return standardDrag(coordinates);
};

const getConnectedAdjacentTracks = (initialTile, currentMapInfo) => {
	const adjacentTracks = getAdjacentTracks(initialTile, currentMapInfo);
	const adjacentTrackData = getTileArrayData(adjacentTracks, currentMapInfo.tracksOnMap);
	return adjacentTrackData.filter((el) => checkIfAdjacentTileConnected(el.position, el.railType));
};

const getTileArrayData = (tileArray, tracksOnMap) => {
	let tileArrayData = [];
	tileArray.forEach((adj) => {
		tracksOnMap.forEach((mapTile) => {
			if (compareArrays(adj.coordinate, mapTile.tile))
				tileArrayData.push({
					coordinate: mapTile.tile,
					railType: mapTile.railType,
					position: adj.position
				});
		});
	});
	return tileArrayData;
};

const convertPathToDirectionArray = (array) => {
	let directions = [];
	for (let i = 0; i < array.length - 1; i++) {
		if (array[i] !== null && array[i + 1] !== null) directions.push(findDirectionFromMove(array[i + 1], array[i]));
	}
	return directions;
};

function checkIfAdjacentTileConnected(position, railType) {
	if (position === 0) {
		if (railType === 'vertical' || railType === 'bottomLeftCorner' || railType === 'bottomRightCorner') {
			return true;
		}
	}
	if (position === 3) {
		if (railType === 'horizontal' || railType === 'bottomRightCorner' || railType === 'topRightCorner') {
			return true;
		}
	}
	if (position === 2) {
		if (railType === 'vertical' || railType === 'topLeftCorner' || railType === 'topRightCorner') {
			return true;
		}
	}
	if (position === 1) {
		if (railType === 'horizontal' || railType === 'topLeftCorner' || railType === 'bottomLeftCorner') {
			return true;
		}
	}
	return false;
}