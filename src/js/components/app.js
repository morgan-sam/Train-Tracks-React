import React from 'react';
import Game from './game';
import WaveButton from './waveButton';
import Dropdown from './dropdown';
import { generateNewMap } from '../generation/generateMap';
import { generateMapIcon, generateCompletedMapIcon } from '../generation/generateIcon';
import { isNonEmptyArray, print } from '../utility/utilityFunctions';
import seedrandom from 'seedrandom';

import {
	saveMapToLocal,
	getLocalStorageMaps,
	deleteLocalSavedMap,
	deleteAllLocalSavedMaps
} from '../utility/localStorage';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuScreen: 'mainMenu',
			gameActive: false,
			selectedMap: {
				size: 8,
				seed: this.getRandomSeed(),
				mapObject: null,
				pathFindingDisabled: false
			},
			mapIcon: null,
			deleteModeOnAll: false,
			howToPlayMapEmpty: null,
			howToPlayMapComplete: null,
			balloonCloudDisabled: false
		};
		this.mapSizeSelection = this.mapSizeSelection.bind(this);
		this.setGameState = this.setGameState.bind(this);
		this.resetGameDefaults = this.resetGameDefaults.bind(this);
		this.mainMenuScreen = this.mainMenuScreen.bind(this);
		this.startMapScreen = this.startMapScreen.bind(this);
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

	setBalloonCloudDisabledState(boo) {
		this.setState({
			balloonCloudDisabled: boo
		});
	}

	setHowToPlayMaps = async () => {
		const map = generateNewMap(6, 6, 986707260499975, true);
		const emptyMap = await generateMapIcon(map, false);
		const completeMap = await generateCompletedMapIcon(map, true);
		this.setState({
			howToPlayMapEmpty: emptyMap,
			howToPlayMapComplete: completeMap
		});
	};

	loadSavedMap() {
		if (this.state.selectedMap.mapObject) {
			this.setState({
				gameActive: true,
				mapIcon: null
			});
		}
	}

	generateCurrentMapState() {
		const mapObject = generateNewMap(
			this.state.selectedMap.size,
			this.state.selectedMap.size,
			this.state.selectedMap.seed,
			this.state.selectedMap.pathFindingDisabled
		);
		this.setState({
			selectedMap: { ...this.state.selectedMap, mapObject }
		});
	}

	generateNewMapSeed() {
		const seed = this.getRandomSeed();
		this.setState({
			selectedMap: { ...this.state.selectedMap, seed }
		});
		this.setMapSeedInputValue(seed);
	}

	generateNewMapState() {
		const seed = this.getRandomSeed();
		const size = this.state.selectedMap.size;
		const pathFindingDisabled = this.state.selectedMap.pathFindingDisabled;
		const trainTrackMap = generateNewMap(size, size, seed, pathFindingDisabled);
		this.setState({
			selectedMap: {
				...this.state.selectedMap,
				seed: this.getRandomSeed(),
				mapObject: trainTrackMap
			}
		});
		this.setMapSeedInputValue(seed);
	}

	setMapSeed = (seed) => {
		this.setState({
			selectedMap: { ...this.state.selectedMap, seed: parseInt(seed) }
		});
	};

	mapSizeSelection = (value) => {
		this.setState({
			selectedMap: { ...this.state.selectedMap, size: value }
		});
	};

	setPathFindingDisableState(boo) {
		this.setState({
			selectedMap: { ...this.state.selectedMap, pathFindingDisabled: boo }
		});
	}

	setSelectedSavedMap(mapObject) {
		this.setState({
			selectedMap: mapObject
		});
	}

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
			selectedMap: {
				size: 8,
				seed: this.getRandomSeed(),
				mapObject: null,
				pathFindingDisabled: false
			},
			mapIcon: null
		});
	}

	resetMapSeed() {
		this.setState({
			selectedMap: {
				...this.state.selectedMap,
				seed: this.getRandomSeed()
			}
		});
	}

	renderSavedMapsDropdownValues = () => {
		const localMaps = getLocalStorageMaps();
		let dropDownValues = [];
		localMaps.forEach(async (el) => {
			dropDownValues.push({
				display: el.name,
				seed: el.seed,
				size: el.size,
				mapObject: el.mapObject,
				pathFindingDisabled: el.pathFindingDisabled
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

	getMapSizeOptions() {
		let mapSizeOptions = [];
		for (let i = 0; i < 3; i++) {
			const mapSize = 6 + i * 2;
			mapSizeOptions.push({
				display: `${mapSize}x${mapSize}`,
				value: mapSize
			});
		}
		return mapSizeOptions;
	}

	startMapScreen() {
		return (
			<div className="generateMapSection">
				<p key={'Map Size Label'}>Map Size</p>
				<Dropdown
					key={'selectMapSize'}
					style={{ width: '3rem', height: '2rem', textAlign: 'center', padding: '0 1.25rem 0 0.5rem' }}
					options={this.getMapSizeOptions()}
					className="mapSizeOption"
					placeholder={'8x8'}
					onHover={() => null}
					onChange={(item) => this.mapSizeSelection(item.value)}
				/>
				<p key={'Map Seed Label'}>Map Seed</p>
				<div className="mapSeedOptionRow">
					<input
						key="mapSeedInput"
						type="text"
						className="mapSeedInput"
						id="mapSeedInput"
						defaultValue={this.state.selectedMap.seed}
						onChange={(e) => this.setMapSeed(e.target.value)}
						style={{ width: '8rem', textAlign: 'center' }}
					/>
					<div
						key="rerollSeedBtn"
						className="rerollSeedBtn"
						onClick={(e) => {
							e.preventDefault();
							this.generateNewMapSeed();
						}}
					>
						<span className="diceSymbol">⚄</span>
					</div>
				</div>
				<div className="pathFindingOptionRow">
					<input
						type="checkbox"
						className="pathFindingCheckbox"
						checked={this.state.selectedMap.pathFindingDisabled}
						onChange={(e) => this.setPathFindingDisableState(e.target.checked)}
					/>
					<p className="pathFindingLabel">Disable Map Generation Path Finding</p>
					<div className="pathFindingQuestionBox">?</div>
					<div className="pathFindingExplanation">
						Disables use of breadth first search algorithm in map generation. Can increase performance on
						old browsers/PCs. Maps may be lessed balanced.
					</div>
				</div>
				<div className="pathFindingOptionRow">
					<input
						type="checkbox"
						className="pathFindingCheckbox"
						checked={this.state.balloonCloudDisabled}
						onChange={(e) => this.setBalloonCloudDisabledState(e.target.checked)}
					/>
					<p className="pathFindingLabel">Disable Win Screen Balloon Cloud</p>
					<div className="pathFindingQuestionBox">?</div>
					<div className="pathFindingExplanation">
						Disables the balloon cloud effect at the end of a game win. Can increase performance on old
						browsers/PCs.
					</div>
				</div>
				<WaveButton
					key={'generateMapBtn'}
					onClick={() => {
						print('Map Loading');
						this.generateCurrentMapState();
						this.setGameState(true);
						print('Map Loaded');
					}}
					text={'Generate Map'}
				/>
				{this.renderReturnToMainMenuBtn()}
			</div>
		);
	}

	loadMapScreen() {
		if (this.state.selectedMap.mapObject && !this.state.mapIcon)
			this.displaySavedGameMapIcon(this.state.selectedMap.mapObject);
		return (
			<div className="loadMapSection">
				<Dropdown
					className="loadMapDropdown"
					style={{ width: '12rem', height: '2rem' }}
					placeholder={'Select a map'}
					options={this.renderSavedMapsDropdownValues()}
					onChange={(item) => {
						const { display, ...mapObj } = item;
						this.setSelectedSavedMap(mapObj);
					}}
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

				<WaveButton
					className="loadSaveMapBtn"
					key={'loadSaveMapBtn'}
					onClick={() => {
						this.loadSavedMap();
					}}
					text={'Load Map'}
				/>
				<WaveButton
					className="deleteSaveMapBtn"
					key={'deleteSaveMapBtn'}
					onClick={() => {
						if (this.state.mapIcon) {
							this.setState({ deleteModeOnAll: false });
							this.setMenuScreen('deleteConfirmation');
						}
					}}
					text={'Delete Map'}
				/>
				<WaveButton
					className="deleteAllSavedMapsBtn"
					key={'deleteAllSavedMapsBtn'}
					onClick={() => {
						this.setState({ deleteModeOnAll: true });
						this.setMenuScreen('deleteConfirmation');
					}}
					text={'Delete All Maps'}
				/>

				{this.renderReturnToMainMenuBtn()}
			</div>
		);
	}

	deleteMapConfirmationScreen() {
		return (
			<div className="deleteConfirmationScreen">
				<h3 className="deleteConfirmationLabel">
					Are you sure you want to delete{' '}
					{this.state.deleteModeOnAll ? 'ALL saved maps?' : 'the following saved map?'}
				</h3>
				<img
					alt=""
					src={this.state.deleteModeOnAll ? null : this.state.mapIcon}
					style={{ display: this.state.deleteModeOnAll ? 'none' : 'block' }}
					className="confirmDeleteIcon"
				/>
				<div className="deleteButtons">
					<WaveButton
						className="confirmDeleteBtn"
						key={'confirmDeleteBtn'}
						onClick={() => {
							if (this.state.deleteModeOnAll) deleteAllLocalSavedMaps();
							else deleteLocalSavedMap(this.state.selectedMap.seed);
							this.resetGameDefaults();
							this.setMenuScreen('loadMap');
						}}
						text={'Confirm'}
					/>
					<WaveButton
						className="cancelDeleteBtn"
						key={'cancelDeleteBtn'}
						onClick={() => {
							this.resetGameDefaults();
							this.setMenuScreen('loadMap');
						}}
						text={'Cancel'}
					/>
				</div>
			</div>
		);
	}

	howToPlayScreen = () => {
		return (
			<div className="howToPlayScreen" key="howToPlayScreen">
				<h2 className="howToPlayTitle">How To Play</h2>
				<div className="howToPlayGrid">
					<div className="howToPlayMapField">
						<img className="howToPlayMap" alt="" src={this.state.howToPlayMapEmpty} />
					</div>
					<div className="howToPlayTextField">
						<p>
							The goal of the game is to create a train track path between the entrance and the exit of
							the board.
						</p>
						<p>
							Each row and column must contain the specified amount of tracks in the corresponding header.
							Headers display green if correct and red if overfilled.
						</p>
						<p>
							Tracks cannot overlap. In order to win the path must be fully connected with no extra
							tracks.
						</p>
						<p>
							Default tiles (such as the entrance and exit) cannot be removed from the map. You can toggle
							the colour of default tiles (blue/brown) in game.
						</p>
					</div>
					<div className="howToPlayMapField">
						<img className="howToPlayMap" alt="" src={this.state.howToPlayMapComplete} />
					</div>
					<div className="howToPlayTextField">
						<p>
							Left clicking places a track. Hovering over different sections of a tile will show what type
							of track will be placed on left click.
						</p>
						<p>
							Right clicking places an X mark. X marks are useful for tiles where you know there is no
							track.
						</p>
						<p>
							Pressing both mouse buttons at the same time places a T mark. T marks are useful for tiles
							where you know there is a track but are not sure which type.
						</p>
						<p>
							Holding down a mouse button and dragging over other tiles will place multiple
							tracks/markers.
						</p>
					</div>
				</div>
				{this.renderReturnToMainMenuBtn()}
			</div>
		);
	};

	aboutScreen() {
		return (
			<div>
				<p>This game was created with React.</p>
				<p>
					<a href="https://github.com/morgan-sam/Train-Tracks-React">Source Code</a>
				</p>
				<p>Samuel Morgan - 2020</p>
				{this.renderReturnToMainMenuBtn()}
			</div>
		);
	}

	mainMenuScreen() {
		return (
			<div className="mainMenuScreen" key="mainMenuScreen">
				<WaveButton
					className="startGameBtn"
					key={'startGameBtn'}
					onClick={() => {
						this.setMenuScreen('generateMap');
					}}
					text={'Start Game'}
				/>
				<WaveButton
					className="loadSavedGameBtn"
					key={'loadSavedGameBtn'}
					onClick={() => {
						this.setMenuScreen('loadMap');
					}}
					text={'Load Saved Map'}
				/>
				<WaveButton
					className="howToPlayPageBtn"
					key={'howToPlayPageBtn'}
					onClick={() => {
						this.setHowToPlayMaps();
						this.setMenuScreen('howToPlay');
					}}
					text={'How To Play'}
				/>
				<WaveButton
					className="aboutBtn"
					key={'aboutBtn'}
					onClick={() => {
						this.setHowToPlayMaps();
						this.setMenuScreen('about');
					}}
					text={'About'}
				/>
			</div>
		);
	}

	renderGameObject() {
		return (
			<Game
				key={'game'}
				selectedMap={this.state.selectedMap}
				setGameState={this.setGameState}
				balloonCloudDisabled={this.state.balloonCloudDisabled}
				newMap={() => {
					this.generateNewMapState();
				}}
				saveMapToLocal={(name, map) => saveMapToLocal(name, map, this.state.pathFindingDisabled)}
				setSeedrandomToDate={this.setSeedrandomToDate}
			/>
		);
	}

	renderReturnToMainMenuBtn() {
		return (
			<WaveButton
				className="returnToMainMenuBtn"
				key={'returnToMainMenuBtn'}
				onClick={() => {
					this.setMenuScreen('mainMenu');
				}}
				text={'Return To Main Menu'}
			/>
		);
	}

	chooseMenuScreen() {
		let menuScreen;
		switch (this.state.menuScreen) {
			case 'mainMenu':
				menuScreen = this.mainMenuScreen();
				break;
			case 'generateMap':
				menuScreen = this.startMapScreen();
				break;
			case 'loadMap':
				menuScreen = this.loadMapScreen();
				break;
			case 'deleteConfirmation':
				menuScreen = this.deleteMapConfirmationScreen();
				break;
			case 'howToPlay':
				menuScreen = this.howToPlayScreen();
				break;
			case 'about':
				menuScreen = this.aboutScreen();
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
