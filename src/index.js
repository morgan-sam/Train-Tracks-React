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
		this.props.onChildRightClick([ x, y ]);
	}

	render() {
		let squareText;
		const [ cornerButtons, middleButtons, centreButton ] = this.generateTileButtons();
		if (this.props.className === 'start' || this.props.className === 'end') {
			squareText = '#';
		}

		if (this.props.className === 'table-heading') {
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

		if (this.props.trackData) {
			if (this.props.trackData.trackType !== 'T') {
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
		return (
			<div className={'square'} onContextMenu={this.rightClickEvent}>
				<div className={`box ${this.props.className}`}>
					{cornerButtons}
					{middleButtons}
					{centreButton}
					<p className="boxLabel"> {squareText}</p>
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
		const newTrackArray = this.addTrackToPlacedArray(trackSquareInfo);
		this.setState({
			placedTracks: newTrackArray
		});
	}

	handleChildRightClick(trackCoordinates) {
		const filteredTracks = this.removePlacedTrack(trackCoordinates);
		this.setState({
			placedTracks: filteredTracks
		});
	}

	checkIfTrackExists(generatedMap, x, y) {
		let trackExists = false;
		generatedMap.tiles.forEach(function(el) {
			if (el[0] === x && el[1] === y) {
				trackExists = 'track';
			}
		});
		if (generatedMap.start[0] === x && generatedMap.start[1] === y) trackExists = 'start';
		if (generatedMap.end[0] === x && generatedMap.end[1] === y) trackExists = 'end';
		return trackExists;
	}

	getTrackIndex(generatedMap, x, y) {
		let trackExists = false;
		generatedMap.tiles.forEach(function(el, i) {
			if (el[0] === x && el[1] === y) {
				trackExists = i;
			}
		});
		if (generatedMap.start[0] === x && generatedMap.start[1] === y) trackExists = 'start';
		if (generatedMap.end[0] === x && generatedMap.end[1] === y) trackExists = 'end';
		return trackExists;
	}

	renderHeadingTile(i, headerLabel) {
		return <Square className="table-heading" key={i} text={headerLabel} />;
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

	renderStart(i) {
		return <Square className="start" key={i} />;
	}

	renderFinish(i) {
		return <Square className="end" key={i} />;
	}

	render() {
		const generatedMap = this.props.generatedMap;
		let mapComponents = [];
		for (let y = 0; y < this.props.columns + 1; y++) {
			mapComponents.push(
				<div className="mapRow" key={y}>
					{[ ...Array(this.props.rows + 1) ].map((el, x) => {
						const trackIndex = this.getTrackIndex(generatedMap, x, y - 1);
						if (y === 0) {
							const headerLabel = generatedMap.headerLabels.x[x];
							return this.renderHeadingTile(x, headerLabel);
						} else if (x === this.props.rows) {
							const headerLabel = generatedMap.headerLabels.y[y - 1];
							return this.renderHeadingTile(x, headerLabel);
						} else if (trackIndex === 'start') {
							return this.renderStart(x);
						} else if (trackIndex === 'end') {
							return this.renderFinish(x);
						} else {
							let placeTrack = false;
							let trackData;
							this.state.placedTracks.forEach(function(el) {
								if (el.x === x && el.y === y - 1) {
									placeTrack = true;
									trackData = el;
								}
							});

							if (placeTrack) {
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
		const columns = 6;
		const rows = 7;
		const generatedMap = generateNewMap(rows, columns);
		console.log(generatedMap);
		return (
			<div>
				<h1 className="title">Train Tracks</h1>
				<Map generatedMap={generatedMap} columns={columns} rows={rows} />
			</div>
		);
	}
}
const seed = Math.random();
console.log(seed);
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
