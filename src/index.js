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
		this.clickEventActive = this.clickEventActive.bind(this);
		this.hoverEventDisabled = this.hoverEventDisabled.bind(this);
		this.rightClickEvent = this.rightClickEvent.bind(this);

		this.state = {
			hoverTrack: {
				x: '-',
				y: '-',
				trackType: '-',
				trackRotation: '-'
			}
		};
	}

	hoverEventActive(e) {
		const className = e.currentTarget.className;
		const [ trackType, trackRotation ] = this.convertButtonClassNameToTrack(e, className);
		const x = this.props.x;
		const y = this.props.y;

		this.setState({
			hoverTrack: {
				x,
				y,
				trackType,
				trackRotation
			}
		});
	}

	hoverEventDisabled(e) {
		this.setState({
			hoverTrack: {
				x: '-',
				y: '-',
				trackType: '-',
				trackRotation: '-'
			}
		});
	}

	convertButtonClassNameToTrack(e, className) {
		let trackType, trackRotation;
		if (e.target.classList.contains('middleButton')) {
			trackType = straighttrack;
			if (e.target.classList.contains('top') || e.target.classList.contains('down')) {
				trackRotation = 0;
			}
			if (e.target.classList.contains('right') || e.target.classList.contains('left')) {
				trackRotation = 90;
			}
		}
		if (e.target.classList.contains('cornerButton')) {
			trackType = curvedtrack;
			if (e.target.classList.contains('top-left')) {
				trackRotation = 90;
			}
			if (e.target.classList.contains('top-right')) {
				trackRotation = 180;
			}
			if (e.target.classList.contains('bottom-left')) {
				trackRotation = 0;
			}
			if (e.target.classList.contains('bottom-right')) {
				trackRotation = 270;
			}
		}
		if (e.target.classList.contains('centreButton')) {
			trackType = 'T';
		}
		return [ trackType, trackRotation ];
	}

	clickEventActive(e) {
		const target = e.currentTarget.className;
		const [ trackType, trackRotation ] = this.convertButtonClassNameToTrack(e, target);
		const [ x, y ] = [ this.props.x, this.props.y ];
		const trackSquare = {
			x,
			y,
			trackType,
			trackRotation
		};
		this.props.onChildClick(trackSquare);
	}

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
					clickEvent={this.clickEventActive}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			));
			middleButtons = edges.map((el) => (
				<MiddleButton
					edge={el}
					key={el}
					clickEvent={this.clickEventActive}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			));
			centreButton = (
				<CentreButton
					clickEvent={this.clickEventActive}
					hoverEvent={this.hoverEventActive}
					hoverEnd={this.hoverEventDisabled}
				/>
			);
		}
		return [ cornerButtons, middleButtons, centreButton ];
	}

	rightClickEvent(e) {
		e.preventDefault();
		const x = this.props.x;
		const y = this.props.y;
		if (this.props.className.includes('mapTile')) {
			this.props.onChildRightClick([ x, y ]);
		}
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
			this.props.x === this.state.hoverTrack.x &&
			this.props.y === this.state.hoverTrack.y &&
			!this.props.trackData
		) {
			if (this.state.hoverTrack.trackType !== 'T') {
				squareStyling = {
					backgroundImage: `url(${this.state.hoverTrack.trackType})`,
					transform: `rotate(${this.state.hoverTrack.trackRotation}deg)`,
					opacity: 0.5
				};
			} else {
				trackText = this.state.hoverTrack.trackType;
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

	removePlacedTrack(trackCoordinates) {
		const filteredTracks = this.state.placedTracks.filter(function(track) {
			if (!(track.x === trackCoordinates[0] && track.y === trackCoordinates[1])) return true;
		});
		return filteredTracks;
	}

	addTrackToPlacedArray(trackSquareInfo) {
		const trackCoordinates = [ trackSquareInfo.x, trackSquareInfo.y ];
		const filteredTracks = this.removePlacedTrack(trackCoordinates);
		const placedTracks = [ ...filteredTracks, trackSquareInfo ];
		return placedTracks;
	}

	handleChildClick(trackSquareInfo) {
		this.addTrackToPlacedArrayAndSetState(trackSquareInfo);
	}

	removePlacedTrackAndSetState(trackCoordinates) {
		const filteredTracks = this.removePlacedTrack(trackCoordinates);
		this.setState({
			placedTracks: filteredTracks
		});
	}

	addTrackToPlacedArrayAndSetState(trackSquare) {
		const newTrackArray = this.addTrackToPlacedArray(trackSquare);
		this.setState({
			placedTracks: newTrackArray
		});
	}

	handleChildRightClick(trackCoordinates) {
		if (this.checkIfPlacedTrackExists(trackCoordinates)) {
			this.removePlacedTrackAndSetState(trackCoordinates);
		} else {
			const trackSquareInfo = {
				x: trackCoordinates[0],
				y: trackCoordinates[1],
				trackType: 'X',
				trackRotation: undefined
			};
			this.removePlacedTrackAndSetState(trackCoordinates);
			this.addTrackToPlacedArrayAndSetState(trackSquareInfo);
		}
	}

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

	convertRailTypeToTrackImage(railType) {
		let trackData;
		if (railType === 'vertical') {
			trackData = {
				trackType: straighttrack,
				trackRotation: 0
			};
		}
		if (railType === 'horizontal') {
			trackData = {
				trackType: straighttrack,
				trackRotation: 90
			};
		}
		if (railType === 'bottomLeftCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 0
			};
		}
		if (railType === 'topLeftCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 90
			};
		}
		if (railType === 'topRightCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 180
			};
		}
		if (railType === 'bottomRightCorner') {
			trackData = {
				trackType: curvedtrack,
				trackRotation: 270
			};
		}
		return trackData;
	}

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
							this.state.placedTracks.forEach(function(el) {
								if (el.x === x && el.y === y - 1) {
									trackData = el;
								}
							});
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
		const mapWidth = 7;
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
