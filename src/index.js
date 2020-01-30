import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
import { generateNewMap } from './generateMap';
import './index.css';
import curvedtrack from './img/curvedtrack.png';
import straighttrack from './img/straighttrack.png';

function CornerButton(props) {
	return <div className={`cornerButton ${props.corner}`} onClick={props.clickEvent} onMouseOver={props.hoverEvent} />;
}

function CentreButton(props) {
	return <div className={`centreButton ${props.edge}`} onClick={props.clickEvent} onMouseOver={props.hoverEvent} />;
}

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.hoverEventActive = this.hoverEventActive.bind(this);
		this.clickEventActive = this.clickEventActive.bind(this);
	}

	hoverEventActive(e) {
		const target = e.currentTarget.className;
	}
	clickEventActive(e) {
		const target = e.currentTarget.className;
		console.log(target);
		console.log(this.props);
	}

	generateTileButtons() {
		let centreButtons = null;
		let cornerButtons = null;
		const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
		const edges = [ 'top', 'right', 'bottom', 'left' ];
		if (this.props.className === 'mapTile') {
			centreButtons = edges.map((el) => (
				<CentreButton
					edge={el}
					key={el}
					clickEvent={this.clickEventActive}
					hoverEvent={this.hoverEventActive}
				/>
			));
			cornerButtons = corners.map((el) => (
				<CornerButton
					corner={el}
					key={el}
					clickEvent={this.clickEventActive}
					hoverEvent={this.hoverEventActive}
				/>
			));
		}
		return [ centreButtons, cornerButtons ];
	}

	// props.trackPresent
	// 	? (backgroundTrack = {
	// 			backgroundSize: '100% 100%',
	// 			backgroundImage: `url(${straighttrack})`
	// 		})
	// 	: (backgroundTrack = {
	// 			backgroundSize: '100% 100%',
	// 			backgroundImage: `none`
	// 		});

	render() {
		let squareText;
		const [ centreButtons, cornerButtons ] = this.generateTileButtons();
		if (this.props.className === 'start' || this.props.className === 'end') {
			squareText = '#';
		}

		if (this.props.className === 'table-heading') {
			squareText = this.props.text;
		}

		// if (this.props.className === 'track') {
		// 	squareText = this.props.text;
		// }

		let backgroundTrack;
		return (
			<div style={backgroundTrack} className={`box ${this.props.className}`}>
				{cornerButtons}
				{centreButtons}
				<p className="boxLabel"> {squareText}</p>
			</div>
		);
	}
}

class Map extends React.Component {
	constructor(props) {
		super(props);
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

	renderMapTile(i, x, y, trackPresent) {
		return <Square className="mapTile" key={i} x={x} y={y} trackPresent={trackPresent} />;
	}

	renderStart(i) {
		return <Square className="start" key={i} />;
	}

	renderFinish(i) {
		return <Square className="end" key={i} />;
	}

	renderTrack(i, trackIndex) {
		return <Square className="track" key={i} text={trackIndex} />;
	}

	render() {
		let mapComponents = [];
		const generatedMap = generateNewMap(this.props.rows, this.props.columns);
		console.log(generatedMap);
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
						} else if (trackIndex) {
							// return this.renderTrack(x, trackIndex);
							return this.renderMapTile(x, x, y - 1, true);
						} else {
							return this.renderMapTile(x, x, y - 1, false);
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
		return (
			<div>
				<h1 className="title">Train Tracks</h1>
				<Map columns={7} rows={6} />
			</div>
		);
	}
}
const seed = Math.random();
console.log(seed);
// seedrandom(0.5989607919685986, { global: true });
seedrandom(0.2894533878282268, { global: true });

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
