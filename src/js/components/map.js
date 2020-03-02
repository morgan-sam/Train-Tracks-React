import React from 'react';

import curvedtrack from '../../img/curvedtrack.png';
import straighttrack from '../../img/straighttrack.png';
import Square from './square';

import { removeArrayValue, compareArrays, isNonEmptyArray } from '../utility/utilityFunctions';

import { findDirectionFromMove } from '../generation/generateMap';

import { colorToWhiteArray } from '../utility/colorToWhite';

class Map extends React.Component {
	constructor(props) {
		super(props);
		this.leftClickEvent = this.leftClickEvent.bind(this);
		this.rightClickEvent = this.rightClickEvent.bind(this);
		this.bothClickEvent = this.bothClickEvent.bind(this);
		this.leftReleaseEvent = this.leftReleaseEvent.bind(this);
		this.rightReleaseEvent = this.rightReleaseEvent.bind(this);
		this.hoverStartEvent = this.hoverStartEvent.bind(this);
		this.hoverEndEvent = this.hoverEndEvent.bind(this);
		this.placeTile = this.placeTile.bind(this);
		this.placeMultipleTiles = this.placeMultipleTiles.bind(this);

		this.state = {
			placedTracks: [],
			hoveredTile: [],
			gameComplete: false
		};

		this.currentHoverTile = [ null, null ];
	}

	///////////// MAP - MOUSE EVENTS FUNCTIONS /////////////

	leftClickEvent(mouseEventObject) {
		this.previousValueOfLeftClickTile = this.getRailTypeOfCoordinate(mouseEventObject.tile);
		this.initialLeftClickValue = mouseEventObject;
		this.leftClickDragArray = [ null, null, mouseEventObject.tile ];
		this.forceUpdate();
	}

	rightClickEvent(mouseEventObject) {
		this.setRightClickDragValue(mouseEventObject);
		this.determineRemoveOrPlaceX(mouseEventObject);
		this.forceUpdate();
	}

	bothClickEvent(mouseEventObject) {
		this.determineIfToPlaceT(mouseEventObject);
	}

	setRightClickDragValue(mouseEventObject) {
		const tileValue = this.getRailTypeOfCoordinate(mouseEventObject.tile);
		this.rightClickDragValue = tileValue === null ? 'X' : 'DELETE';
	}

	determineRemoveOrPlaceX(mouseEventObject) {
		if (mouseEventObject.tileClass === 'mapTile') {
			if (this.getRailTypeOfCoordinate(mouseEventObject.tile)) {
				this.removePlacedTrack(mouseEventObject.tile);
			} else {
				this.placeTile(mouseEventObject.tile, this.rightClickDragValue);
			}
		}
	}

	leftReleaseEvent(mouseEventObject) {
		if (isNonEmptyArray(this.leftClickDragArray)) {
			this.placeTrackIfLeftClickNoDrag(mouseEventObject);
			this.leftClickDragArray = [];
			this.forceUpdate();
		}
	}

	rightReleaseEvent() {
		this.rightClickDragValue = undefined;
		this.forceUpdate();
	}

	checkIfHoverTileChanged(mouseEventObject) {
		let hasChanged = false;
		if (!compareArrays(mouseEventObject.tile, this.currentHoverTile)) {
			hasChanged = true;
		}
		return hasChanged;
	}

	updateHoverTileState(mouseEventObject) {
		this.previousHoverTile = this.currentHoverTile;
		this.currentHoverTile = mouseEventObject.tile;
		this.currentHoverTileClass = mouseEventObject.tileClass;
	}

	placeTrackIfLeftClickNoDrag(mouseEventObject) {
		if (
			compareArrays(this.initialLeftClickValue.tile, this.currentHoverTile) &&
			mouseEventObject.tileClass === 'mapTile'
		) {
			this.placeTile(mouseEventObject.tile, mouseEventObject.railType);
		}
	}

	hoverStartEvent(mouseEventObject) {
		if (this.checkIfHoverTileChanged(mouseEventObject)) {
			this.updateHoverTileState(mouseEventObject);
			if (mouseEventObject.mouseButton === 1 && this.checkIfHoverToAdjacent()) {
				this.hoverWhileHoldingLeftMouseButton(mouseEventObject);
			}
			if (mouseEventObject.mouseButton === 2) {
				this.hoverWhileHoldingRightMouseButton(mouseEventObject);
			}
			if (mouseEventObject.mouseButton === 3) {
				this.hoverWhileHoldingBothMouseButtons(mouseEventObject);
			}
		}
	}

