import React, { useEffect, useState } from 'react';
import Screen from 'js/components/Screen';

import { generateNewMap } from 'js/generation/map/generateMap';
import { getRandomSeed } from 'js/utility/utilityFunctions';

import { generateUnknownTrackIcon } from 'js/generation/icon/generateUnknownTrackIcon';
import { generateCrossTrackIcon } from 'js/generation/icon/generateCrossTrackIcon';
import { roygbivArray } from 'js/utility/colorFunctions';

export const App = () => {
	const [ gameState, setGameState ] = useState({
		size: 8,
		seed: getRandomSeed(),
		difficulty: 3,
		mapObject: null,
		active: false,
		visualEffects: true
	});

	const [ currentScreen, setCurrentScreen ] = useState('mainMenu');
	const [ tileRemSize, setTileRemSize ] = useState(3.5);
	const [ railImages, setRailImages ] = useState({
		unknown: generateUnknownTrackIcon(tileRemSize),
		cross: generateCrossTrackIcon(tileRemSize)
	});
	const [ themeColor, setThemeColor ] = useState({ available: roygbivArray(), selected: 0 });
	const [ visualEffects, setVisualEffects ] = useState(true);

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

	const quitGame = () => {
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
		tileRemSize,
		railImages,
		themeColor,
		setThemeColor,
		visualEffects,
		setVisualEffects
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
