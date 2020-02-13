import React from 'react';
import Game from './game';
import Dropdown from './dropdown';
import { generateNewMap } from '../generateMap';
import { randomIntFromInterval, compareArrays, isNonEmptyArray } from '../utility/utilityFunctions';
import seedrandom from 'seedrandom';
const MENU_WIDTH = '12rem';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mapSize: 6,
			gameActive: false,
			mapSeed: this.getRandomSeed(),
			selectedSavedMap: null
		};
		this.mapSizeSelection = this.mapSizeSelection.bind(this);
		this.setGameState = this.setGameState.bind(this);
		this.resetGameDefaults = this.resetGameDefaults.bind(this);
	}

	setSeedrandomToDate() {
		seedrandom(Date.now(), { global: true });
	}

	getRandomSeed() {
		return Math.floor(Math.random() * Math.pow(10, 15));
	}

	mapSizeSelection = (event) => {
		this.setState({
			mapSize: parseInt(event.target.value)
		});
	};

	selectedSavedMap(seed) {
		this.setState({
			selectedSavedMap: parseInt(seed)
		});
	}

	setMapSeed = (seed) => {
		this.setState({
			mapSeed: parseInt(seed)
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
			mapSize: 6,
			mapSeed: this.getRandomSeed()
		});
	}

	resetMapSeed() {
		this.setState({
			mapSeed: this.getRandomSeed()
		});
	}

	saveMapSeed(inputName) {
		let mapToSave = {
			name: inputName,
			seed: this.state.mapSeed
		};
		let localMaps = JSON.parse(window.localStorage.getItem('savedMaps'));
		if (isNonEmptyArray(localMaps)) {
			const newMapArray = [ ...localMaps, mapToSave ];
			window.localStorage.setItem('savedMaps', JSON.stringify(newMapArray));
		} else {
			window.localStorage.setItem('savedMaps', JSON.stringify([ mapToSave ]));
		}
	}

	getLocalStorageMaps() {
		let localMaps = JSON.parse(window.localStorage.getItem('savedMaps'));
		if (!isNonEmptyArray(localMaps)) localMaps = [];
		return localMaps;
	}

	renderSavedMapsDropdownValues() {
		const localMaps = this.getLocalStorageMaps();
		let dropDownValues = [];
		localMaps.forEach((el) => {
			dropDownValues.push(
				<option key={el.name} value={el.seed}>
					{el.name}
				</option>
			);
		});
		return dropDownValues;
	}

	renderMenuOptions() {
		return (
			<div key={'menuOptions'} className="menuOptions">
				<p key={'Map Size Label'}>Map Size</p>
				<select key={'selectMapSize'} name="list" id="mapSizeOption" onChange={this.mapSizeSelection}>
					<option value={6}>6x6</option>
					<option value={8}>8x8</option>
					<option value={10}>10x10</option>
				</select>
				<p key={'Map Seed Label'}>Map Seed</p>
				<input
					key="mapSeedInput"
					type="text"
					id="mapSeedInput"
					onChange={(e) => this.setMapSeed(e.target.value)}
					defaultValue={this.state.mapSeed}
					style={{ width: '8rem', textAlign: 'center' }}
				/>
				<button key={'generateMapBtn'} onClick={() => this.setGameState(true)}>
					Generate Map
				</button>

				<Dropdown
					style={{ width: '7rem', height: '2rem' }}
					placeholder={'testValue'}
					options={[ 1, 2, 3, 4 ]}
				/>

				<button
					key={'loadSeedBtn'}
					onClick={() => {
						this.setMapSeed(this.state.selectedSavedMap);
						this.setGameState(true);
					}}
				>
					Load Map
				</button>
			</div>
		);
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
					mapSeed={this.state.mapSeed}
					setGameState={this.setGameState}
					newMap={() => this.resetMapSeed()}
					saveMapSeed={(name) => this.saveMapSeed(name)}
					setSeedrandomToDate={this.setSeedrandomToDate}
				/>
			];
		} else {
			menuOptions = this.renderMenuOptions();
		}

		return (
			<div>
				<div key={'gameMenuStyle'} className="gameMenuStyle" style={{ width: MENU_WIDTH }}>
					<h1 key={'title'} className="gameTitle">
						Train Tracks
					</h1>
					{menuOptions}
				</div>
				{gameObject}
			</div>
		);
	}
}

export default App;