	checkIfHoverToAdjacent() {
		let hoverAdjacent = true;
		if (this.currentHoverTile[0] > this.previousHoverTile[0] + 1) {
			hoverAdjacent = false;
		}
		if (this.currentHoverTile[0] < this.previousHoverTile[0] - 1) {
			hoverAdjacent = false;
		}
		if (this.currentHoverTile[1] > this.previousHoverTile[1] + 1) {
			hoverAdjacent = false;
		}
		if (this.currentHoverTile[1] < this.previousHoverTile[1] - 1) {
			hoverAdjacent = false;
		}
		return hoverAdjacent;
	}

	hoverEndEvent(senderClassname) {
		this.previousHoverTileClass = senderClassname;
	}

	hoverWhileHoldingLeftMouseButton(mouseEventObject) {
		if (isNonEmptyArray(this.leftClickDragArray)) {
			this.leftClickDragArray.shift();
			this.leftClickDragArray.push(mouseEventObject.tile);
			this.placedDraggedTrack(mouseEventObject.tile);
		}
	}

	hoverWhileHoldingRightMouseButton(mouseEventObject) {
		if (this.rightClickDragValue === 'X') {
			if (mouseEventObject.tileClass === 'mapTile') {
				this.placeTile(mouseEventObject.tile, this.rightClickDragValue);
			}
		} else if (this.rightClickDragValue === 'DELETE') {
			this.removePlacedTrack(mouseEventObject.tile);
		}
	}

	hoverWhileHoldingBothMouseButtons(mouseEventObject) {
		this.determineIfToPlaceT(mouseEventObject);
	}

	determineIfToPlaceT(mouseEventObject) {
		if (mouseEventObject.mouseButton === 3) {
			if (mouseEventObject.tileClass === 'mapTile') {
				this.placeTile(mouseEventObject.tile, 'T');
			}
		}
	}

	///////////// MAP - MOUSE DRAG CONTROL FUNCTIONS /////////////

	// Needs to be refactored, far too long
	placedDraggedTrack(coordinate) {
		const directions = this.calculateDragDirection();
		const railType = this.convertDirectionsToRailType(directions);

		let tilesToPlace = [];

		let newCorner;
		//Only change tile to new corner if on first drag
		if (compareArrays(this.previousHoverTile, this.initialLeftClickValue.tile)) {
			newCorner = this.convertConnectedRailToCorner(coordinate);
		}
		if (isNonEmptyArray(newCorner)) {
			tilesToPlace.unshift(...this.getNewCornerTiles(newCorner));
		} else {
			if (this.previousHoverTileClass === 'mapTile') {
				let railShouldChange = this.shouldStartRailChange(
					this.previousValueOfLeftClickTile,
					this.initialLeftClickValue.tile,
					coordinate
				);
				//Only replaces first coordinate if no tile present, but maintains snaking movement on later drags

				if (this.checkIfNotFirstDragTile() || this.checkIfFirstDragTileIsEmptyOrT() || railShouldChange) {
					tilesToPlace.unshift({ tile: this.previousHoverTile, railType: railType[0] });
				}
			}
			if (this.currentHoverTileClass === 'mapTile' && !this.checkIfCurrentTileIsConnectedToLast()) {
				tilesToPlace.unshift({ tile: this.currentHoverTile, railType: railType[1] });
			}
		}
		this.placeMultipleTiles(tilesToPlace);
	}

	checkIfCurrentTileIsConnectedToLast() {
		let moveDirection = findDirectionFromMove(this.previousHoverTile, this.currentHoverTile);
		let connectedDirections = this.getConnectedAdjacentTracksDirections(this.previousHoverTile);
		let connection = connectedDirections.includes(moveDirection);
		return connection;
	}

	checkIfFirstDragTileIsEmptyOrT() {
		return !this.previousValueOfLeftClickTile || this.previousValueOfLeftClickTile === 'T';
	}

	checkIfNotFirstDragTile() {
		return !compareArrays(this.previousHoverTile, this.initialLeftClickValue.tile);
	}

	getNewCornerTiles(newCorner) {
		let tilesToPlace = [];
		if (this.previousHoverTileClass === 'mapTile') {
			tilesToPlace.unshift({ tile: this.previousHoverTile, railType: newCorner[0] });
		}
		if (this.currentHoverTileClass === 'mapTile' && !this.checkIfCurrentTileIsConnectedToLast()) {
			tilesToPlace.unshift({ tile: this.currentHoverTile, railType: newCorner[1] });
		}
		return tilesToPlace;
	}

