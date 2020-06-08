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
			const addCutOutToScreen = async () => {
				if (display.savePopUp) {
					setDisplay({
						...display,
						saveBoxCutOut: await generateMapBackground(props.gameState.mapObject, props.tileRemSize)
					});
				} else setDisplay({ ...display, saveBoxCutOut: null });
			};
			addCutOutToScreen();
		},
		[ display.savePopUp ]
	);

	const commonProps = {
		placedTracks,
		setPlacedTracks,
		visualEffects: props.visualEffects
	};
	return (
		<div>
			<div style={getGameMapContainerStyle(props.gameState.size, props.tileRemSize)}>
				{display.winPopUp && (
					<GameWinDisplay
						display={display}
						setDisplay={setDisplay}
						visualEffects={props.visualEffects}
						themeColor={props.themeColor}
					/>
				)}
				{display.savePopUp && (
					<SaveMapDisplay display={display} setDisplay={setDisplay} gameState={props.gameState} />
				)}
				<Map
					key={props.mapSeed}
					className="gameMap"
					tileRemSize={props.tileRemSize}
					defaultTilesHighlighted={display.defaultHighlights}
					mapSolutionVisible={display.solutionVisible}
					trainTrackMap={props.gameState.mapObject}
					mapHeight={props.gameState.size}
					mapWidth={props.gameState.size}
					setGameCompleteState={(val) => {
						setGameWinState(val);
						setDisplay({ ...display, winPopUp: val });
					}}
					gameComplete={gameWon}
					controlsActive={!display.savePopUp}
					mapVisible={!display.saveBoxCutOut}
					railImages={props.railImages}
					themeColor={props.themeColor}
					{...commonProps}
				/>
				<SaveCutout saveBoxCutOut={display.saveBoxCutOut} tileRemSize={props.tileRemSize} />
			</div>
			<OptionsButtons
				setGameWinState={setGameWinState}
				setDisplay={setDisplay}
				mapTracks={props.gameState.mapObject.tracks}
				display={display}
				seed={props.gameState.seed}
				inGameNewMap={props.inGameNewMap}
				quitGame={props.quitGame}
				{...commonProps}
			/>
		</div>
	);
};

export default Game;
