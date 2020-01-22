import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return <div className={`box ${props.className}`} />;
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
						if (y === 0 || x === 0) {
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
