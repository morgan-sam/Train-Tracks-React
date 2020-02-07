import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
import { generateNewMap } from './js/generateMap';
import Map from './js/components/map';
import './css/index.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameWon: false
		};
		this.setGameWinState = this.setGameWinState.bind(this);
	}

	setGameWinState(boo) {
		this.setState({
			gameWon: boo
		});
	}

	render() {
		return (
			<div>
				<h1 className="title">Train Tracks</h1>
				<p>{this.state.gameWon ? 'Game is complete!' : 'Game is incomplete.'}</p>
				<Map
					trainTrackMap={this.props.trainTrackMap}
					mapHeight={this.props.mapHeight}
					mapWidth={this.props.mapWidth}
					setGameWinState={this.setGameWinState}
				/>
			</div>
		);
	}
}
class App extends React.Component {
	render() {
		const mapHeight = 6;
		const mapWidth = 5;
		const trainTrackMap = generateNewMap(mapWidth, mapHeight);
		return (
			<div>
				<Game trainTrackMap={trainTrackMap} mapHeight={mapHeight} mapWidth={mapWidth} />
			</div>
		);
	}
}

const seed = Math.random();
console.log(seed);
// seedrandom(0.5989607919685986, { global: true });
seedrandom(0.9625878708862756, { global: true });

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