	shouldStartRailChange(startType, startCoordinate, nextCoordinate) {
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

	convertConnectedRailToCorner(newCoordinate) {
		const dragDirection = findDirectionFromMove(newCoordinate, this.previousHoverTile);
		let connectedDirections = this.getConnectedAdjacentTracksDirections(this.previousHoverTile);
		if (isNonEmptyArray(connectedDirections)) {
			const initialDirection = connectedDirections[randomInt(0, connectedDirections.length - 1)];
			const directions = [ initialDirection, dragDirection ];
			return this.convertDirectionsToRailType(directions);
		}
	}

	getConnectedAdjacentTracksDirections(coordinate) {
		//checks which tiles are pointing towards the dragged tile
		const adjacentTracks = this.getAdjacentTracks(coordinate);
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

	getAdjacentTracks(coordinate) {
		let adjacentTracks = [];
		let adjTile;

		const pushAdjTileIfExist = (adjTile, position) => {
			let adjRail = this.getRailTypeOfCoordinate(adjTile);
			if (!adjRail) adjRail = this.checkIfTileIsDefault(this.props.trainTrackMap, adjTile[0], adjTile[1]);
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
		if (coordinate[0] < this.props.mapWidth) {
			adjTile = [ coordinate[0] + 1, coordinate[1] ];
			pushAdjTileIfExist(adjTile, 1);
		}
		if (coordinate[1] > 0) {
			adjTile = [ coordinate[0], coordinate[1] - 1 ];
			pushAdjTileIfExist(adjTile, 0);
		}
		if (coordinate[1] < this.props.mapHeight) {
			adjTile = [ coordinate[0], coordinate[1] + 1 ];
			pushAdjTileIfExist(adjTile, 2);
		}

		return adjacentTracks;
	}

	calculateDragDirection() {
		let directions = [];
		const tiles = this.leftClickDragArray;
		const numberOfNulls = tiles.findIndex((el) => el !== null);
		for (let i = numberOfNulls; i < tiles.length - 1; i++) {
			directions.push(findDirectionFromMove(tiles[i + 1], tiles[i]));
		}
		return directions;
	}

	convertDirectionsToRailType(dirArr) {
		let previousTileRailType, currentHoverTileRailType;

		if (dirArr.length === 1) {
			if (dirArr[0] % 2 === 0) previousTileRailType = 'vertical';
			if (dirArr[0] % 2 === 1) previousTileRailType = 'horizontal';

			currentHoverTileRailType = previousTileRailType;
		}
		if (dirArr.length === 2) {
			if (dirArr[0] % 2 === 0 && dirArr[1] % 2 === 0) previousTileRailType = 'vertical';
			if (dirArr[0] % 2 === 1 && dirArr[1] % 2 === 1) previousTileRailType = 'horizontal';

			if ((dirArr[0] === 0 && dirArr[1] === 1) || (dirArr[0] === 3 && dirArr[1] === 2))
				previousTileRailType = 'bottomRightCorner';
			if ((dirArr[0] === 1 && dirArr[1] === 2) || (dirArr[0] === 0 && dirArr[1] === 3))
				previousTileRailType = 'bottomLeftCorner';
			if ((dirArr[0] === 2 && dirArr[1] === 3) || (dirArr[0] === 1 && dirArr[1] === 0))
				previousTileRailType = 'topLeftCorner';
			if ((dirArr[0] === 3 && dirArr[1] === 0) || (dirArr[0] === 2 && dirArr[1] === 1))
				previousTileRailType = 'topRightCorner';

			currentHoverTileRailType = dirArr[1] % 2 === 0 ? 'vertical' : 'horizontal';
		}
		return [ previousTileRailType, currentHoverTileRailType ];
	}

	///////////// MAP - TRACK PLACEMENT FUNCTIONS /////////////

	placeTile(coordinate, value) {
		const trackSquareInfo = {
			tile: coordinate,
			railType: value
		};
		this.placeMultipleTiles([ trackSquareInfo ]);
	}

	placeMultipleTiles(newTileObjArray) {
		let newPlacedTrackArray = this.filterPlacedTracksOfNewTiles(newTileObjArray);
		newTileObjArray.forEach(function(el) {
			if (el.railType) newPlacedTrackArray.push(el);
		});
		this.setState(
			{
				placedTracks: newPlacedTrackArray
			},
			() => this.checkIfPlacedTilesAllCorrect(this.props.trainTrackMap)
		);
	}

	filterPlacedTracksOfNewTiles(newTiles) {
		let nonConflictingPlacedTracks = [];
		this.state.placedTracks.forEach(function(track) {
			let placedTrackConflict = false;
			newTiles.forEach(function(el) {
				if (compareArrays(track.tile, el.tile)) placedTrackConflict = true;
			});
			if (!placedTrackConflict) nonConflictingPlacedTracks.push(track);
		});
		return nonConflictingPlacedTracks;
	}

	removePlacedTrack(trackCoordinates) {
		const filteredTracks = this.state.placedTracks.filter(function(track) {
			return !(track.tile[0] === trackCoordinates[0] && track.tile[1] === trackCoordinates[1]);
		});
		this.setState(
			{
				placedTracks: filteredTracks
			},
			() => this.checkIfPlacedTilesAllCorrect(this.props.trainTrackMap)
		);
	}

	resetCurrentMap() {
		this.setState({
			placedTracks: [],
			gameComplete: false
		});
		this.props.setGameWinState(false);
	}

	///////////// MAP - RETRIEVAL FUNCTIONS /////////////

	getRailTypeOfCoordinate(trackCoordinates) {
		let railType = null;
		this.state.placedTracks.forEach(function(el) {
			if (el.tile[0] === trackCoordinates[0] && el.tile[1] === trackCoordinates[1]) railType = el.railType;
		});
		return railType;
	}

	checkIfTileIsDefault(trainTrackMap, x, y) {
		let trackDefaultTile = null;
		trainTrackMap.tracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y && el.defaultTrack) trackDefaultTile = el.railType;
		});
		return trackDefaultTile;
	}

