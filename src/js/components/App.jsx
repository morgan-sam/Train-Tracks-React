import React, { useEffect, useState } from 'react';
import Game from './Game';
import LoadMapScreen from '../screen/loadMapScreen.jsx';
import HowToPlayScreen from '../screen/howToPlayScreen.jsx';
import StartMapScreen from '../screen/startMapScreen.jsx';
import AboutScreen from '../screen/aboutScreen.jsx';
import MainMenuScreen from '../screen/mainMenuScreen.jsx';

import { generateNewMap } from '../generation/generateMap';
import { getRandomSeed } from '../utility/utilityFunctions';

export const App = () => {
	const [ gameState, setGameState ] = useState({
		size: 8,
		seed: getRandomSeed(),
		mapObject: null,
		genParams: {
			iterative: true
		},
		active: false,
		balloonCloud: true
	});
	const [ currentScreen, setCurrentScreen ] = useState('mainMenu');
	const [ tileRemSize, setTileRemSize ] = useState(3.5);

	function generateMap(seed = gameState.seed) {
		const gameParameters = { size: gameState.size, seed, genParams: gameState.genParams };
		const mapObject = generateNewMap(gameParameters);
		setGameState({
			...gameState,
			seed,
			mapObject,
			active: true
		});
	}

	const inGameNewMap = () => {
		const newSeed = getRandomSeed();
		generateMap(newSeed);
	};

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
