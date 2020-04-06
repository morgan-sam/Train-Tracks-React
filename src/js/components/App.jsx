import React, { useEffect, useState } from 'react';
import Game from './Game';
import LoadMapScreen from '../render/loadMapScreen';
import HowToPlayScreen from '../render/howToPlayScreen';
import StartMapScreen from '../render/startMapScreen';
import AboutScreen from '../render/aboutScreen';
import { generateNewMap } from '../generation/generateMap';
import MainMenuScreen from '../render/mainMenuScreen';

import { getRandomSeed } from '../utility/utilityFunctions';

export const App = () => {
	const [ gameState, setGameState ] = useState({
		size: 8,
		seed: getRandomSeed(),
		mapObject: null,
		pathFinding: true,
		active: false,
		balloonCloud: true
	});
	const [ currentScreen, setCurrentScreen ] = useState('mainMenu');
	const [ tileRemSize, setTileRemSize ] = useState(3.5);

	function generateMap() {
		const pathFindingDisabled = !gameState.pathFinding;
		const mapObject = generateNewMap(gameState.size, gameState.size, gameState.seed, pathFindingDisabled);
		setGameState({
			...gameState,
			mapObject,
			active: true
		});
	}

	function inGameNewMap() {
		const seed = getRandomSeed();
		const pathFindingDisabled = !gameState.pathFinding;
		const mapObject = generateNewMap(gameState.size, gameState.size, seed, pathFindingDisabled);
		setGameState({
			...gameState,
			seed,
			mapObject
		});
	}

	function quitGame() {
		setGameState({
			...gameState,
			mapObject: null,
			seed: getRandomSeed(),
			active: false
		});
		setCurrentScreen('mainMenu');
	}

	function switchToScreen() {
		const props = {
			currentScreen,
			setCurrentScreen,
			gameState,
			setGameState,
			inGameNewMap,
			generateMap,
			quitGame,
			tileRemSize
		};
		switch (currentScreen) {
			case 'mainMenu':
				return <MainMenuScreen {...props} />;
			case 'startMap':
				return <StartMapScreen {...props} />;
			case 'loadMap':
				return <LoadMapScreen {...props} />;
			case 'howToPlay':
				return <HowToPlayScreen {...props} />;
			case 'about':
				return <AboutScreen {...props} />;
			case 'game':
				return <Game {...props} />;
			default:
				return <MainMenuScreen {...props} />;
		}
	}

	useEffect(
		() => {
			if (gameState.mapObject !== null && gameState.active) {
				setCurrentScreen('game');
			}
		},
		[ gameState.mapObject, gameState.active ]
	);

	useEffect(
		() => {
			const mapSeedInput = document.getElementById('mapSeedInput');
			if (mapSeedInput) mapSeedInput.value = gameState.seed;
		},
		[ gameState.seed ]
	);

	return (
		<div key={'appScreen'} className="appScreen">
			<div key={'menuScreen'} className="menuScreen">
				<h1 key={'title'} className="gameTitle">
					Train Tracks
				</h1>
				{switchToScreen()}
			</div>
		</div>
	);
};

export default App;
