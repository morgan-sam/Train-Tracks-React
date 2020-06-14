import React, { useRef, useEffect, useState } from 'react';
import Board from 'js/components/Board';

import { compareArrays, isNonEmptyArray, shiftPushArray } from 'js/utility/utilityFunctions';
import { getCombinedArrayOfNewAndOldTiles } from 'js/trackFunctions/trackPlacement';
import { railDragEvent } from 'js/trackFunctions/railDragEvent';
import { getRailTypeOfPlacedTile, checkIfPlacedTilesAllCorrect } from 'js/trackFunctions/trackParsing';

import MapAmbientBackground from 'js/components/MapAmbientBackground.jsx';

export const Map = (props) => {
	const { trainTrackMap, placedTracks, setPlacedTracks, setGameWon, savePopUp, themeColor, visualEffects } = props;

	const [ currentMapInfo, setCurrentMapInfo ] = useState([]);
	const dragArray = useRef([ null, null, null ]);
	const rightClickDragValue = useRef();

	const currentHoverTile = useRef([ null, null ]);
	const previousHoverTile = useRef();

	///////////// MAP - MOUSE EVENTS FUNCTIONS /////////////

	const leftClickEvent = (mouseEventObject) => (dragArray.current = [ null, null, mouseEventObject.tile ]);

	const rightClickEvent = (mouseEventObject) => {
		setRightClickDragValue(mouseEventObject);
		determineRemoveOrPlaceX(mouseEventObject);
	};

	const bothClickEvent = (mouseEventObject) => determineIfToPlaceT(mouseEventObject);

	const setRightClickDragValue = (mouseEventObject) => {
		const tileValue = getRailTypeOfPlacedTile(mouseEventObject.tile, placedTracks);
		rightClickDragValue.current = tileValue === null ? 'X' : 'DELETE';
	};

	const determineRemoveOrPlaceX = (mouseEventObject) => {
		if (mouseEventObject.tileClass === 'mapTile') {
			if (getRailTypeOfPlacedTile(mouseEventObject.tile, placedTracks)) removePlacedTrack(mouseEventObject.tile);
			else placeTile(mouseEventObject.tile, rightClickDragValue.current);
		}
	};

	const leftReleaseEvent = (mouseEventObject) => {
		if (dragArray.current.filter((o) => o).length === 1 && mouseEventObject.tileClass === 'mapTile') {
			placeTile(mouseEventObject.tile, mouseEventObject.railType);
			dragArray.current = [];
		}
	};

	const rightReleaseEvent = () => (rightClickDragValue.current = undefined);

	const checkIfHoverTileChanged = (mouseEventObject) =>
		!compareArrays(mouseEventObject.tile, currentHoverTile.current);

	const updateHoverTileState = (mouseEventObject) => {
		previousHoverTile.current = currentHoverTile.current;
		currentHoverTile.current = mouseEventObject.tile;
	};

	const hoverStartEvent = (mouseEventObject) => {
		if (checkIfHoverTileChanged(mouseEventObject)) {
			updateHoverTileState(mouseEventObject);
			if (mouseEventObject.mouseButton === 1 && checkIfHoverToAdjacent())
				hoverWhileHoldingLeftMouseButton(mouseEventObject);
			if (mouseEventObject.mouseButton === 2) hoverWhileHoldingRightMouseButton(mouseEventObject);
			if (mouseEventObject.mouseButton === 3) hoverWhileHoldingBothMouseButtons(mouseEventObject);
		}
	};

	const checkIfHoverToAdjacent = () => {
		let hoverAdjacent = true;
		if (currentHoverTile.current[0] > previousHoverTile.current[0] + 1) hoverAdjacent = false;
		if (currentHoverTile.current[0] < previousHoverTile.current[0] - 1) hoverAdjacent = false;
		if (currentHoverTile.current[1] > previousHoverTile.current[1] + 1) hoverAdjacent = false;
		if (currentHoverTile.current[1] < previousHoverTile.current[1] - 1) hoverAdjacent = false;
		return hoverAdjacent;
	};

	const hoverWhileHoldingLeftMouseButton = (mouseEventObject) => {
		if (isNonEmptyArray(dragArray.current)) {
			dragArray.current = shiftPushArray(dragArray.current, [ mouseEventObject.tile ]);
			const draggedTilesToPlace = railDragEvent(dragArray.current, currentMapInfo);
			placeMultipleTiles(draggedTilesToPlace);
		}
	};

	const hoverWhileHoldingRightMouseButton = (mouseEventObject) => {
		if (rightClickDragValue.current === 'X') {
			if (mouseEventObject.tileClass === 'mapTile') placeTile(mouseEventObject.tile, rightClickDragValue.current);
		} else if (rightClickDragValue.current === 'DELETE') removePlacedTrack(mouseEventObject.tile);
	};

	const hoverWhileHoldingBothMouseButtons = (mouseEventObject) => determineIfToPlaceT(mouseEventObject);

	const determineIfToPlaceT = (mouseEventObject) => {
		const { tile, mouseButton, tileClass } = mouseEventObject;
		if (mouseButton === 3 && tileClass === 'mapTile') placeTile(tile, 'T');
	};

	///////////// MAP - TRACK PLACEMENT FUNCTIONS /////////////

	const placeTile = (coordinate, value) => {
		const trackSquareInfo = {
			tile: coordinate,
			railType: value
		};
		placeMultipleTiles([ trackSquareInfo ]);
	};

	const placeMultipleTiles = async (newTiles) => {
		const allTilesOnMap = getCombinedArrayOfNewAndOldTiles(newTiles, {
			mapTracks: trainTrackMap.tracks,
			placedTracks: placedTracks
		});
		await setPlacedTracks(allTilesOnMap);
		await checkIfGameComplete();
	};

	const removePlacedTrack = async (trackCoordinates) => {
		const filteredTracks = placedTracks.filter((track) => {
			return !(track.tile[0] === trackCoordinates[0] && track.tile[1] === trackCoordinates[1]);
		});
		await setPlacedTracks(filteredTracks);
		await checkIfGameComplete();
	};

	///////////// ///////////// /////////////

	const checkIfGameComplete = () => {
		const placedTilesAllCorrect = checkIfPlacedTilesAllCorrect(trainTrackMap, placedTracks);
		if (placedTilesAllCorrect) setGameWon(true);
	};

	useEffect(() => checkIfGameComplete(), [ placedTracks ]);

	useEffect(
		() => {
			const defaultTracks = trainTrackMap.tracks.filter((el) => el.defaultTrack);
			const filteredTracks = placedTracks.filter((el) => el.railType !== 'X');
			setCurrentMapInfo({
				tracksOnMap: [ ...defaultTracks, ...filteredTracks ],
				axisMax: { x: trainTrackMap.headerLabels.x.length, y: trainTrackMap.headerLabels.y.length }
			});
		},
		[ placedTracks ]
	);

	///////////// MAP - MOUSE EVENTS OBJECTS /////////////

	const activeMouseEventsObject = {
		leftClickEvent: !savePopUp ? leftClickEvent : () => null,
		rightClickEvent: !savePopUp ? rightClickEvent : () => null,
		bothClickEvent: !savePopUp ? bothClickEvent : () => null,
		leftReleaseEvent: !savePopUp ? leftReleaseEvent : () => null,
		rightReleaseEvent: !savePopUp ? rightReleaseEvent : () => null,
		hoverStartEvent: !savePopUp ? hoverStartEvent : () => null
	};

	return (
		<div
			className="map"
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${trainTrackMap.headerLabels.x.length + 1}, 1fr)`,
				gridTemplateRows: `repeat(${trainTrackMap.headerLabels.y.length + 1}, 1fr)`
			}}
		>
			<Board {...props} activeMouseEventsObject={activeMouseEventsObject} />
			<MapAmbientBackground themeColor={themeColor} visualEffects={visualEffects} />
		</div>
	);
};

export default Map;
