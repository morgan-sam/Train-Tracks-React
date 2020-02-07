import React from 'react';
import ReactDOM from 'react-dom';
import { generateNewMap, compareArrays, findDirectionFromMove } from '../generateMap';

import curvedtrack from '../../img/curvedtrack.png';
import straighttrack from '../../img/straighttrack.png';
import Square from './square';

class Map extends React.Component {
	constructor(props) {
		super(props);
		this.leftClickEvent = this.leftClickEvent.bind(this);
		this.rightClickEvent = this.rightClickEvent.bind(this);
		this.leftReleaseEvent = this.leftReleaseEvent.bind(this);
		this.rightReleaseEvent = this.rightReleaseEvent.bind(this);
		this.hoverStartEvent = this.hoverStartEvent.bind(this);
		this.hoverEndEvent = this.hoverEndEvent.bind(this);
		this.placeTile = this.placeTile.bind(this);
		this.placeMultipleTiles = this.placeMultipleTiles.bind(this);

		this.state = {
			placedTracks: [],
			hoveredTile: []
		};
	}

	///////////// MAP - MOUSE EVENTS FUNCTIONS /////////////

	leftClickEvent(trackSquareInfo, senderClassname) {
		this.previousValueOfLeftClickTile = this.getRailTypeOfCoordinate(trackSquareInfo.tile);
		this.initialLeftClickValue = trackSquareInfo;
		this.currentHoverTile = trackSquareInfo.tile;
		this.leftClickDragArray = [ null, null, trackSquareInfo.tile ];
		this.forceUpdate();
		this.checkIfPlacedTilesAllCorrect(this.props.trainTrackMap, this.state.placedTracks);
	}

	rightClickEvent(coordinate, senderClassname) {
		this.currentHoverTile = coordinate;
		const tileValue = this.getRailTypeOfCoordinate(coordinate);
		this.rightClickDragValue = tileValue === null ? 'X' : 'DELETE';
		if (this.getRailTypeOfCoordinate(coordinate)) {
			this.removePlacedTrack(coordinate);
		} else {
			if (senderClassname === 'mapTile') {
				this.placeTile(coordinate, this.rightClickDragValue);
			}
		}
		this.forceUpdate();
		this.checkIfPlacedTilesAllCorrect(this.props.trainTrackMap, this.state.placedTracks);
	}

	leftReleaseEvent(trackSquareInfo, senderClassname) {
		if (compareArrays(this.initialLeftClickValue.tile, this.currentHoverTile)) {
			if (senderClassname === 'mapTile') {
				this.placeMultipleTiles([ trackSquareInfo ]);
			}
		}
		this.leftClickDragArray = [];
		this.forceUpdate();
		this.checkIfPlacedTilesAllCorrect(this.props.trainTrackMap, this.state.placedTracks);
	}

	rightReleaseEvent() {
		this.rightClickDragValue = undefined;
		this.forceUpdate();
		this.checkIfPlacedTilesAllCorrect(this.props.trainTrackMap, this.state.placedTracks);
	}

	hoverStartEvent(senderClassname, coordinate, senderButton) {
		this.currentHoverTileClass = senderClassname;
		let newHoverTile = false;
		if (!compareArrays(coordinate, this.currentHoverTile)) {
			this.previousHoverTile = this.currentHoverTile;
			this.currentHoverTile = coordinate;
			newHoverTile = true;
		}

		if (senderButton === 1 && newHoverTile) {
			this.leftClickDragArray.shift();
			this.leftClickDragArray.push(coordinate);
			this.placedDraggedTrack(coordinate, senderClassname);
		}
		if (senderButton === 2) {
			if (this.rightClickDragValue === 'X') {
				if (senderClassname === 'mapTile') {
					this.placeTile(coordinate, this.rightClickDragValue);
				}
			} else if (this.rightClickDragValue === 'DELETE') {
				this.removePlacedTrack(coordinate);
			}
		}

		if (senderClassname === 'mapTile') {
			if (senderButton === 3) {
				this.placeTile(coordinate, 'T');
			}
		}
	}

	hoverEndEvent(senderClassname) {
		this.previousHoverTileClass = senderClassname;
	}

	///////////// MAP - MOUSE DRAG CONTROL FUNCTIONS /////////////