	getAllDefaultTiles(trainTrackMap) {
		let defaultTileArr = [];
		trainTrackMap.tracks.forEach(function(el) {
			if (el.defaultTrack) defaultTileArr.push(el);
		});
		return defaultTileArr;
	}

	///////////// MAP - HEADING FUNCTIONS /////////////

	getRowColumnFillstate(axis, index) {
		let fillState = 'underfilled';
		const defaultTiles = this.getAllDefaultTiles(this.props.trainTrackMap);
		let axisNum = axis === 'x' ? 0 : 1;

		let placedTrackCount = defaultTiles.filter((el) => el.tile[axisNum] === index).length;
		const tilesOnAxis = this.props.trainTrackMap.tracks.filter((el) => el.tile[axisNum] === index).length;
		this.state.placedTracks.forEach(function(el) {
			if (el.tile[axisNum] === index && el.railType !== 'X') placedTrackCount++;
		});

		if (tilesOnAxis < placedTrackCount) {
			fillState = 'overfilled';
		} else if (tilesOnAxis === placedTrackCount) {
			fillState = 'full';
		}
		return fillState;
	}

	///////////// MAP - RAIL IMAGE FUNCTIONS /////////////

	convertRailTypeToTrackImage(railType) {
		let trackData;
		switch (railType) {
			case 'vertical':
				trackData = {
					trackType: straighttrack,
					trackRotation: 0
				};
				break;
			case 'horizontal':
				trackData = {
					trackType: straighttrack,
					trackRotation: 90
				};
				break;
			case 'bottomLeftCorner':
				trackData = {
					trackType: curvedtrack,
					trackRotation: 0
				};
				break;
			case 'topLeftCorner':
				trackData = {
					trackType: curvedtrack,
					trackRotation: 90
				};
				break;
			case 'topRightCorner':
				trackData = {
					trackType: curvedtrack,
					trackRotation: 180
				};
				break;
			case 'bottomRightCorner':
				trackData = {
					trackType: curvedtrack,
					trackRotation: 270
				};
				break;
			case 'T':
				trackData = {
					trackType: railType,
					trackRotation: 'none'
				};
				break;
			case 'X':
				trackData = {
					trackType: railType,
					trackRotation: 'none'
				};
				break;
			default:
				trackData = { trackType: 'none', trackRotation: 'none' };
		}
		return trackData;
	}

	///////////// MAP - WIN STATE FUNCTIONS /////////////

	checkIfPlacedTilesAllCorrect(trainTrackMap) {
		const correctTileCount = this.getCorrectTileCount(trainTrackMap, this.state.placedTracks);
		const defaultTileCount = this.getAllDefaultTiles(trainTrackMap).length;
		const placedRailTrackCount = this.getPlacedRailTrackCount();
		if (
			correctTileCount === trainTrackMap.tracks.length &&
			trainTrackMap.tracks.length === placedRailTrackCount + defaultTileCount
		) {
			this.props.setGameWinState(true);
			this.setState({ gameComplete: true });
		}
	}

