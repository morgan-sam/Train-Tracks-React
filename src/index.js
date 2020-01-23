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

	if (props.className === 'table-heading') {
		cornerButtons = null;
		centreButtons = null;
		squareText = '123';
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

	renderHeadingTile(i) {
		return <Square className="table-heading" key={i} />;
	}

	renderMapTile(i) {
		return <Square key={i} />;
	}

	render() {
		let map = [];
		for (let y = 0; y < this.props.columns + 1; y++) {
			map.push(
				<div className="mapRow" key={y}>
					{[ ...Array(this.props.rows + 1) ].map((el, x) => {
						if (y === 0 || x === this.props.rows) {
							return this.renderHeadingTile(x);
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
