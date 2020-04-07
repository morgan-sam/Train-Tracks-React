import React, { useRef, useEffect } from 'react';

import MapTile from './MapTile';
import HeadingTile from './HeadingTile';

import { compareArrays, isNonEmptyArray } from '../utility/utilityFunctions';
import { convertDirectionArrayToRailTypes, convertRailTypeToTrackImage } from '../utility/trackConversions';

import { findDirectionFromMove } from '../generation/generateMap';
import { mapDragEvent } from '../Events/mapDragEvent';

import MapBackground from '../render/mapBackground';

export const Map = (props) => {
	const currentHoverTile = useRef([ null, null ]);
	const currentHoverTileClass = useRef();
	const previousHoverTile = useRef();
	const previousHoverTileClass = useRef();
	const previousValueOfLeftClickTile = useRef();
	const initialLeftClickValue = useRef();
	const leftClickDragArray = useRef();
	const rightClickDragValue = useRef();

	///////////// MAP - MOUSE EVENTS FUNCTIONS /////////////

	function leftClickEvent(mouseEventObject) {
		previousValueOfLeftClickTile.current = getRailTypeOfCoordinate(mouseEventObject.tile);
		initialLeftClickValue.current = mouseEventObject;
		leftClickDragArray.current = [ null, null, mouseEventObject.tile ];
	}

	function rightClickEvent(mouseEventObject) {
		setRightClickDragValue(mouseEventObject);
		determineRemoveOrPlaceX(mouseEventObject);
	}

	function bothClickEvent(mouseEventObject) {
		determineIfToPlaceT(mouseEventObject);
	}

	function setRightClickDragValue(mouseEventObject) {
		const tileValue = getRailTypeOfCoordinate(mouseEventObject.tile);
		rightClickDragValue.current = tileValue === null ? 'X' : 'DELETE';
	}

	function determineRemoveOrPlaceX(mouseEventObject) {
		if (mouseEventObject.tileClass === 'mapTile') {
			if (getRailTypeOfCoordinate(mouseEventObject.tile)) removePlacedTrack(mouseEventObject.tile);
			else placeTile(mouseEventObject.tile, rightClickDragValue.current);
		}
	}

	function leftReleaseEvent(mouseEventObject) {
		if (isNonEmptyArray(leftClickDragArray.current)) {
			placeTrackIfLeftClickNoDrag(mouseEventObject);
			leftClickDragArray.current = [];
		}
	}

	function rightReleaseEvent() {
		rightClickDragValue.current = undefined;
	}

	function checkIfHoverTileChanged(mouseEventObject) {
		return !compareArrays(mouseEventObject.tile, currentHoverTile.current);
	}

	function updateHoverTileState(mouseEventObject) {
		previousHoverTile.current = currentHoverTile.current;
		currentHoverTile.current = mouseEventObject.tile;
		currentHoverTileClass.current = mouseEventObject.tileClass;
	}

	function placeTrackIfLeftClickNoDrag(mouseEventObject) {
		if (
			compareArrays(initialLeftClickValue.current.tile, currentHoverTile.current) &&
			mouseEventObject.tileClass === 'mapTile'
		) {
			placeTile(mouseEventObject.tile, mouseEventObject.railType);
		}
	}

	function hoverStartEvent(mouseEventObject) {
		if (checkIfHoverTileChanged(mouseEventObject)) {
			updateHoverTileState(mouseEventObject);
			if (mouseEventObject.mouseButton === 1 && checkIfHoverToAdjacent()) {
				mapDragEvent();
				hoverWhileHoldingLeftMouseButton(mouseEventObject);
			}
			if (mouseEventObject.mouseButton === 2) {
				hoverWhileHoldingRightMouseButton(mouseEventObject);
			}
			if (mouseEventObject.mouseButton === 3) {
				hoverWhileHoldingBothMouseButtons(mouseEventObject);
			}
		}
	}

	function checkIfHoverToAdjacent() {
		let hoverAdjacent = true;
		if (currentHoverTile.current[0] > previousHoverTile.current[0] + 1) hoverAdjacent = false;
		if (currentHoverTile.current[0] < previousHoverTile.current[0] - 1) hoverAdjacent = false;
		if (currentHoverTile.current[1] > previousHoverTile.current[1] + 1) hoverAdjacent = false;
		if (currentHoverTile.current[1] < previousHoverTile.current[1] - 1) hoverAdjacent = false;
		return hoverAdjacent;
	}

	function hoverEndEvent(senderClassname) {
		previousHoverTileClass.current = senderClassname;
	}

	function hoverWhileHoldingLeftMouseButton(mouseEventObject) {
		if (isNonEmptyArray(leftClickDragArray.current)) {
			leftClickDragArray.current.shift();
			leftClickDragArray.current.push(mouseEventObject.tile);
			placedDraggedTrack(mouseEventObject.tile);
		}
	}

	function hoverWhileHoldingRightMouseButton(mouseEventObject) {
		if (rightClickDragValue.current === 'X') {
			if (mouseEventObject.tileClass === 'mapTile') placeTile(mouseEventObject.tile, rightClickDragValue.current);
		} else if (rightClickDragValue.current === 'DELETE') removePlacedTrack(mouseEventObject.tile);
	}

	function hoverWhileHoldingBothMouseButtons(mouseEventObject) {
		determineIfToPlaceT(mouseEventObject);
	}

	function determineIfToPlaceT(mouseEventObject) {
		if (mouseEventObject.mouseButton === 3) {
			if (mouseEventObject.tileClass === 'mapTile') placeTile(mouseEventObject.tile, 'T');
		}
	}

	///////////// MAP - MOUSE DRAG CONTROL FUNCTIONS /////////////

	// Needs to be refactored, far too long
	function placedDraggedTrack(coordinate) {
		const directions = calculateDragDirection();
		const railType = convertDirectionArrayToRailTypes(directions);

		let tilesToPlace = [];

		let newCorner;
		//Only change tile to new corner if on first drag
		if (compareArrays(previousHoverTile.current, initialLeftClickValue.current.tile))
			newCorner = convertConnectedRailToCorner(coordinate);
		if (isNonEmptyArray(newCorner)) tilesToPlace.unshift(...getNewCornerTiles(newCorner));
		else {
			if (previousHoverTileClass.current === 'mapTile') {
				let railShouldChange = shouldStartRailChange(
					previousValueOfLeftClickTile.current,
					initialLeftClickValue.current.tile,
					coordinate
				);
				//Only replaces first coordinate if no tile present, but maintains snaking movement on later drags

				if (checkIfNotFirstDragTile() || checkIfFirstDragTileIsEmptyOrT() || railShouldChange) {
					tilesToPlace.unshift({ tile: previousHoverTile.current, railType: railType[0] });
				}
			}
			if (currentHoverTileClass.current === 'mapTile' && !checkIfCurrentTileIsConnectedToLast()) {
				tilesToPlace.unshift({ tile: currentHoverTile.current, railType: railType[1] });
			}
		}
		placeMultipleTiles(tilesToPlace);
	}

	function checkIfCurrentTileIsConnectedToLast() {
		let moveDirection = findDirectionFromMove(previousHoverTile.current, currentHoverTile.current);
		let connectedDirections = getConnectedAdjacentTracksDirections(previousHoverTile.current);
		let connection = connectedDirections.includes(moveDirection);
		return connection;
	}

	function checkIfFirstDragTileIsEmptyOrT() {
		return !previousValueOfLeftClickTile.current || previousValueOfLeftClickTile.current === 'T';
	}

	function checkIfNotFirstDragTile() {
		return !compareArrays(previousHoverTile.current, initialLeftClickValue.current.tile);
	}

	function getNewCornerTiles(newCorner) {
		let tilesToPlace = [];
		if (previousHoverTileClass.current === 'mapTile') {
			tilesToPlace.unshift({ tile: previousHoverTile.current, railType: newCorner[0] });
		}
		if (currentHoverTileClass.current === 'mapTile' && !checkIfCurrentTileIsConnectedToLast()) {
			tilesToPlace.unshift({ tile: currentHoverTile.current, railType: newCorner[1] });
		}
		return tilesToPlace;
	}

	function shouldStartRailChange(startType, startCoordinate, nextCoordinate) {
		let railShouldChange = false;
		switch (findDirectionFromMove(nextCoordinate, startCoordinate)) {
			case 0:
				if (
					startType === 'bottomLeftCorner' ||
					startType === 'bottomRightCorner' ||
					startType === 'horizontal'
				) {
					railShouldChange = true;
				}
				break;
			case 1:
				if (startType === 'bottomLeftCorner' || startType === 'topLeftCorner' || startType === 'vertical') {
					railShouldChange = true;
				}
				break;
			case 2:
				if (startType === 'topLeftCorner' || startType === 'topRightCorner' || startType === 'horizontal') {
					railShouldChange = true;
				}
				break;
			case 3:
				if (startType === 'bottomRightCorner' || startType === 'topRightCorner' || startType === 'vertical') {
					railShouldChange = true;
				}
				break;
			default:
		}
		return railShouldChange;
	}

	function convertConnectedRailToCorner(newCoordinate) {
		const dragDirection = findDirectionFromMove(newCoordinate, previousHoverTile.current);
		let connectedDirections = getConnectedAdjacentTracksDirections(previousHoverTile.current);
		if (isNonEmptyArray(connectedDirections)) {
			const initialDirection = connectedDirections[randomInt(0, connectedDirections.length - 1)];
			const directions = [ initialDirection, dragDirection ];
			return convertDirectionArrayToRailTypes(directions);
		}
	}

	function getConnectedAdjacentTracksDirections(coordinate) {
		//checks which tiles are pointing towards the dragged tile
		const adjacentTracks = getAdjacentTracks(coordinate);
		const connectedDirectionArray = adjacentTracks
			.map(function(adj) {
				let connectedDirection;
				if (adj.position === 0) {
					if (
						adj.railType === 'vertical' ||
						adj.railType === 'bottomLeftCorner' ||
						adj.railType === 'bottomRightCorner'
					) {
						connectedDirection = 2;
					}
				}
				if (adj.position === 3) {
					if (
						adj.railType === 'horizontal' ||
						adj.railType === 'bottomRightCorner' ||
						adj.railType === 'topRightCorner'
					) {
						connectedDirection = 1;
					}
				}
				if (adj.position === 2) {
					if (
						adj.railType === 'vertical' ||
						adj.railType === 'topLeftCorner' ||
						adj.railType === 'topRightCorner'
					) {
						connectedDirection = 0;
					}
				}
				if (adj.position === 1) {
					if (
						adj.railType === 'horizontal' ||
						adj.railType === 'topLeftCorner' ||
						adj.railType === 'bottomLeftCorner'
					) {
						connectedDirection = 3;
					}
				}
				return connectedDirection;
			})
			.filter((el) => el !== undefined);
		return connectedDirectionArray;
	}

	function getAdjacentTracks(coordinate) {
		let adjacentTracks = [];
		let adjTile;

		const pushAdjTileIfExist = (adjTile, position) => {
			let adjRail = getRailTypeOfCoordinate(adjTile);
			if (!adjRail) adjRail = checkIfTileIsDefault(props.trainTrackMap, adjTile[0], adjTile[1]);
			if (adjRail) {
				adjacentTracks.push({
					tile: adjTile,
					railType: adjRail,
					position
				});
			}
		};

		if (coordinate[0] > 0) {
			adjTile = [ coordinate[0] - 1, coordinate[1] ];
			pushAdjTileIfExist(adjTile, 3);
		}
		if (coordinate[0] < props.mapWidth) {
			adjTile = [ coordinate[0] + 1, coordinate[1] ];
			pushAdjTileIfExist(adjTile, 1);
		}
		if (coordinate[1] > 0) {
			adjTile = [ coordinate[0], coordinate[1] - 1 ];
			pushAdjTileIfExist(adjTile, 0);
		}
		if (coordinate[1] < props.mapHeight) {
			adjTile = [ coordinate[0], coordinate[1] + 1 ];
			pushAdjTileIfExist(adjTile, 2);
		}

		return adjacentTracks;
	}

	function calculateDragDirection() {
		let directions = [];
		const tiles = leftClickDragArray.current;
		const numberOfNulls = tiles.findIndex((el) => el !== null);
		for (let i = numberOfNulls; i < tiles.length - 1; i++) {
			directions.push(findDirectionFromMove(tiles[i + 1], tiles[i]));
		}
		return directions;
	}

	///////////// MAP - TRACK PLACEMENT FUNCTIONS /////////////

	function placeTile(coordinate, value) {
		const trackSquareInfo = {
			tile: coordinate,
			railType: value
		};
		placeMultipleTiles([ trackSquareInfo ]);
	}

	async function placeMultipleTiles(newTileObjArray) {
		let newPlacedTrackArray = filterPlacedTracksOfNewTiles(newTileObjArray);
		newTileObjArray.forEach(function(el) {
			if (el.railType) newPlacedTrackArray.push(el);
		});
		await props.setPlacedTracks(newPlacedTrackArray);
		await checkIfPlacedTilesAllCorrect(props.trainTrackMap);
	}

	function filterPlacedTracksOfNewTiles(newTiles) {
		let nonConflictingPlacedTracks = [];
		props.placedTracks.forEach(function(track) {
			let placedTrackConflict = false;
			newTiles.forEach(function(el) {
				if (compareArrays(track.tile, el.tile)) placedTrackConflict = true;
			});
			if (!placedTrackConflict) nonConflictingPlacedTracks.push(track);
		});
		return nonConflictingPlacedTracks;
	}

	async function removePlacedTrack(trackCoordinates) {
		const filteredTracks = props.placedTracks.filter(function(track) {
			return !(track.tile[0] === trackCoordinates[0] && track.tile[1] === trackCoordinates[1]);
		});
		await props.setPlacedTracks(filteredTracks);
		await checkIfPlacedTilesAllCorrect(props.trainTrackMap);
	}

	///////////// MAP - RETRIEVAL FUNCTIONS /////////////

	function getRailTypeOfCoordinate(trackCoordinates) {
		let railType = null;
		props.placedTracks.forEach(function(el) {
			if (el.tile[0] === trackCoordinates[0] && el.tile[1] === trackCoordinates[1]) railType = el.railType;
		});
		return railType;
	}

	function checkIfTileIsDefault(trainTrackMap, x, y) {
		let trackDefaultTile = null;
		trainTrackMap.tracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y && el.defaultTrack) trackDefaultTile = el.railType;
		});
		return trackDefaultTile;
	}

	function getAllDefaultTiles(trainTrackMap) {
		let defaultTileArr = [];
		trainTrackMap.tracks.forEach(function(el) {
			if (el.defaultTrack) defaultTileArr.push(el);
		});
		return defaultTileArr;
	}

	///////////// MAP - HEADING FUNCTIONS /////////////

	function getRowColumnFillstate(axis, index) {
		let fillState = 'underfilled';
		const defaultTiles = getAllDefaultTiles(props.trainTrackMap);
		let axisNum = axis === 'x' ? 0 : 1;

		let placedTrackCount = defaultTiles.filter((el) => el.tile[axisNum] === index).length;
		const tilesOnAxis = props.trainTrackMap.tracks.filter((el) => el.tile[axisNum] === index).length;
		props.placedTracks.forEach(function(el) {
			if (el.tile[axisNum] === index && el.railType !== 'X') placedTrackCount++;
		});

		if (tilesOnAxis < placedTrackCount) fillState = 'overfilled';
		else if (tilesOnAxis === placedTrackCount) fillState = 'full';
		return fillState;
	}

	///////////// MAP - WIN STATE FUNCTIONS /////////////

	function checkIfPlacedTilesAllCorrect(trainTrackMap) {
		const correctTileCount = getCorrectTileCount(trainTrackMap, props.placedTracks);
		const defaultTileCount = getAllDefaultTiles(trainTrackMap).length;
		const placedRailTrackCount = getPlacedRailTrackCount();
		if (
			correctTileCount === trainTrackMap.tracks.length &&
			trainTrackMap.tracks.length === placedRailTrackCount + defaultTileCount
		) {
			props.setGameCompleteState(true);
		}
	}

	function getPlacedRailTrackCount() {
		const placedTiles = props.placedTracks;
		const placedRailTrackCount = placedTiles.filter((el) => el.railType !== 'X').length;
		return placedRailTrackCount;
	}

	function getCorrectTileCount(trainTrackMap, placedTracks) {
		return trainTrackMap.tracks.filter(function(winning) {
			let correctTile = winning.defaultTrack;
			placedTracks.forEach(function(placed) {
				if (compareArrays(winning.tile, placed.tile) && winning.railType === placed.railType)
					correctTile = true;
			});
			return correctTile;
		}).length;
	}

	///////////// MAP - RENDER FUNCTIONS /////////////

	const activeMouseEventsObject = {
		leftClickEvent: props.controlsActive ? leftClickEvent : () => null,
		rightClickEvent: props.controlsActive ? rightClickEvent : () => null,
		bothClickEvent: props.controlsActive ? bothClickEvent : () => null,
		leftReleaseEvent: props.controlsActive ? leftReleaseEvent : () => null,
		rightReleaseEvent: props.controlsActive ? rightReleaseEvent : () => null,
		hoverStartEvent: props.controlsActive ? hoverStartEvent : () => null,
		hoverEndEvent: props.controlsActive ? hoverEndEvent : () => null
	};

	const emptyMouseEventsObject = {
		leftClickEvent: () => null,
		rightClickEvent: () => null,
		bothClickEvent: () => null,
		leftReleaseEvent: () => null,
		rightReleaseEvent: () => null,
		hoverStartEvent: () => null,
		hoverEndEvent: () => null,
		leftClickDragArray: null,
		rightClickDragValue: null
	};

	function renderMapTile(x, y, railImage, mapSolutionVisible) {
		return (
			<MapTile
				className="mapTile"
				tileRemSize={props.tileRemSize}
				key={x}
				x={x}
				y={y}
				mapSolutionVisible={mapSolutionVisible}
				trackData={railImage}
				{...activeMouseEventsObject}
			/>
		);
	}

	function renderDefaultTrack(x, y, defaultRailType, highlighted) {
		return (
			<MapTile
				className="defaultTrack"
				tileRemSize={props.tileRemSize}
				key={x}
				x={x}
				y={y}
				highlighted={highlighted}
				trackData={convertRailTypeToTrackImage(defaultRailType)}
				{...activeMouseEventsObject}
			/>
		);
	}

	function renderCompleteTrack(x, y, defaultRailType, highlighted) {
		return (
			<MapTile
				className="completeTrack"
				tileRemSize={props.tileRemSize}
				key={x}
				x={x}
				y={y}
				highlighted={highlighted}
				trackData={convertRailTypeToTrackImage(defaultRailType)}
				{...emptyMouseEventsObject}
			/>
		);
	}

	function renderEmptyTile(x, y) {
		return (
			<MapTile
				className="emptyTile"
				tileRemSize={props.tileRemSize}
				key={x}
				x={x}
				y={y}
				highlighted={false}
				trackData={convertRailTypeToTrackImage(null)}
				{...emptyMouseEventsObject}
			/>
		);
	}

	function renderTransparentTile(x, y) {
		return (
			<MapTile
				className="transparentTile"
				tileRemSize={props.tileRemSize}
				key={x}
				x={x}
				y={y}
				highlighted={false}
				trackData={convertRailTypeToTrackImage(null)}
				{...emptyMouseEventsObject}
			/>
		);
	}

	///////////// MAP - MAP COMPONENT GENERATION FUNCTIONS /////////////

	function placeColumnHeader(trainTrackMap, x, y) {
		const headerLabel = trainTrackMap.headerLabels.x[x];
		const fillState = props.gameComplete ? 'full' : getRowColumnFillstate('x', x);
		return (
			<HeadingTile
				key={x}
				x={x}
				y={y - 1}
				headerLabel={headerLabel}
				fillState={fillState}
				tileRemSize={props.tileRemSize}
			/>
		);
	}

	function placeRowHeader(trainTrackMap, x, y) {
		const headerLabel = trainTrackMap.headerLabels.y[y - 1];
		const fillState = props.gameComplete ? 'full' : getRowColumnFillstate('y', y - 1);
		return (
			<HeadingTile
				key={x}
				x={x}
				y={y - 1}
				headerLabel={headerLabel}
				fillState={fillState}
				tileRemSize={props.tileRemSize}
			/>
		);
	}

	function placeCompletedMapTrack(trainTrackMap, x, y) {
		let defaultTile;
		let highlighted = false;
		trainTrackMap.tracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y - 1) {
				defaultTile = el.railType;
				if (props.defaultTilesHighlighted && el.defaultTrack) highlighted = true;
			}
		});
		if (defaultTile) return renderCompleteTrack(x, y - 1, defaultTile, highlighted);
		else return renderEmptyTile(x, y - 1);
	}

	function placeUserPlacedTrack(x, y) {
		let railImage;
		props.placedTracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y - 1) railImage = convertRailTypeToTrackImage(el.railType);
		});
		if (railImage) return renderMapTile(x, y - 1, railImage);
		else return renderMapTile(x, y - 1, null);
	}

	function placeGameActiveMapTrack(trainTrackMap, x, y) {
		const defaultTile = checkIfTileIsDefault(trainTrackMap, x, y - 1);
		if (defaultTile) return renderDefaultTrack(x, y - 1, defaultTile, props.defaultTilesHighlighted);
		else return placeUserPlacedTrack(x, y);
	}

	function placeMainMapTile(trainTrackMap, x, y) {
		if (props.gameComplete || props.mapSolutionVisible) return placeCompletedMapTrack(trainTrackMap, x, y);
		else return placeGameActiveMapTrack(trainTrackMap, x, y);
	}

	function generateMapComponents(trainTrackMap) {
		let generatedMapComponents = [];
		for (let y = 0; y < props.mapHeight + 1; y++) {
			generatedMapComponents.push(
				<div className="mapRow" key={y}>
					{[ ...Array(props.mapWidth + 1) ].map((el, x) => {
						if (y === 0) return placeColumnHeader(trainTrackMap, x, y);
						else if (x === props.mapWidth) return placeRowHeader(trainTrackMap, x, y);
						else if (!props.mapVisible) return renderTransparentTile(x, y - 1);
						else return placeMainMapTile(trainTrackMap, x, y);
					})}
				</div>
			);
		}
		return generatedMapComponents;
	}

	useEffect(
		() => {
			checkIfPlacedTilesAllCorrect(props.trainTrackMap);
		},
		[ props.placedTracks ]
	);

	///////////// MAP - MAIN RENDER FUNCTION /////////////

	const trainTrackMap = props.trainTrackMap;
	const mapComponents = generateMapComponents(trainTrackMap);

	return (
		<div className="map">
			{mapComponents}
			<MapBackground />
		</div>
	);
};
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
export default Map;
