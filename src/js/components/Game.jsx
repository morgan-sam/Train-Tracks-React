import React, { useEffect, useState } from 'react';
import Map from './Map';
import OptionsButtons from './OptionsButtons';
import SaveMapDisplay from './SaveMapDisplay';
import GameWinDisplay from './GameWinDisplay';

import { generateMapBackground } from '../generation/generateIcon';

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
			async function addCutOutToScreen() {
				if (display.savePopUp) {
					setDisplay({
						...display,
						saveBoxCutOut: await generateMapBackground(props.gameState.mapObject, props.tileRemSize)
					});
				} else {
					setDisplay({ ...display, saveBoxCutOut: null });
				}
			}
			addCutOutToScreen();
		},
		[ display.savePopUp ]
	);

	console.log(display);
	return (
		<div>
			<div className="gameMapContainer">
				{display.winPopUp && (
					<GameWinDisplay
						display={display}
						setDisplay={setDisplay}
						balloonCloud={props.gameState.balloonCloud}
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
						console.log(val);
						setGameWinState(val);
						setDisplay({ ...display, winPopUp: val });
					}}
					gameComplete={gameWon}
					controlsActive={!display.savePopUp}
					mapVisible={!display.saveBoxCutOut}
					setPlacedTracks={(val) => setPlacedTracks(val)}
					placedTracks={placedTracks}
				/>
				<img
					alt=""
					draggable="false"
					src={display.saveBoxCutOut}
					className="saveBoxMapCutout"
					style={{
						position: 'absolute',
						top: `${props.tileRemSize}rem`,
						left: '0px',
						border: display.saveBoxCutOut ? '1px solid black' : 'none'
					}}
				/>
			</div>
			<OptionsButtons
				setGameWinState={setGameWinState}
				setPlacedTracks={setPlacedTracks}
				setDisplay={setDisplay}
				display={display}
				seed={props.gameState.seed}
				inGameNewMap={props.inGameNewMap}
				quitGame={props.quitGame}
			/>
		</div>
	);
};

export default Game;
