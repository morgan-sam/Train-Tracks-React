import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function CornerButton(props) {
	return <div className={`triangle ${props.corner}`} onClick={props.clickEvent} onMouseOver={props.hoverEvent} />;
}

function CentreButton(props) {
	return <div className={`centreButton ${props.edge}`} />;
}

function Square(props) {
	function hoverEventActive() {
		console.log('hover');
	}
	function clickEventActive() {
		console.log('click');
	}

	let triangles = (
		<div>
			<CornerButton corner={'top-left'} clickEvent={clickEventActive} hoverEvent={hoverEventActive} />
			<CornerButton corner={'top-right'} />
			<CornerButton corner={'bottom-left'} />
			<CornerButton corner={'bottom-right'} />
		</div>
	);
	let centreButtons = (
		<div>
			<CentreButton edge={'top'} />
			<CentreButton edge={'right'} />
			<CentreButton edge={'left'} />
			<CentreButton edge={'bottom'} />
		</div>
	);
	if (props.className) {
		triangles = null;
		centreButtons = null;
	}
	return (
		<div className={`box ${props.className}`}>
			{triangles}
			{centreButtons}
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
				<h1>Train Tracks</h1>
				<Map columns={7} rows={5} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