	placedDraggedTrack(coordinate, senderClassname) {
		const directions = this.calculateDragDirection();
		const railType = this.convertDirectionsToRailType(directions);

		let tilesToPlace = [];
		if (this.previousHoverTileClass === 'mapTile') {
			let railShouldChange = this.shouldStartRailChange(
				this.previousValueOfLeftClickTile,
				this.initialLeftClickValue.tile,
				coordinate
			);
			//Only replaces first coordinate if no tile present, but maintains snaking movement on later drags
			if (
				!compareArrays(this.previousHoverTile, this.initialLeftClickValue.tile) ||
				!this.previousValueOfLeftClickTile ||
				this.previousValueOfLeftClickTile === 'T' ||
				railShouldChange
			) {
				tilesToPlace.unshift({ tile: this.previousHoverTile, railType: railType[0] });
			}
		}
		if (this.currentHoverTileClass === 'mapTile') {
			tilesToPlace.unshift({ tile: this.currentHoverTile, railType: railType[1] });
		}
		this.placeMultipleTiles(tilesToPlace);
	}

	shouldStartRailChange(startType, startCoordinate, nextCoordinate) {
		let railShouldChange = false;
		const direction = findDirectionFromMove(nextCoordinate, startCoordinate);
		if (direction === 0) {
			if (startType === 'bottomLeftCorner' || startType === 'bottomRightCorner' || startType === 'horizontal') {
				railShouldChange = true;
			}
		}
		if (direction === 1) {
			if (startType === 'bottomLeftCorner' || startType === 'topLeftCorner' || startType === 'vertical') {
				railShouldChange = true;
			}
		}
		if (direction === 2) {
			if (startType === 'topLeftCorner' || startType === 'topRightCorner' || startType === 'horizontal') {
				railShouldChange = true;
			}
		}
		if (direction === 3) {
			if (startType === 'bottomRightCorner' || startType === 'topRightCorner' || startType === 'vertical') {
				railShouldChange = true;
			}
		}
		return railShouldChange;
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

	convertDirectionsToRailType(directions) {
		let previousTileRailType;
		let currentHoverTileRailType;
		if (directions.length === 1) {
			if (directions[0] % 2 === 0) previousTileRailType = 'vertical';
			if (directions[0] % 2 === 1) previousTileRailType = 'horizontal';
			currentHoverTileRailType = previousTileRailType;
		}
		if (directions.length === 2) {
			if (directions[0] % 2 === 0 && directions[1] % 2 === 0) previousTileRailType = 'vertical';
			if (directions[0] % 2 === 1 && directions[1] % 2 === 1) previousTileRailType = 'horizontal';

			if (directions[0] === 0 && directions[1] === 1) previousTileRailType = 'bottomRightCorner';
			if (directions[0] === 1 && directions[1] === 2) previousTileRailType = 'bottomLeftCorner';
			if (directions[0] === 2 && directions[1] === 3) previousTileRailType = 'topLeftCorner';
			if (directions[0] === 3 && directions[1] === 0) previousTileRailType = 'topRightCorner';

			if (directions[0] === 3 && directions[1] === 2) previousTileRailType = 'bottomRightCorner';
			if (directions[0] === 2 && directions[1] === 1) previousTileRailType = 'topRightCorner';
			if (directions[0] === 1 && directions[1] === 0) previousTileRailType = 'topLeftCorner';
			if (directions[0] === 0 && directions[1] === 3) previousTileRailType = 'bottomLeftCorner';

			currentHoverTileRailType = directions[1] % 2 === 0 ? 'vertical' : 'horizontal';
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

	placeMultipleTiles(tileObjArr) {
		const placedTracks = this.state.placedTracks;
		let newTrackArray = [];
		//Remove any present tiles of passed track coordinates
		placedTracks.forEach(function(track) {
			let placedTrackReplaced = false;
			tileObjArr.forEach(function(el) {
				if (compareArrays(track.tile, el.tile)) placedTrackReplaced = true;
			});
			if (!placedTrackReplaced) newTrackArray.push(track);
		});
		//Add passed track coordinates
		tileObjArr.forEach(function(el) {
			newTrackArray.push(el);
		});
		this.setState({
			placedTracks: newTrackArray
		});
	}

	removePlacedTrack(trackCoordinates) {
		const filteredTracks = this.state.placedTracks.filter(function(track) {
			if (!(track.tile[0] === trackCoordinates[0] && track.tile[1] === trackCoordinates[1])) return true;
		});
		this.setState({
			placedTracks: filteredTracks
		});
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
		if (railType === 'vertical') {
			trackData = {
				trackType: straighttrack,
				trackRotation: 0
			};
		} else if (railType === 'horizontal') {
			trackData = {
				trackType: straighttrack,
				trackRotation: 90
			};
		} else if (railType === 'bottomLeftCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 0
			};
		} else if (railType === 'topLeftCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 90
			};
		} else if (railType === 'topRightCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 180
			};
		} else if (railType === 'bottomRightCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 270
			};
		} else if (railType === 'T' || railType === 'X') {
			trackData = { trackType: railType, trackRotation: 'none' };
		} else {
			trackData = { trackType: 'none', trackRotation: 'none' };
		}
		return trackData;
	}

	///////////// MAP - WIN STATE FUNCTIONS /////////////

	checkIfPlacedTilesAllCorrect(trainTrackMap, placedMap) {
		let gameWon = false;
		const correctTiles = trainTrackMap.tracks.filter(function(winning) {
			let correctTile = winning.defaultTrack;
			placedMap.forEach(function(placed) {
				if (compareArrays(winning.tile, placed.tile) && winning.railType === placed.railType)
					correctTile = true;
			});
			return correctTile;
		}).length;

		const defaultTileCount = this.getAllDefaultTiles(trainTrackMap).length;
		if (
			correctTiles === trainTrackMap.tracks.length &&
			trainTrackMap.tracks.length === placedMap.length + defaultTileCount
		)
			gameWon = true;
		this.props.setGameWinState(gameWon);
	}

	///////////// MAP - RENDER FUNCTIONS /////////////

	renderHeadingTile(i, x, y, headerLabel, fillState) {
		return <Square className="table-heading" key={i} x={x} y={y} text={headerLabel} fillState={fillState} />;
	}

	renderMapTile(i, x, y, railImage) {
		return (
			<Square
				className="mapTile"
				key={i}
				x={x}
				y={y}
				convertRailTypeToTrackImage={this.convertRailTypeToTrackImage}
				railImage={railImage}
				leftClickEvent={this.leftClickEvent}
				rightClickEvent={this.rightClickEvent}
				leftReleaseEvent={this.leftReleaseEvent}
				rightReleaseEvent={this.rightReleaseEvent}
				hoverStartEvent={this.hoverStartEvent}
				hoverEndEvent={this.hoverEndEvent}
				leftClickDragArray={this.leftClickDragArray}
				rightClickDragValue={this.rightClickDragValue}
			/>
		);
	}

	renderDefaultTrack(i, x, y, defaultRailType) {
		return (
			<Square
				className="defaultTrack"
				key={i}
				x={x}
				y={y}
				trackData={this.convertRailTypeToTrackImage(defaultRailType)}
				leftClickEvent={this.leftClickEvent}
				rightClickEvent={this.rightClickEvent}
				leftReleaseEvent={this.leftReleaseEvent}
				rightReleaseEvent={this.rightReleaseEvent}
				hoverStartEvent={this.hoverStartEvent}
				hoverEndEvent={this.hoverEndEvent}
				leftClickDragArray={this.leftClickDragArray}
				rightClickDragValue={this.rightClickDragValue}
			/>
		);
	}

	render() {
		window.state = this.state;
		const trainTrackMap = this.props.trainTrackMap;
		let mapComponents = [];
		for (let y = 0; y < this.props.mapHeight + 1; y++) {
			mapComponents.push(
				<div className="mapRow" key={y}>
					{[ ...Array(this.props.mapWidth + 1) ].map((el, x) => {
						// const tileNumber = (this.props.mapHeight - 1) * y + x;
						const defaultTile = this.checkIfTileIsDefault(trainTrackMap, x, y - 1);
						//Place Map Headers
						if (y === 0) {
							const headerLabel = trainTrackMap.headerLabels.x[x];
							const fillState = this.getRowColumnFillstate('x', x);
							return this.renderHeadingTile(x, x, y - 1, headerLabel, fillState);
						} else if (x === this.props.mapWidth) {
							const headerLabel = trainTrackMap.headerLabels.y[y - 1];
							const fillState = this.getRowColumnFillstate('y', y - 1);
							return this.renderHeadingTile(x, x, y - 1, headerLabel, fillState);
						} else if (defaultTile) {
							//Place Default Tracks
							return this.renderDefaultTrack(x, x, y - 1, defaultTile);
						} else {
							//Place User Placed Tracks
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
					})}
				</div>
			);
		}
		return <div className="map"> {mapComponents}</div>;
	}
}
function print(value) {
	console.log(JSON.parse(JSON.stringify(value)));
}

export default Map;
