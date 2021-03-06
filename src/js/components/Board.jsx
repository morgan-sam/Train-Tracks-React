import React, { useState, useEffect } from 'react';

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
				key={`${x},${y}`}
				coordinate={[ x, y ]}
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
				key={`${x},${y}`}
				coordinate={[ x, y ]}
				highlighted={highlighted}
				trackData={convertRailTypeToTrackImage(defaultRailType)}
				{...mouseEvents}
			/>
		);
	};

	const renderDefaultTrack = (x, y, defaultRailType, highlighted) =>
		staticTile(x, y, defaultRailType, highlighted, props.activeMouseEventsObject);

	const renderCompleteTrack = (x, y, defaultRailType, highlighted) =>
		staticTile(x, y, defaultRailType, highlighted, emptyMouseEventsObject);

	///////////// MAP - MAP COMPONENT GENERATION FUNCTIONS /////////////

	const placeColumnHeader = (trainTrackMap, x, y) => {
		const headerLabel = trainTrackMap.headerLabels.x[x];
		const fillState = props.gameComplete ? 'full' : getRowColumnFillstate('x', x);
		return (
			<HeadingTile
				key={`${x},${y}`}
				headerLabel={headerLabel}
				fillState={fillState}
				tileRemSize={props.tileRemSize}
			/>
		);
	};

	const placeRowHeader = (trainTrackMap, x, y) => {
		const headerLabel = trainTrackMap.headerLabels.y[y];
		const fillState = props.gameComplete ? 'full' : getRowColumnFillstate('y', y);
		return (
			<HeadingTile
				key={`${x},${y}`}
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
			if (el.tile[0] === x && el.tile[1] === y) {
				defaultTile = el.railType;
				if (defaultHighlights && el.defaultTrack) highlighted = true;
			}
		});
		if (defaultTile) return renderCompleteTrack(x, y, defaultTile, highlighted);
		else return <EmptyTile coordinate={[ x, y ]} key={`${x},${y}`} tileRemSize={props.tileRemSize} />;
	};

	const placeUserPlacedTrack = (x, y) => {
		let railImage;
		props.placedTracks.forEach((el) => {
			if (el.tile[0] === x && el.tile[1] === y) railImage = convertRailTypeToTrackImage(el.railType);
		});
		if (railImage) return renderMapTile(x, y, railImage);
		else return renderMapTile(x, y, null);
	};

	const placeGameActiveMapTrack = (trainTrackMap, x, y) => {
		const defaultTile = checkIfTileIsDefault(trainTrackMap, x, y);
		if (defaultTile) return renderDefaultTrack(x, y, defaultTile, defaultHighlights);
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

	const mapWidth = props.trainTrackMap.headerLabels.x.length;
	const mapHeight = props.trainTrackMap.headerLabels.y.length;

	const mapBoard = [ ...Array((mapWidth + 1) * (mapHeight + 1)) ].map((el, i) => {
		const x = i % (mapWidth + 1);
		const y = Math.floor(i / (mapHeight + 1)) - 1;
		if (y === -1) return placeColumnHeader(props.trainTrackMap, x, y);
		else if (x === mapWidth) return placeRowHeader(props.trainTrackMap, x, y);
		else if (saveBoxCutOut) return <TransparentTile key={`${x},${y}`} tileRemSize={props.tileRemSize} />;
		else return placeMainMapTile(props.trainTrackMap, x, y);
	});

	return mapBoard;
};

export default Board;
