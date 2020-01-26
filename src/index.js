import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
import { generateNewMap } from './generateMap';
import './index.css';

function CornerButton(props) {
	return <div className={`cornerButton ${props.corner}`} onClick={props.clickEvent} onMouseOver={props.hoverEvent} />;
}

function CentreButton(props) {
	return <div className={`centreButton ${props.edge}`} onClick={props.clickEvent} onMouseOver={props.hoverEvent} />;
}

function Square(props) {
	function hoverEventActive() {
		// console.log('hover');
	}
	function clickEventActive() {
		console.log('click');
	}

	const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
	const edges = [ 'top', 'right', 'bottom', 'left' ];

	let cornerButtons = corners.map((el) => (
		<CornerButton corner={el} key={el} clickEvent={clickEventActive} hoverEvent={hoverEventActive} />
	));
	let centreButtons = edges.map((el) => (
		<CentreButton edge={el} key={el} clickEvent={clickEventActive} hoverEvent={hoverEventActive} />
	));
	let squareText;

	if (
		props.className === 'table-heading' ||
		props.className === 'start' ||
		props.className === 'end' ||
		props.className === 'track'
	) {
		cornerButtons = null;
		centreButtons = null;
		squareText = '#';
	}

	return (
		<div className={`box ${props.className}`}>
			{cornerButtons}
			{centreButtons}
			<p className="boxLabel"> {squareText}</p>
		</div>
	);
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

	renderHeadingTile(i) {
		return <Square className="table-heading" key={i} />;
	}

	renderMapTile(i) {
		return <Square key={i} />;
	}

	renderStart(i) {
		return <Square className="start" key={i} />;
	}

	renderFinish(i) {
		return <Square className="end" key={i} />;
	}

	renderTrack(i) {
		return <Square className="track" key={i} />;
	}

	render() {
		let mapComponents = [];
		const generatedMap = generateNewMap(this.props.rows, this.props.columns);
		for (let y = 0; y < this.props.columns + 1; y++) {
			mapComponents.push(
				<div className="mapRow" key={y}>
					{[ ...Array(this.props.rows + 1) ].map((el, x) => {
						const currentTile = this.checkIfTrackExists(generatedMap, x, y - 1);
						if (y === 0 || x === this.props.rows) {
							return this.renderHeadingTile(x);
						} else if (currentTile === 'start') {
							return this.renderStart(x);
						} else if (currentTile === 'end') {
							return this.renderFinish(x);
						} else if (currentTile === 'track') {
							return this.renderTrack(x);
						} else {
							return this.renderMapTile(x);
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
				<Map columns={6} rows={6} />
			</div>
		);
	}
}
const seed = Math.random();
console.log(seed);
seedrandom(seed, { global: true });

//example where track wraps around end coordinate:
//0.2804289302017666
ReactDOM.render(<App />, document.getElementById('root'));
