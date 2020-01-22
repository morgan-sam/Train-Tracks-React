import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return <div className="box" />;
}

class Map extends React.Component {
	render() {
		let row = 5;
		let column = 7;
		let map = [];
		for (let i = 0; i < column; i++) {
			map.push(<div className="mapRow">{[ ...Array(row) ].map(() => Square())}</div>);
		}
		return <div className="map"> {map}</div>;
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<h1>Train Tracks</h1>
				<Map />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
