import React from 'react';
import Game from './game';
import Dropdown from './dropdown';
import { generateNewMap } from '../generation/generateMap';
import { generateMapIcon } from '../generation/generateIcon';
import { isNonEmptyArray } from '../utility/utilityFunctions';
import seedrandom from 'seedrandom';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuScreen: 'mainMenu',
			mapSize: 8,
			gameActive: false,
			mapSeed: this.getRandomSeed(),
			selectedSavedMapSeed: null,
			selectedSavedMapObject: null,
			trainTrackMap: null,
			mapIcon: null,
			deleteModeOnAll: false
		};
		this.mapSizeSelection = this.mapSizeSelection.bind(this);
		this.setGameState = this.setGameState.bind(this);
		this.resetGameDefaults = this.resetGameDefaults.bind(this);
		this.mainMenuScreen = this.mainMenuScreen.bind(this);
		this.generateMapScreen = this.generateMapScreen.bind(this);
		this.loadMapScreen = this.loadMapScreen.bind(this);
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

	setMenuScreen(screen) {
		this.setState({
			menuScreen: screen
		});
	}

	loadSavedMap() {
		if (this.state.selectedSavedMapSeed) {
			const mapSeed = this.state.selectedSavedMapSeed;
			const trainTrackMap = generateNewMap(this.state.mapSize, this.state.mapSize, mapSeed);
			this.setState({
				trainTrackMap: trainTrackMap,
				mapSeed,
				gameActive: true,
				mapIcon: null
			});
		}
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
		this.setMapSeedInputValue(mapSeed);
	}

	mapSizeSelection = (event) => {
		this.setState({
			mapSize: parseInt(event.target.value)
		});
	};

	setSelectedSavedMap(seed, mapObject) {
		this.setState({
			selectedSavedMapSeed: parseInt(seed),
			selectedSavedMapObject: mapObject
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
			mapSize: 8,
			mapSeed: this.getRandomSeed(),
			mapIcon: null,
			selectedSavedMapSeed: null,
			selectedSavedMapObject: null
		});
	}

	resetMapSeed() {
		this.setState({
			mapSeed: this.getRandomSeed()
		});
	}

	//////////////////////////////////////////
	//////// LOCAL STORAGE MANAGEMENT ////////
	//////////////////////////////////////////

	saveMapToLocal = async (inputName, mapObject) => {
		let mapToSave = {
			name: inputName,
			seed: this.state.mapSeed,
			mapObject: mapObject
		};
		let localMaps = JSON.parse(window.localStorage.getItem('savedMaps'));
		if (isNonEmptyArray(localMaps)) {
			const newMapArray = [ ...localMaps, mapToSave ];
			await window.localStorage.setItem('savedMaps', JSON.stringify(newMapArray));
		} else {
			await window.localStorage.setItem('savedMaps', JSON.stringify([ mapToSave ]));
		}
	};

	getLocalStorageMaps() {
		let localMaps = JSON.parse(window.localStorage.getItem('savedMaps'));
		if (!isNonEmptyArray(localMaps)) localMaps = [];
		return localMaps;
	}

	deleteLocalSavedMap = async (deleteMapSeed) => {
		const localMaps = this.getLocalStorageMaps();
		const newMapArray = localMaps.filter((el) => el.seed !== deleteMapSeed);
		await window.localStorage.setItem('savedMaps', JSON.stringify(newMapArray));
	};

	deleteAllLocalSavedMaps = async () => {
		await window.localStorage.setItem('savedMaps', JSON.stringify([]));
	};

	renderSavedMapsDropdownValues = () => {
		const localMaps = this.getLocalStorageMaps();
		let dropDownValues = [];
		localMaps.forEach(async (el) => {
			dropDownValues.push({
				display: el.name,
				value: el.seed,
				mapObject: el.mapObject
			});
		});
		return dropDownValues;
	};

	displaySavedGameMapIcon = async (mapObject) => {
		this.setState({
			mapIcon: mapObject ? await generateMapIcon(mapObject) : null
		});
	};

	setMapSeedInputValue(mapSeed) {
		const mapSeedInput = document.getElementById('mapSeedInput');
		if (mapSeedInput) mapSeedInput.value = mapSeed;
	}
	//////////////////////////////////////////
	////////// APP RENDER FUNCTIONS //////////
	//////////////////////////////////////////

	generateMapScreen() {
		return (
			<div className="generateMapSection">
				<p key={'Map Size Label'}>Map Size</p>
				<select
					key={'selectMapSize'}
					name="list"
					id="mapSizeOption"
					onChange={this.mapSizeSelection}
					defaultValue={8}
				>
					<option value={6}>6x6</option>
					<option value={8}>8x8</option>
					<option value={10}>10x10</option>
				</select>
				<p key={'Map Seed Label'}>Map Seed</p>
				<div className="mapSeedOptionRow">
					<input
						key="mapSeedInput"
						type="text"
						className="mapSeedInput"
						id="mapSeedInput"
						defaultValue={this.state.mapSeed}
						onChange={(e) => this.setMapSeed(e.target.value)}
						style={{ width: '8rem', textAlign: 'center' }}
					/>
					<div
						key="rerollSeedBtn"
						className="rerollSeedBtn"
						onClick={(e) => {
							e.preventDefault();
							this.generateNewMapState();
						}}
					>
						<span className="diceSymbol">⚄</span>
					</div>
				</div>
				<button
					key={'generateMapBtn'}
					onClick={() => {
						this.generateCurrentMapState();
						this.setGameState(true);
					}}
				>
					Generate Map
				</button>
				{this.renderReturnToMainMenuBtn()}
			</div>
		);
	}

	loadMapScreen() {
		if (this.state.selectedSavedMapObject && !this.state.mapIcon)
			this.displaySavedGameMapIcon(this.state.selectedSavedMapObject);
		return (
			<div className="loadMapSection">
				<Dropdown
					className="loadMapDropdown"
					style={{ width: '12rem', height: '2rem' }}
					placeholder={'Select a map'}
					options={this.renderSavedMapsDropdownValues()}
					onChange={(value, mapObject) => this.setSelectedSavedMap(value, mapObject)}
					onHover={(mapObject) => {
						if (mapObject !== null) this.displaySavedGameMapIcon(mapObject);
					}}
				/>
				<img
					alt=""
					src={this.state.mapIcon}
					className="mapIcon"
					style={{ border: this.state.mapIcon ? '0.15rem #aaa solid' : 'none' }}
				/>

				<button
					className="loadSaveMapBtn"
					key={'loadSaveMapBtn'}
					onClick={() => {
						this.loadSavedMap();
					}}
				>
					Load Map
				</button>
				<button
					className="deleteSaveMapBtn"
					key={'deleteSaveMapBtn'}
					onClick={() => {
						if (this.state.mapIcon) {
							this.setState({ deleteModeOnAll: false });
							this.setMenuScreen('deleteConfirmation');
						}
					}}
				>
					Delete Map
				</button>
				<button
					className="deleteAllSavedMapsBtn"
					key={'deleteAllSavedMapsBtn'}
					onClick={() => {
						this.setState({ deleteModeOnAll: true });
						this.setMenuScreen('deleteConfirmation');
					}}
				>
					Delete All Maps
				</button>
				{this.renderReturnToMainMenuBtn()}
			</div>
		);
	}

	deleteMapConfirmationScreen() {
		return (
			<div className="deleteConfirmationScreen">
				<h3>
					Are you sure you want to delete{' '}
					{this.state.deleteModeOnAll ? 'ALL saved maps?' : 'the following saved map?'}
				</h3>
				<img
					alt=""
					src={this.state.deleteModeOnAll ? null : this.state.mapIcon}
					className="confirmDeleteIcon"
				/>
				<button
					className="confirmDeleteBtn"
					key={'confirmDeleteBtn'}
					onClick={() => {
						if (this.state.deleteModeOnAll) this.deleteAllLocalSavedMaps();
						else this.deleteLocalSavedMap(this.state.selectedSavedMapSeed);
						this.resetGameDefaults();
						this.setMenuScreen('loadMap');
					}}
				>
					Confirm
				</button>
				<button
					className="cancelDeleteBtn"
					key={'cancelDeleteBtn'}
					onClick={() => {
						this.resetGameDefaults();
						this.setMenuScreen('loadMap');
					}}
				>
					Cancel
				</button>
			</div>
		);
	}

	mainMenuScreen() {
		return (
			<div className="mainMenuScreen" key="mainMenuScreen">
				<button
					className="startGameBtn"
					key={'startGameBtn'}
					onClick={() => {
						this.setMenuScreen('generateMap');
					}}
				>
					Start Game
				</button>
				<button
					className="loadSavedGameBtn"
					key={'loadSavedGameBtn'}
					onClick={() => {
						this.setMenuScreen('loadMap');
					}}
				>
					Load Saved Map
				</button>
			</div>
		);
	}

	renderGameObject() {
		return (
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
		);
	}

	renderReturnToMainMenuBtn() {
		return (
			<button
				className="returnToMainMenuBtn"
				key={'returnToMainMenuBtn'}
				onClick={() => {
					this.setMenuScreen('mainMenu');
				}}
			>
				Return To Main Menu
			</button>
		);
	}

	chooseMenuScreen() {
		let menuScreen;
		switch (this.state.menuScreen) {
			case 'mainMenu':
				menuScreen = this.mainMenuScreen();
				break;
			case 'generateMap':
				menuScreen = this.generateMapScreen();
				break;
			case 'loadMap':
				menuScreen = this.loadMapScreen();
				break;
			case 'deleteConfirmation':
				menuScreen = this.deleteMapConfirmationScreen();
				break;
			default:
				menuScreen = this.mainMenuScreen();
		}
		return menuScreen;
	}

	render() {
		let gameObject, menuScreen;
		if (this.state.gameActive) {
			gameObject = this.renderGameObject();
		} else {
			menuScreen = this.chooseMenuScreen();
		}

		return (
			<div key={'appScreen'} className="appScreen">
				<div key={'menuScreen'} className="menuScreen">
					<h1 key={'title'} className="gameTitle">
						Train Tracks
					</h1>
					{menuScreen}
				</div>
				{gameObject}
			</div>
		);
	}
}

export default App;
