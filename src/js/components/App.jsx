import React, { useEffect, useState } from 'react';
import Screen from './Screen';

import { generateNewMap } from '../generation/generateMap';
import { getRandomSeed } from '../utility/utilityFunctions';

export const App = () => {
	const [ gameState, setGameState ] = useState({
		size: 8,
		seed: getRandomSeed(),
		difficulty: 3,
		mapObject: null,
		active: false,
		balloonCloud: true
	});

	const [ currentScreen, setCurrentScreen ] = useState('mainMenu');
	const [ tileRemSize, setTileRemSize ] = useState(3.5);

	function generateMap(seed = gameState.seed) {
		const gameParameters = { size: gameState.size, seed, difficulty: gameState.difficulty };
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
		setCurrentScreen('mainMenu');
		setGameState({
			...gameState,
			mapObject: null,
			seed: getRandomSeed(),
			active: false
		});
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

	const screenProps = {
		currentScreen,
		setCurrentScreen,
		gameState,
		setGameState,
		inGameNewMap,
		generateMap,
		quitGame,
		tileRemSize
	};

	return (
		<div key={'app'} className="app">
			<div key={'screenContainer'} className="screenContainer">
				<Screen {...screenProps} />
			</div>
		</div>
	);
};

export default App;
