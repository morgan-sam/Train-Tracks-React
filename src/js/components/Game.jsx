import React, { useEffect, useState } from 'react';
import 'css/game.css';

import Map from 'js/components/Map';
import SaveCutout from 'js/components/SaveCutout';
import OptionsButtons from 'js/components/OptionsButtons';
import SaveMapDisplay from 'js/components/SaveMapDisplay';
import GameWinDisplay from 'js/components/GameWinDisplay';

import { generateMapBackground } from 'js/generation/icon/generateMapIcon';
import { getGameMapContainerStyle } from 'js/styles/game';

export const Game = (props) => {
	const { gameState, tileRemSize, visualEffects, themeColor, mapSeed, railImages, inGameNewMap, quitGame } = props;

	const [ gameWon, setGameWon ] = useState(false);
	const [ placedTracks, setPlacedTracks ] = useState([]);

	const [ display, setDisplay ] = useState({
		winPopUp: false,
		savePopUp: false,
		saveBoxCutOut: null,
		defaultHighlights: false,
		solutionVisible: false
	});

	useEffect(
		() => {
			(async () => {
				if (display.savePopUp) {
					setDisplay({
						...display,
						saveBoxCutOut: await generateMapBackground(gameState.mapObject, tileRemSize)
					});
				} else setDisplay({ ...display, saveBoxCutOut: null });
			})();
		},
		[ display.savePopUp ]
	);

	useEffect(
		() => {
			if (gameWon) setDisplay({ ...display, winPopUp: true });
		},
		[ gameWon ]
	);

	const commonProps = {
		placedTracks,
		setPlacedTracks,
		visualEffects,
		display,
		setGameWon
	};

	return (
		<div>
			<div style={getGameMapContainerStyle(gameState.size, tileRemSize)}>
				{display.winPopUp && <GameWinDisplay {...{ display, setDisplay, visualEffects, themeColor }} />}
				{display.savePopUp && <SaveMapDisplay {...{ display, setDisplay, gameState }} />}
				<Map
					key={mapSeed}
					{...{
						tileRemSize,
						railImages,
						themeColor
					}}
					trainTrackMap={gameState.mapObject}
					{...commonProps}
				/>
				<SaveCutout {...{ display, tileRemSize }} />
			</div>
			<OptionsButtons
				setDisplay={setDisplay}
				mapTracks={gameState.mapObject.tracks}
				seed={gameState.seed}
				inGameNewMap={inGameNewMap}
				quitGame={quitGame}
				{...commonProps}
			/>
		</div>
	);
};

export default Game;
