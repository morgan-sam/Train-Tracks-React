import React from 'react';
import Game from './game';
import Dropdown from './dropdown';
import { generateNewMap } from '../generation/generateMap';
import { generateMapIcon } from '../generation/generateIcon';
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
			selectedSavedMap: null,
			trainTrackMap: null,
			mapIcon: null
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

	//////////////////////////////////////////
	////////// APP STATE MANAGEMENT //////////
	//////////////////////////////////////////

	loadSavedMap() {
		const mapSeed = this.state.selectedSavedMap;
		const trainTrackMap = generateNewMap(this.state.mapSize, this.state.mapSize, mapSeed);
		this.setState({
			trainTrackMap: trainTrackMap,
			mapSeed,
			gameActive: true
		});
	}

	generateCurrentMapState() {
		const trainTrackMap = generateNewMap(this.state.mapSize, this.state.mapSize, this.state.mapSeed);
		this.setState({
			trainTrackMap: trainTrackMap
		});
	}

	generateNewMapState() {
		const mapSeed = this.getRandomSeed();
		const trainTrackMap = generateNewMap(this.state.mapSize, this.state.mapSize, mapSeed);
		this.setState({
			trainTrackMap,
			mapSeed
		});
	}

	mapSizeSelection = (event) => {
		this.setState({
			mapSize: parseInt(event.target.value)
		});
	};

	setSelectedSavedMap(seed) {
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

	setMapIcon = async () => {
		const mapIcon = await generateMapIcon(this.state.trainTrackMap);
		this.setState({
			mapIcon
		});
	};

	//////////////////////////////////////////
	//////// LOCAL STORAGE MANAGEMENT ////////
	//////////////////////////////////////////

	saveMapToLocal(inputName, mapObject) {
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
			dropDownValues.push({
				display: el.name,
				value: el.seed
			});
		});
		return dropDownValues;
	}
	//////////////////////////////////////////
	////////// APP RENDER FUNCTIONS //////////
	//////////////////////////////////////////

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
				<button
					key={'generateMapBtn'}
					onClick={() => {
						this.generateCurrentMapState();
						this.setGameState(true);
					}}
				>
					Generate Map
				</button>

				<Dropdown
					style={{ width: '12rem', height: '2rem' }}
					placeholder={'Select a map'}
					options={this.renderSavedMapsDropdownValues()}
					onChange={(value) => this.setSelectedSavedMap(value)}
				/>

				<button
					key={'loadSeedBtn'}
					onClick={() => {
						this.loadSavedMap();
					}}
				>
					Load Map
				</button>
				<button key={'showMapIcon'} onClick={() => this.setMapIcon()}>
					Show Map Icon
				</button>
			</div>
		);
	}

	render() {
		let gameObject;
		let menuOptions;
		if (this.state.gameActive) {
			gameObject = [
				<Game
					key={'game'}
					trainTrackMap={this.state.trainTrackMap}
					mapHeight={this.state.mapSize}
					mapWidth={this.state.mapSize}
					mapSeed={this.state.mapSeed}
					setGameState={this.setGameState}
					newMap={() => {
						this.generateNewMapState();
					}}
					saveMapToLocal={(name, map) => this.saveMapToLocal(name, map)}
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
				<img src={this.state.mapIcon} />
			</div>
		);
	}
}

export default App;
