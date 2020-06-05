import React from 'react';

import MapTile from 'js/components/MapTile';
import HeadingTile from 'js/components/HeadingTile';
import EmptyTile from 'js/components/EmptyTile';
import TransparentTile from 'js/components/TransparentTile';

import { convertRailTypeToTrackImage } from 'js/trackFunctions/railTypeProcessing';
import { getAllDefaultTiles } from 'js/trackFunctions/trackParsing';

export const Board = (props) => {
	const renderMapTile = (x, y, railImage, mapSolutionVisible) => {
		return (
			<MapTile
				className="mapTile"
				tileRemSize={props.tileRemSize}
				railImages={props.railImages}
				key={x}
				x={x}
				y={y}
				mapSolutionVisible={mapSolutionVisible}
				trackData={railImage}
				{...props.activeMouseEventsObject}
			/>
		);
	}

	const staticTile = (x, y, defaultRailType, highlighted, mouseEvents) => {
		return (
			<MapTile
				className="defaultTrack"
				tileRemSize={props.tileRemSize}
				key={x}
				x={x}
				y={y}
				highlighted={highlighted}
				trackData={convertRailTypeToTrackImage(defaultRailType)}
				{...mouseEvents}
			/>
		);
	};

	const renderDefaultTrack = (x, y, defaultRailType, highlighted) => {
		return staticTile(x, y, defaultRailType, highlighted, props.activeMouseEventsObject);
	}

	const renderCompleteTrack = (x, y, defaultRailType, highlighted) => {
		return staticTile(x, y, defaultRailType, highlighted, props.emptyMouseEventsObject);
	}

	///////////// MAP - MAP COMPONENT GENERATION FUNCTIONS /////////////

	const placeColumnHeader = (trainTrackMap, x, y) => {
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

	const placeRowHeader = (trainTrackMap, x, y) => {
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

	const placeCompletedMapTrack = (trainTrackMap, x, y) => {
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

	const placeUserPlacedTrack = (x, y) => {
		let railImage;
		props.placedTracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y - 1) railImage = convertRailTypeToTrackImage(el.railType);
		});
		if (railImage) return renderMapTile(x, y - 1, railImage);
		else return renderMapTile(x, y - 1, null);
	}

	const placeGameActiveMapTrack = (trainTrackMap, x, y) => {
		const defaultTile = checkIfTileIsDefault(trainTrackMap, x, y - 1);
		if (defaultTile) return renderDefaultTrack(x, y - 1, defaultTile, props.defaultTilesHighlighted);
		else return placeUserPlacedTrack(x, y);
	}
	const placeMainMapTile = (trainTrackMap, x, y) => {
		if (props.gameComplete || props.mapSolutionVisible) return placeCompletedMapTrack(trainTrackMap, x, y);
		else return placeGameActiveMapTrack(trainTrackMap, x, y);
	}

	const checkIfTileIsDefault = (trainTrackMap, x, y) => {
		let trackDefaultTile = null;
		trainTrackMap.tracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y && el.defaultTrack) trackDefaultTile = el.railType;
		});
		return trackDefaultTile;
	}

	const getRowColumnFillstate = (axis, index) => {
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

	let mapBoard = [];
	for (let y = 0; y < props.mapHeight + 1; y++) {
		mapBoard.push(
			<div className="mapRow" key={y}>
				{[ ...Array(props.mapWidth + 1) ].map((el, x) => {
					if (y === 0) return placeColumnHeader(props.trainTrackMap, x, y);
					else if (x === props.mapWidth) return placeRowHeader(props.trainTrackMap, x, y);
					else if (!props.mapVisible) return <TransparentTile key={x} tileRemSize={props.tileRemSize} />;
					else return placeMainMapTile(props.trainTrackMap, x, y);
				})}
			</div>
		);
	}

	return mapBoard;
};

export default Board;
