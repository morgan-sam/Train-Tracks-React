import React from 'react';

import MapTile from 'js/components/MapTile';
import HeadingTile from 'js/components/HeadingTile';
import EmptyTile from 'js/components/EmptyTile';
import TransparentTile from 'js/components/TransparentTile';

import { convertRailTypeToTrackImage } from 'js/trackFunctions/railTypeProcessing';
import { getAllDefaultTiles } from 'js/trackFunctions/trackParsing';

import { emptyMouseEventsObject } from 'js/events/mouse';

export const Board = (props) => {
	const { defaultHighlights, solutionVisible, saveBoxCutOut } = props.display;

	const renderMapTile = (x, y, railImage, solutionVisible) => {
		return (
			<MapTile
				className="mapTile"
				tileRemSize={props.tileRemSize}
				railImages={props.railImages}
				key={x}
				x={x}
				y={y}
				solutionVisible={solutionVisible}
				trackData={railImage}
				{...props.activeMouseEventsObject}
			/>
		);
	};

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
	};

	const renderCompleteTrack = (x, y, defaultRailType, highlighted) => {
		return staticTile(x, y, defaultRailType, highlighted, emptyMouseEventsObject);
	};

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
	};

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
	};

	const placeCompletedMapTrack = (trainTrackMap, x, y) => {
		let defaultTile;
		let highlighted = false;
		trainTrackMap.tracks.forEach((el) => {
			if (el.tile[0] === x && el.tile[1] === y - 1) {
				defaultTile = el.railType;
				if (defaultHighlights && el.defaultTrack) highlighted = true;
			}
		});
		if (defaultTile) return renderCompleteTrack(x, y - 1, defaultTile, highlighted);
		else return <EmptyTile key={x} tileRemSize={props.tileRemSize} />;
	};

	const placeUserPlacedTrack = (x, y) => {
		let railImage;
		props.placedTracks.forEach((el) => {
			if (el.tile[0] === x && el.tile[1] === y - 1) railImage = convertRailTypeToTrackImage(el.railType);
		});
		if (railImage) return renderMapTile(x, y - 1, railImage);
		else return renderMapTile(x, y - 1, null);
	};

	const placeGameActiveMapTrack = (trainTrackMap, x, y) => {
		const defaultTile = checkIfTileIsDefault(trainTrackMap, x, y - 1);
		if (defaultTile) return renderDefaultTrack(x, y - 1, defaultTile, defaultHighlights);
		else return placeUserPlacedTrack(x, y);
	};
	const placeMainMapTile = (trainTrackMap, x, y) => {
		if (props.gameComplete || solutionVisible) return placeCompletedMapTrack(trainTrackMap, x, y);
		else return placeGameActiveMapTrack(trainTrackMap, x, y);
	};

	const checkIfTileIsDefault = (trainTrackMap, x, y) => {
		let trackDefaultTile = null;
		trainTrackMap.tracks.forEach((el) => {
			if (el.tile[0] === x && el.tile[1] === y && el.defaultTrack) trackDefaultTile = el.railType;
		});
		return trackDefaultTile;
	};

	const getRowColumnFillstate = (axis, index) => {
		let fillState = 'underfilled';
		const defaultTiles = getAllDefaultTiles(props.trainTrackMap);
		let axisNum = axis === 'x' ? 0 : 1;

		let placedTrackCount = defaultTiles.filter((el) => el.tile[axisNum] === index).length;
		const tilesOnAxis = props.trainTrackMap.tracks.filter((el) => el.tile[axisNum] === index).length;
		props.placedTracks.forEach((el) => {
			if (el.tile[axisNum] === index && el.railType !== 'X') placedTrackCount++;
		});

		if (tilesOnAxis < placedTrackCount) fillState = 'overfilled';
		else if (tilesOnAxis === placedTrackCount) fillState = 'full';
		return fillState;
	};

	let mapBoard = [];
	const mapWidth = props.trainTrackMap.headerLabels.x.length;
	const mapHeight = props.trainTrackMap.headerLabels.y.length;
	for (let y = 0; y < mapHeight + 1; y++) {
		mapBoard.push(
			<div className="mapRow" key={y}>
				{[ ...Array(mapWidth + 1) ].map((el, x) => {
					if (y === 0) return placeColumnHeader(props.trainTrackMap, x, y);
					else if (x === mapWidth) return placeRowHeader(props.trainTrackMap, x, y);
					else if (saveBoxCutOut) return <TransparentTile key={x} tileRemSize={props.tileRemSize} />;
					else return placeMainMapTile(props.trainTrackMap, x, y);
				})}
			</div>
		);
	}

	return mapBoard;
};

export default Board;
