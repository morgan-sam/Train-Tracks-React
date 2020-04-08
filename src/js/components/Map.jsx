import React, { useRef, useEffect, useState } from 'react';

import MapTile from './MapTile';
import HeadingTile from './HeadingTile';
import EmptyTile from './EmptyTile';
import TransparentTile from './TransparentTile';

import { compareArrays, isNonEmptyArray } from '../utility/utilityFunctions';
import { convertRailTypeToTrackImage } from '../trackCalculations/railTypeProcessing';
import { railDragEvent } from '../trackCalculations/railDragEvent';

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
		const allTilesOnMap = getCombinedArrayOfNewAndOldTiles(newTiles);
		await props.setPlacedTracks(allTilesOnMap);
		await checkIfPlacedTilesAllCorrect(props.trainTrackMap);
	}

	const getCombinedArrayOfNewAndOldTiles = (newTiles) => {
		const tilesToPlace = filterNewTilesOfDefaultTiles(newTiles, props.trainTrackMap);
		const alreadyPlacedTiles = filterAlreadyPlacedTracksOfNewTiles(tilesToPlace);
		return [ ...tilesToPlace, ...alreadyPlacedTiles ];
	};

	const filterNewTilesOfDefaultTiles = (newTiles, map) => {
		const filteredTiles = newTiles.filter((newTile) => {
			const defaultOverlapTiles = map.tracks.filter(
				(mapTile) => compareArrays(newTile.tile, mapTile.tile) && mapTile.defaultTrack
			);
			return defaultOverlapTiles.length === 0;
		});
		return filteredTiles;
	};

	function filterAlreadyPlacedTracksOfNewTiles(newTiles) {
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
		else return <EmptyTile key={x} tileRemSize={props.tileRemSize} />;
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
						else if (!props.mapVisible) return <TransparentTile key={x} tileRemSize={props.tileRemSize} />;
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

	const trainTrackMap = props.trainTrackMap;
	const mapComponents = generateMapComponents(trainTrackMap);

	return (
		<div className="map">
			{mapComponents}
			<MapAmbientBackground />
		</div>
	);
};

export default Map;
