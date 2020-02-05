import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
import { generateNewMap } from './generateMap';
import './index.css';
import curvedtrack from './img/curvedtrack.png';
import straighttrack from './img/straighttrack.png';

function CornerButton(props) {
	return (
		<div
			className={`cornerButton ${props.corner}`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
}

function MiddleButton(props) {
	return (
		<div
			className={`middleButton ${props.edge}`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
}

function CentreButton(props) {
	return (
		<div
			className={`centreButton`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
}

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.hoverEventActive = this.hoverEventActive.bind(this);
		this.hoverEventDisabled = this.hoverEventDisabled.bind(this);
		this.leftClickEvent = this.leftClickEvent.bind(this);
		this.rightClickEvent = this.rightClickEvent.bind(this);

		this.state = {
			hoverTrack: {
				tile: '-',
				railType: '-'
			}
		};
	}

	///////////// SQUARE - MOUSE EVENTS FUNCTIONS /////////////

	hoverEventActive(e) {
		const tile = [ this.props.x, this.props.y ];
		const railType = this.convertButtonClassToRailType(e);
		this.setState({
			hoverTrack: {
				tile,
				railType
			}
		});
	}

	hoverEventDisabled(e) {
		this.setState({
			hoverTrack: {
				tile: '-',
				railType: '-'
			}
		});
	}

	leftClickEvent(e) {
		const tile = [ this.props.x, this.props.y ];
		const railType = this.convertButtonClassToRailType(e);
		const trackSquare = {
			tile,
			railType
		};
		this.props.onChildClick(trackSquare);
	}

	rightClickEvent(e) {
		e.preventDefault();
		const x = this.props.x;
		const y = this.props.y;
		if (this.props.className.includes('mapTile')) {
			this.props.onChildRightClick([ x, y ]);
		}
	}

	///////////// SQUARE - CLASSNAME CONVERSION FUNCTIONS /////////////

	convertButtonClassToRailType(e) {
		let railType;
		if (e.target.classList.contains('middleButton')) {
			if (e.target.classList.contains('top') || e.target.classList.contains('down')) {
				railType = 'vertical';
			}
			if (e.target.classList.contains('right') || e.target.classList.contains('left')) {
				railType = 'horizontal';
			}
		}
		if (e.target.classList.contains('cornerButton')) {
			if (e.target.classList.contains('top-left')) {
				railType = 'topLeftCorner';
			}
			if (e.target.classList.contains('top-right')) {
				railType = 'topRightCorner';
			}
			if (e.target.classList.contains('bottom-left')) {
				railType = 'bottomLeftCorner';
			}
			if (e.target.classList.contains('bottom-right')) {
				railType = 'bottomRightCorner';
			}
		}
		if (e.target.classList.contains('centreButton')) {
			railType = 'T';
		}
		return railType;
	}

	///////////// SQUARE - RENDER FUNCTIONS /////////////

	generateTileButtons() {
		let cornerButtons = null;
		let middleButtons = null;
		let centreButton = null;
		const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
		const edges = [ 'top', 'right', 'bottom', 'left' ];
		if (this.props.className === 'mapTile') {
			cornerButtons = corners.map((el) => (
				<CornerButton
					corner={el}
					key={el}
					clickEvent={this.leftClickEvent}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			));
			middleButtons = edges.map((el) => (
				<MiddleButton
					edge={el}
					key={el}
					clickEvent={this.leftClickEvent}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			));
			centreButton = (
				<CentreButton
					clickEvent={this.leftClickEvent}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			);
		}
		return [ cornerButtons, middleButtons, centreButton ];
	}

	render() {
		let squareText, labelStyling;
		const [ cornerButtons, middleButtons, centreButton ] = this.generateTileButtons();

		if (this.props.className === 'table-heading') {
			switch (this.props.fillState) {
				case 'underfilled':
					labelStyling = {
						color: 'black'
					};
					break;
				case 'full':
					labelStyling = {
						color: 'green'
					};
					break;
				case 'overfilled':
					labelStyling = {
						color: 'red'
					};
					break;
				default:
					labelStyling = {
						color: 'black'
					};
			}
			squareText = this.props.text;
		}

		let squareStyling, trackText;

		if (
			this.props.x === this.state.hoverTrack.tile[0] &&
			this.props.y === this.state.hoverTrack.tile[1] &&
			!this.props.trackData
		) {
			const trackImage = this.props.convertRailTypeToTrackImage(this.state.hoverTrack.railType);
			if (trackImage.trackType !== 'T') {
				squareStyling = {
					backgroundImage: `url(${trackImage.trackType})`,
					transform: `rotate(${trackImage.trackRotation}deg)`,
					opacity: 0.5
				};
			} else {
				trackText = trackImage.trackType;
				squareStyling = {
					opacity: 0.5
				};
			}
		}

		if (this.props.trackData && this.props.className === 'mapTile') {
			if (this.props.trackData.trackType !== 'T' && this.props.trackData.trackType !== 'X') {
				squareStyling = {
					backgroundImage: `url(${this.props.trackData.trackType})`,
					transform: `rotate(${this.props.trackData.trackRotation}deg)`,
					opacity: 1
				};
			} else {
				trackText = this.props.trackData.trackType;
				squareStyling = {
					opacity: 1
				};
			}
		}

		if (this.props.trackData && this.props.className === 'defaultTrack') {
			squareStyling = {
				backgroundImage: `url(${this.props.trackData.trackType})`,
				transform: `rotate(${this.props.trackData.trackRotation}deg)`,
				opacity: 1
			};
		}

		return (
			<div className={`square ${this.props.className}`} onContextMenu={this.rightClickEvent}>
				<div className={`box`}>
					{cornerButtons}
					{middleButtons}
					{centreButton}
					<p className="boxLabel" style={labelStyling}>
						{squareText}
					</p>
				</div>
				<div className={'track-background'} style={squareStyling}>
					{trackText}
				</div>
			</div>
		);
	}
}

class Map extends React.Component {
	constructor(props) {
		super(props);
		this.handleChildClick = this.handleChildClick.bind(this);
		this.handleChildRightClick = this.handleChildRightClick.bind(this);

		this.state = {
			placedTracks: []
		};
	}

	///////////// MAP - MOUSE EVENTS FUNCTIONS /////////////

	handleChildClick(trackSquareInfo) {
		this.addTrackToPlacedArrayAndSetState(trackSquareInfo);
	}

	handleChildRightClick(trackCoordinates) {
		if (this.checkIfPlacedTrackExists(trackCoordinates)) {
			this.removePlacedTrackAndSetState(trackCoordinates);
		} else {
			const trackSquareInfo = {
				tile: trackCoordinates,
				railType: 'X'
			};
			this.removePlacedTrackAndSetState(trackCoordinates);
			this.addTrackToPlacedArrayAndSetState(trackSquareInfo);
		}
	}

	///////////// MAP - TRACK PLACEMENT FUNCTIONS /////////////

	addTrackToPlacedArray(trackSquareInfo) {
		const trackCoordinates = [ trackSquareInfo.x, trackSquareInfo.y ];
		const filteredTracks = this.removePlacedTrack(trackCoordinates);
		const placedTracks = [ ...filteredTracks, trackSquareInfo ];
		return placedTracks;
	}

	removePlacedTrack(trackCoordinates) {
		const filteredTracks = this.state.placedTracks.filter(function(track) {
			if (!(track.x === trackCoordinates[0] && track.y === trackCoordinates[1])) return true;
		});
		return filteredTracks;
	}

	addTrackToPlacedArrayAndSetState(trackSquare) {
		const newTrackArray = this.addTrackToPlacedArray(trackSquare);
		this.setState({
			placedTracks: newTrackArray
		});
	}

	removePlacedTrackAndSetState(trackCoordinates) {
		const filteredTracks = this.removePlacedTrack(trackCoordinates);
		this.setState({
			placedTracks: filteredTracks
		});
	}

	///////////// MAP - ... FUNCTIONS /////////////

	checkIfPlacedTrackExists(trackCoordinates) {
		let trackExists = false;
		this.state.placedTracks.forEach(function(el) {
			if (el.x === trackCoordinates[0] && el.y === trackCoordinates[1]) trackExists = true;
		});
		return trackExists;
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

	///////////// MAP - HEADER FUNCTIONS /////////////

	getRowColumnFillstate(axis, index) {
		let fillState = 'underfilled';
		let placedTrackCount = 0;
		const defaultTiles = this.getAllDefaultTiles(this.props.trainTrackMap);
		let tilesOnAxis;
		if (axis === 'x') {
			placedTrackCount += defaultTiles.filter((el) => el.tile[0] === index).length;
			tilesOnAxis = this.props.trainTrackMap.tracks.filter((el) => el.tile[0] === index).length;
			this.state.placedTracks.forEach(function(el) {
				if (el.x === index && el.trackType !== 'X') placedTrackCount++;
			});
		}
		if (axis === 'y') {
			placedTrackCount += defaultTiles.filter((el) => el.tile[1] === index).length;
			tilesOnAxis = this.props.trainTrackMap.tracks.filter((el) => el.tile[1] === index).length;
			this.state.placedTracks.forEach(function(el) {
				if (el.y === index && el.trackType !== 'X') placedTrackCount++;
			});
		}
		if (tilesOnAxis < placedTrackCount) {
			fillState = 'overfilled';
		} else if (tilesOnAxis === placedTrackCount) {
			fillState = 'full';
		} else {
			fillState = 'underfilled';
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
		} else if (railType === 'T') {
			trackData = { trackType: railType, trackRotation: 'none' };
		} else {
			trackData = { trackType: 'none', trackRotation: 'none' };
		}
		return trackData;
	}

	///////////// MAP - RENDER FUNCTIONS /////////////

	renderHeadingTile(i, headerLabel, fillState) {
		return <Square className="table-heading" key={i} text={headerLabel} fillState={fillState} />;
	}

	renderMapTile(i, x, y, trackData) {
		return (
			<Square
				className="mapTile"
				key={i}
				x={x}
				y={y}
				onChildClick={this.handleChildClick}
				onChildRightClick={this.handleChildRightClick}
				trackData={trackData}
				convertRailTypeToTrackImage={this.convertRailTypeToTrackImage}
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
			/>
		);
	}

	render() {
		const trainTrackMap = this.props.trainTrackMap;
		const convertRailTypeToTrackImage = this.convertRailTypeToTrackImage;
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
							return this.renderHeadingTile(x, headerLabel, fillState);
						} else if (x === this.props.mapWidth) {
							const headerLabel = trainTrackMap.headerLabels.y[y - 1];
							const fillState = this.getRowColumnFillstate('y', y - 1);
							return this.renderHeadingTile(x, headerLabel, fillState);
						} else if (defaultTile) {
							//Place Default Tracks
							return this.renderDefaultTrack(x, x, y - 1, defaultTile);
						} else {
							//Place User Placed Tracks
							let trackData;
							console.log(this.state.placedTracks);
							this.state.placedTracks.forEach(function(el) {
								if (el.tile[0] === x && el.tile[1] === y - 1) {
									trackData = convertRailTypeToTrackImage(el.railType);
								}
							});
							console.log(trackData);
							if (trackData) {
								return this.renderMapTile(x, x, y - 1, trackData);
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

class App extends React.Component {
	render() {
		const mapHeight = 6;
		const mapWidth = 5;
		const trainTrackMap = generateNewMap(mapWidth, mapHeight);

		return (
			<div>
				<h1 className="title">Train Tracks</h1>
				<Map trainTrackMap={trainTrackMap} mapHeight={mapHeight} mapWidth={mapWidth} />
			</div>
		);
	}
}
const seed = Math.random();
// console.log(seed);
// seedrandom(0.5989607919685986, { global: true });
seedrandom(seed, { global: true });

//testing:
//0.5128255307739107
//0.5961328806995592

//no track seeds:
//0.6113545021869811
//0.44704210096626085

//example where track wraps around end coordinate:
//0.2804289302017666

//example where track choses between end coordinate and dead end:
//0.38681828038735433
ReactDOM.render(<App />, document.getElementById('root'));