	getPlacedRailTrackCount() {
		const placedTiles = this.state.placedTracks;
		const placedRailTrackCount = placedTiles.filter((el) => el.railType !== 'X').length;
		return placedRailTrackCount;
	}

	getCorrectTileCount(trainTrackMap, placedTracks) {
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

	renderHeadingTile(i, x, y, headerLabel, fillState) {
		return <Square className="table-heading" key={i} x={x} y={y} text={headerLabel} fillState={fillState} />;
	}

	renderMapTile(i, x, y, railImage, mapSolutionVisible) {
		return (
			<Square
				className="mapTile"
				key={i}
				x={x}
				y={y}
				mapSolutionVisible={mapSolutionVisible}
				convertRailTypeToTrackImage={this.convertRailTypeToTrackImage}
				railImage={railImage}
				leftClickEvent={this.props.controlsActive ? this.leftClickEvent : () => null}
				rightClickEvent={this.props.controlsActive ? this.rightClickEvent : () => null}
				bothClickEvent={this.props.controlsActive ? this.bothClickEvent : () => null}
				leftReleaseEvent={this.props.controlsActive ? this.leftReleaseEvent : () => null}
				rightReleaseEvent={this.props.controlsActive ? this.rightReleaseEvent : () => null}
				hoverStartEvent={this.props.controlsActive ? this.hoverStartEvent : () => null}
				hoverEndEvent={this.props.controlsActive ? this.hoverEndEvent : () => null}
			/>
		);
	}

	renderDefaultTrack(i, x, y, defaultRailType, highlighted) {
		return (
			<Square
				className="defaultTrack"
				key={i}
				x={x}
				y={y}
				highlighted={highlighted}
				trackData={this.convertRailTypeToTrackImage(defaultRailType)}
				leftClickEvent={this.props.controlsActive ? this.leftClickEvent : () => null}
				rightClickEvent={this.props.controlsActive ? this.rightClickEvent : () => null}
				bothClickEvent={this.props.controlsActive ? this.bothClickEvent : () => null}
				leftReleaseEvent={this.props.controlsActive ? this.leftReleaseEvent : () => null}
				rightReleaseEvent={this.props.controlsActive ? this.rightReleaseEvent : () => null}
				hoverStartEvent={this.props.controlsActive ? this.hoverStartEvent : () => null}
				hoverEndEvent={this.props.controlsActive ? this.hoverEndEvent : () => null}
				leftClickDragArray={this.leftClickDragArray}
				rightClickDragValue={this.rightClickDragValue}
			/>
		);
	}

	renderCompleteTrack(i, x, y, defaultRailType, highlighted) {
		return (
			<Square
				className="completeTrack"
				key={i}
				x={x}
				y={y}
				highlighted={highlighted}
				trackData={this.convertRailTypeToTrackImage(defaultRailType)}
				leftClickEvent={() => null}
				rightClickEvent={() => null}
				bothClickEvent={() => null}
				leftReleaseEvent={() => null}
				rightReleaseEvent={() => null}
				hoverStartEvent={() => null}
				hoverEndEvent={() => null}
				leftClickDragArray={null}
				rightClickDragValue={null}
			/>
		);
	}

	renderEmptyTile(i, x, y) {
		return (
			<Square
				className="emptyTile"
				key={i}
				x={x}
				y={y}
				highlighted={false}
				trackData={this.convertRailTypeToTrackImage(null)}
				leftClickEvent={() => null}
				rightClickEvent={() => null}
				bothClickEvent={() => null}
				leftReleaseEvent={() => null}
				rightReleaseEvent={() => null}
				hoverStartEvent={() => null}
				hoverEndEvent={() => null}
				leftClickDragArray={null}
				rightClickDragValue={null}
			/>
		);
	}

	renderTransparentTile(i, x, y) {
		return (
			<Square
				className="transparentTile"
				key={i}
				x={x}
				y={y}
				highlighted={false}
				trackData={this.convertRailTypeToTrackImage(null)}
				leftClickEvent={() => null}
				rightClickEvent={() => null}
				bothClickEvent={() => null}
				leftReleaseEvent={() => null}
				rightReleaseEvent={() => null}
				hoverStartEvent={() => null}
				hoverEndEvent={() => null}
				leftClickDragArray={null}
				rightClickDragValue={null}
			/>
		);
	}

	///////////// MAP - MAP COMPONENT GENERATION FUNCTIONS /////////////

	placeColumnHeader(trainTrackMap, x, y) {
		const headerLabel = trainTrackMap.headerLabels.x[x];
		const fillState = this.state.gameComplete ? 'full' : this.getRowColumnFillstate('x', x);
		return this.renderHeadingTile(x, x, y - 1, headerLabel, fillState);
	}

	placeRowHeader(trainTrackMap, x, y) {
		const headerLabel = trainTrackMap.headerLabels.y[y - 1];
		const fillState = this.state.gameComplete ? 'full' : this.getRowColumnFillstate('y', y - 1);
		return this.renderHeadingTile(x, x, y - 1, headerLabel, fillState);
	}

	placeCompletedMapTrack(trainTrackMap, x, y) {
		let defaultTile;
		let highlighted = false;
		trainTrackMap.tracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y - 1) {
				defaultTile = el.railType;
				if (this.props.defaultTilesHighlighted && el.defaultTrack) highlighted = true;
			}
		}, this);
		if (defaultTile) {
			return this.renderCompleteTrack(x, x, y - 1, defaultTile, highlighted);
		} else {
			return this.renderEmptyTile(x, x, y - 1);
		}
	}

	placeUserPlacedTrack(x, y) {
		let railImage;
		this.state.placedTracks.forEach(function(el) {
			if (el.tile[0] === x && el.tile[1] === y - 1) {
				railImage = this.convertRailTypeToTrackImage(el.railType);
			}
		}, this);
		if (railImage) {
			return this.renderMapTile(x, x, y - 1, railImage);
		} else {
			return this.renderMapTile(x, x, y - 1, null);
		}
	}

	placeGameActiveMapTrack(trainTrackMap, x, y) {
		const defaultTile = this.checkIfTileIsDefault(trainTrackMap, x, y - 1);
		if (defaultTile) {
			return this.renderDefaultTrack(x, x, y - 1, defaultTile, this.props.defaultTilesHighlighted);
		} else {
			return this.placeUserPlacedTrack(x, y);
		}
	}

	placeMainMapTile(trainTrackMap, x, y) {
		if (this.state.gameComplete || this.props.mapSolutionVisible) {
			return this.placeCompletedMapTrack(trainTrackMap, x, y);
		} else {
			return this.placeGameActiveMapTrack(trainTrackMap, x, y);
		}
	}

	generateMapComponents(trainTrackMap) {
		let generatedMapComponents = [];
		for (let y = 0; y < this.props.mapHeight + 1; y++) {
			generatedMapComponents.push(
				<div className="mapRow" key={y}>
					{[ ...Array(this.props.mapWidth + 1) ].map((el, x) => {
						if (y === 0) {
							return this.placeColumnHeader(trainTrackMap, x, y);
						} else if (x === this.props.mapWidth) {
							return this.placeRowHeader(trainTrackMap, x, y);
						} else if (!this.props.mapVisible) {
							return this.renderTransparentTile(x, x, y - 1);
						} else {
							return this.placeMainMapTile(trainTrackMap, x, y);
						}
					})}
				</div>
			);
		}
		return generatedMapComponents;
	}

	///////////// MAP - MAIN RENDER FUNCTION /////////////

	renderHeaderBackground() {
		const numberOfShapes = 20;
		const colorArray = colorToWhiteArray('#b19cd9', numberOfShapes + 1);
		let backgroundShapes = [];
		for (let i = 0; i < numberOfShapes; i++) {
			const backgroundShapeStyle = {
				backgroundColor: colorArray[i],
				animation: `spin ${15 + 0.25 * (i + 1)}s infinite linear`,
				height: `${100 - 4 * i}%`,
				width: `${100 - 4 * i}%`
			};
			backgroundShapes.push(<div key={i} className="mapBackgroundShape" style={backgroundShapeStyle} />);
		}
		return <div className="mapBackgroundContainer">{backgroundShapes}</div>;
	}

	render() {
		window.state = this.state;
		const trainTrackMap = this.props.trainTrackMap;
		const mapComponents = this.generateMapComponents(trainTrackMap);
		const headerbackground = this.renderHeaderBackground();
		return (
			<div className="map">
				{mapComponents}
				{headerbackground}
			</div>
		);
	}
}
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
export default Map;
