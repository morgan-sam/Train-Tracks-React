import React, { useRef, useEffect, useState } from 'react';
import Board from './Board';

import { compareArrays, isNonEmptyArray } from '../utility/utilityFunctions';
import { getCombinedArrayOfNewAndOldTiles } from '../trackFunctions/trackPlacement';
import { railDragEvent } from '../trackFunctions/railDragEvent';
import { getAllDefaultTiles, getRailTypeOfPlacedTile } from '../trackFunctions/trackParsing';

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
		const tileValue = getRailTypeOfPlacedTile(mouseEventObject.tile, props.placedTracks);
		rightClickDragValue.current = tileValue === null ? 'X' : 'DELETE';
	}

	function determineRemoveOrPlaceX(mouseEventObject) {
		if (mouseEventObject.tileClass === 'mapTile') {
			if (getRailTypeOfPlacedTile(mouseEventObject.tile, props.placedTracks))
				removePlacedTrack(mouseEventObject.tile);
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
		const { tile, mouseButton, tileClass } = mouseEventObject;
		if (mouseButton === 3 && tileClass === 'mapTile') placeTile(tile, 'T');
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
		await checkIfGameComplete();
	}

	async function removePlacedTrack(trackCoordinates) {
		const filteredTracks = props.placedTracks.filter(function(track) {
			return !(track.tile[0] === trackCoordinates[0] && track.tile[1] === trackCoordinates[1]);
		});
		await props.setPlacedTracks(filteredTracks);
		await checkIfGameComplete();
	}

	///////////// MAP - WIN STATE FUNCTIONS /////////////

	const checkIfGameComplete = async () => {
		const placedTilesAllCorrect = await checkIfPlacedTilesAllCorrect(props.trainTrackMap, props.placedTracks);
		props.setGameCompleteState(placedTilesAllCorrect);
	};

	function checkIfPlacedTilesAllCorrect(trainTrackMap, placedTracks) {
		const correctTileCount = getCorrectTileCount(trainTrackMap, placedTracks);
		const defaultTileCount = getAllDefaultTiles(trainTrackMap).length;
		const placedRailTrackCount = getPlacedRailTrackCount(placedTracks);
		if (
			correctTileCount === trainTrackMap.tracks.length &&
			trainTrackMap.tracks.length === placedRailTrackCount + defaultTileCount
		) {
			return true;
		} else {
			return false;
		}
	}

	function getPlacedRailTrackCount(placedTracks) {
		const placedTiles = placedTracks;
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
			checkIfGameComplete();
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
