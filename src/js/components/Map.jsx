import React, { useRef, useEffect, useState } from 'react';
import Board from './Board';

import { compareArrays, isNonEmptyArray } from '../utility/utilityFunctions';
import { getCombinedArrayOfNewAndOldTiles } from '../trackFunctions/trackPlacement';
import { railDragEvent } from '../trackFunctions/railDragEvent';
import { getAllDefaultTiles } from '../trackFunctions/trackParsing';

import MapAmbientBackground from './MapAmbientBackground.jsx';

export const Map = (props) => {
	const [ currentMapInfo, setCurrentMapInfo ] = useState([]);
	const dragArray = useRef([ null, null, null ]);
	const rightClickDragValue = useRef();

	const currentHoverTile = useRef([ null, null ]);
	const previousHoverTile = useRef();

	///////////// MAP - MOUSE EVENTS FUNCTIONS /////////////

	function leftClickEvent(mouseEventObject) {
		dragArray.current = [ null, null, mouseEventObject.tile ];
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
		if (dragArray.current.filter((o) => o).length === 1 && mouseEventObject.tileClass === 'mapTile') {
			placeTile(mouseEventObject.tile, mouseEventObject.railType);
			dragArray.current = [];
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
	}

	function hoverStartEvent(mouseEventObject) {
		if (checkIfHoverTileChanged(mouseEventObject)) {
			updateHoverTileState(mouseEventObject);
			if (mouseEventObject.mouseButton === 1 && checkIfHoverToAdjacent()) {
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

	function hoverWhileHoldingLeftMouseButton(mouseEventObject) {
		if (isNonEmptyArray(dragArray.current)) {
			dragArray.current.shift();
			dragArray.current.push(mouseEventObject.tile);
			const draggedTilesToPlace = railDragEvent(dragArray.current, currentMapInfo);
			placeMultipleTiles(draggedTilesToPlace);
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

	///////////// MAP - TRACK PLACEMENT FUNCTIONS /////////////

	function placeTile(coordinate, value) {
		const trackSquareInfo = {
			tile: coordinate,
			railType: value
		};
		placeMultipleTiles([ trackSquareInfo ]);
	}

	async function placeMultipleTiles(newTiles) {
		const allTilesOnMap = getCombinedArrayOfNewAndOldTiles(newTiles, {
			mapTracks: props.trainTrackMap.tracks,
			placedTracks: props.placedTracks
		});
		await props.setPlacedTracks(allTilesOnMap);
		await checkIfPlacedTilesAllCorrect(props.trainTrackMap);
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

	useEffect(
		() => {
			checkIfPlacedTilesAllCorrect(props.trainTrackMap);
		},
		[ props.placedTracks ]
	);

	useEffect(
		() => {
			const defaultTracks = props.trainTrackMap.tracks.filter((el) => el.defaultTrack);
			const placedTracks = props.placedTracks.filter((el) => el.railType !== 'X');
			setCurrentMapInfo({
				tracksOnMap: [ ...defaultTracks, ...placedTracks ],
				axisMax: { x: props.mapWidth, y: props.mapHeight }
			});
		},
		[ props.placedTracks ]
	);

	///////////// MAP - MAIN RENDER FUNCTION /////////////

	const activeMouseEventsObject = {
		leftClickEvent: props.controlsActive ? leftClickEvent : () => null,
		rightClickEvent: props.controlsActive ? rightClickEvent : () => null,
		bothClickEvent: props.controlsActive ? bothClickEvent : () => null,
		leftReleaseEvent: props.controlsActive ? leftReleaseEvent : () => null,
		rightReleaseEvent: props.controlsActive ? rightReleaseEvent : () => null,
		hoverStartEvent: props.controlsActive ? hoverStartEvent : () => null
	};

	const emptyMouseEventsObject = {
		leftClickEvent: () => null,
		rightClickEvent: () => null,
		bothClickEvent: () => null,
		leftReleaseEvent: () => null,
		rightReleaseEvent: () => null,
		hoverStartEvent: () => null,
		dragArray: null,
		rightClickDragValue: null
	};

	return (
		<div className="map">
			<Board
				{...props}
				activeMouseEventsObject={activeMouseEventsObject}
				emptyMouseEventsObject={emptyMouseEventsObject}
			/>
			<MapAmbientBackground />
		</div>
	);
};

export default Map;
