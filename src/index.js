import React from 'react';
import ReactDOM from 'react-dom';
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

	if (props.className === 'table-heading' || props.className === 'track') {
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
			coordinates.push([ x, this.props.rows + 1 ]); //bottom
		}
		for (let y = this.props.columns - 1; y > 0; y--) {
			coordinates.push([ 0, y ]); //left
		}
		console.log(coordinates);
		return coordinates;
	}

	renderHeadingTile(i) {
		return <Square className="table-heading" key={i} />;
	}

	renderMapTile(i) {
		return <Square key={i} />;
	}

	renderTrack(i) {
		return <Square className="track" key={i} />;
	}

	render() {
		let map = [];
		let [ startCoordinate, endCoordinate ] = this.generateNewMap();
		console.log(startCoordinate);
		console.log(endCoordinate);
		for (let y = 0; y < this.props.columns + 1; y++) {
			map.push(
				<div className="mapRow" key={y}>
					{[ ...Array(this.props.rows + 1) ].map((el, x) => {
						if (y === 0 || x === this.props.rows) {
							return this.renderHeadingTile(x);
						} else if (startCoordinate[0] === x && startCoordinate[1] + 1 === y) {
							return this.renderTrack(x);
						} else if (endCoordinate[0] === x && endCoordinate[1] + 1 === y) {
							return this.renderTrack(x);
						} else {
							return this.renderMapTile(x);
						}
					})}
				</div>
			);
		}
		return <div className="map"> {map}</div>;
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<h1 className="title">Train Tracks</h1>
				<Map columns={7} rows={5} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
