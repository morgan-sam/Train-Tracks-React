import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return <div className="box" />;
}

class Map extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		let map = [];
		for (let i = 0; i < this.props.columns; i++) {
			map.push(<div className="mapRow">{[ ...Array(this.props.rows) ].map(() => Square())}</div>);
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
