import React from 'react';
import ReactDOM from 'react-dom';
import seedrandom from 'seedrandom';
import { generateNewMap } from './js/generateMap';
import Map from './js/components/map';
import './css/index.css';

const MENU_WIDTH = '12rem';

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
		let gameWinDisplay;
		if (this.state.gameWon) {
			gameWinDisplay = [
				<div key={'gameWinDisplay'} className="gameWinDisplay">
					You Win!
				</div>
			];
		}
		return (
			<div>
				<div className="gameMapContainer">
					{gameWinDisplay}
					<Map
						className="gameMap"
						trainTrackMap={this.props.trainTrackMap}
						mapHeight={this.props.mapHeight}
						mapWidth={this.props.mapWidth}
						setGameWinState={this.setGameWinState}
					/>
				</div>
				<p>
					<button key={'quitBtn'} onClick={() => this.props.setGameState(false)}>
						Quit Game
					</button>
				</p>
			</div>
		);
	}
}
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mapSize: 6,
			gameActive: false,
			mapSeed: null
		};
		this.mapSizeSelection = this.mapSizeSelection.bind(this);
		this.setGameState = this.setGameState.bind(this);
		this.resetGameDefaults = this.resetGameDefaults.bind(this);
	}

	mapSizeSelection = (event) => {
		this.setState({
			mapSize: parseInt(event.target.value)
		});
	};

	mapSeedInput = (event) => {
		this.setState({
			mapSeed: parseInt(event.target.value)
		});
	};

	setGameState(boo) {
		this.setState({
			gameActive: boo
		});
		if (!boo) {
			this.resetGameDefaults();
		}
	}

	resetGameDefaults() {
		this.setState({
			mapSize: 6
		});
	}

	render() {
		let gameObject;
		let menuOptions;

		if (this.state.gameActive) {
			const trainTrackMap = generateNewMap(this.state.mapSize, this.state.mapSize, this.state.mapSeed);

			gameObject = [
				<Game
					key={'game'}
					trainTrackMap={trainTrackMap}
					mapHeight={this.state.mapSize}
					mapWidth={this.state.mapSize}
					setGameState={this.setGameState}
				/>
			];
		} else {
			menuOptions = [
				<p key={'Map Size Label'}>Map Size</p>,
				<select key={'selectMapSize'} name="list" id="mapSizeOption" onChange={this.mapSizeSelection}>
					<option value={6}>6x6</option>
					<option value={8}>8x8</option>
					<option value={10}>10x10</option>
				</select>,
				<p key={'Map Seed Label'}>Map Seed</p>,
				<input
					key="mapSeedInput"
					type="text"
					id="mapSeedInput"
					onChange={this.mapSeedInput}
					style={{ width: MENU_WIDTH }}
				/>,
				<button key={'startBtn'} onClick={() => this.setGameState(true)}>
					Generate Map
				</button>
			];
		}

		return (
			<div>
				<div key={'gameMenuStyle'} className="gameMenuStyle" style={{ width: MENU_WIDTH }}>
					<h1 key={'title'} className="title">
						Train Tracks
					</h1>
					{menuOptions}
				</div>
				{gameObject}
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
