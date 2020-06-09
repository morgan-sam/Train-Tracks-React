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

	const [ gameWon, setGameWinState ] = useState(false);
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

	const commonProps = {
		placedTracks,
		setPlacedTracks,
		visualEffects,
		display
	};
	return (
		<div>
			<div style={getGameMapContainerStyle(gameState.size, tileRemSize)}>
				{display.winPopUp && (
					<GameWinDisplay
						display={display}
						setDisplay={setDisplay}
						visualEffects={visualEffects}
						themeColor={themeColor}
					/>
				)}
				{display.savePopUp && (
					<SaveMapDisplay display={display} setDisplay={setDisplay} gameState={gameState} />
				)}
				<Map
					key={mapSeed}
					className="gameMap"
					tileRemSize={tileRemSize}
					trainTrackMap={gameState.mapObject}
					setGameCompleteState={(val) => {
						setGameWinState(val);
						setDisplay({ ...display, winPopUp: val });
					}}
					gameComplete={gameWon}
					railImages={railImages}
					themeColor={themeColor}
					{...commonProps}
				/>
				<SaveCutout saveBoxCutOut={display.saveBoxCutOut} tileRemSize={tileRemSize} />
			</div>
			<OptionsButtons
				setGameWinState={setGameWinState}
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
