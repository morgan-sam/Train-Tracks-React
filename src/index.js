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
				<p>{this.state.gameWon ? 'Game is complete!' : 'Game is incomplete.'}</p>
				<Map
					trainTrackMap={this.props.trainTrackMap}
					mapHeight={this.props.mapHeight}
					mapWidth={this.props.mapWidth}
					setGameWinState={this.setGameWinState}
				/>
				<button key={'quitBtn'}>Quit Game</button>
			</div>
		);
	}
}
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mapSize: 6,
			gameActive: false
		};
		this.mapSizeSelection = this.mapSizeSelection.bind(this);
		this.setGameStateToActive = this.setGameStateToActive.bind(this);
	}

	mapSizeSelection = (event) => {
		this.setState({
			mapSize: parseInt(event.target.value)
		});
	};

	setGameStateToActive() {
		this.setState({
			gameActive: true
		});
	}

	render() {
		let gameObject;
		let menuOptions;

		if (this.state.gameActive) {
			const trainTrackMap = generateNewMap(this.state.mapSize, this.state.mapSize);

			gameObject = [
				<Game
					key={'game'}
					trainTrackMap={trainTrackMap}
					mapHeight={this.state.mapSize}
					mapWidth={this.state.mapSize}
				/>
			];
		} else {
			menuOptions = [
				<button key={'startBtn'} onClick={this.setGameStateToActive}>
					Start
				</button>,
				<select key={'selectMapSize'} name="list" id="mapSizeOption" onChange={this.mapSizeSelection}>
					<option value={6}>6x6</option>
					<option value={8}>8x8</option>
					<option value={10}>10x10</option>
				</select>
			];
		}
		return (
			<div>
				<h1 className="title">Train Tracks</h1>
				{gameObject}
				{menuOptions}
			</div>
		);
	}
}

const seed = Math.random();
console.log(seed);
// seedrandom(0.5989607919685986, { global: true });
seedrandom(seed, { global: true });

//simple test map:
//0.9625878708862756

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
