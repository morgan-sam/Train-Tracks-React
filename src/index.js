import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
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

	generateNewMap() {
		let generatedMap = {};
		let [ startCoordinate, endCoordinate ] = this.generateStartEndPoints();
		generatedMap = {
			start: startCoordinate,
			end: endCoordinate,
			tiles: [ endCoordinate, startCoordinate ]
		};
		console.log(Math.random());
		let lastMove = startCoordinate;
		for (let i = 0; i < 18; i++) {
			let nextMove = this.newMove(lastMove, generatedMap);
			generatedMap.tiles.push(nextMove);
			lastMove = nextMove;
		}
		return generatedMap;
	}

	getLegalMoves(coordinate, tiles) {
		const adjacentMoves = Array(4).fill(coordinate).map((el, i) => [ el[0] + (i - 1) % 2, el[1] + (i - 2) % 2 ]);
		let legalMoves = adjacentMoves.filter(
			(el) => el[0] >= 0 && el[1] >= 0 && el[0] < this.props.rows && el[1] < this.props.columns
		);
		const compareArrays = this.compareArrays;
		legalMoves = legalMoves.filter(function(move) {
			let boo = false;
			tiles.forEach(function(remove) {
				if (compareArrays(move, remove)) {
					boo = true;
				}
			});
			return !boo;
		});
		return legalMoves;
	}

	newMove(currentCoordinate, generatedMap) {
		let nextMove;
		const legalMoves = this.getLegalMoves(currentCoordinate, generatedMap.tiles);
		if (Array.isArray(legalMoves) && legalMoves.length) {
			nextMove = legalMoves[randomIntFromInterval(0, legalMoves.length - 1)];
		} else {
			nextMove = [ 0, 5 ];
		}
		return nextMove;
	}

	checkIfPossibleToGetHome() {
		//
	}

	compareArrays(arr1, arr2) {
		let arrEqual = false;
		if (arr1.length === arr2.length) {
			arrEqual = arr1.every((v, i) => v === arr2[i]);
		}
		return arrEqual;
	}

	generateStartEndPoints() {
		let edges = this.getEdgeCoordinates();
		let startCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1);
		let endCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1);
		return [ startCoordinate[0], endCoordinate[0] ];
	}

	getEdgeCoordinates() {
		//calculates coordinates around edge in clockwise order
		let coordinates = [];
		for (let x = 0; x < this.props.rows - 1; x++) {
			coordinates.push([ x, 0 ]); //top
		}
		for (let y = 0; y < this.props.columns - 1; y++) {
			coordinates.push([ this.props.rows - 1, y ]); //right
		}
		for (let x = this.props.rows - 1; x > 0; x--) {
			coordinates.push([ x, this.props.columns - 1 ]); //bottom
		}
		for (let y = this.props.columns - 1; y > 0; y--) {
			coordinates.push([ 0, y ]); //left
		}
		return coordinates;
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
		const generatedMap = this.generateNewMap();
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

seedrandom('12345', { global: true });
ReactDOM.render(<App />, document.getElementById('root'));

function randomIntFromInterval(min, max) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}
