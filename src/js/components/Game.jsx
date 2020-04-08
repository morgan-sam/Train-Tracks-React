import React, { useEffect, useState, useRef } from 'react';
import Map from './Map';
import WaveButton from './WaveButton';
import OptionsButtons from './OptionsButtons';

import { generateMapBackground } from '../generation/generateIcon';
import { randomIntFromInterval } from '../utility/utilityFunctions';
import { generateRandomRGBColor } from '../utility/colorFunctions';
import { saveMapToLocal } from '../utility/localStorage';

export const Game = (props) => {
	const [ gameWon, setGameWinState ] = useState(false);
	const [ mapSaveName, setMapSaveName ] = useState(null);
	const [ placedTracks, setPlacedTracks ] = useState([]);

	const [ display, setDisplay ] = useState({
		winPopUp: false,
		savePopUp: false,
		saveBoxCutOut: null,
		defaultHighlights: false,
		solutionVisible: false
	});

	function renderGameWinDisplay() {
		return (
			<div key={'gameWinDisplay'} className="winDisplay" onContextMenu={(e) => e.preventDefault()}>
				<h2 key={'winText'} className="winText">
					You Win!
				</h2>
				<button
					key={'closeWinDisplay'}
					className={'closePopUpWindow'}
					onClick={() => setDisplay({ ...display, winPopUp: false })}
				>
					X
				</button>
				<div key={'balloonContainer'} className={'balloonContainer'}>
					{renderWinDisplayBackground()}
				</div>
			</div>
		);
	}

	function renderWinDisplayBackground() {
		const balloonCount = props.gameState.balloonCloud ? 300 : 1;
		let balloonContainer = [];
		for (let i = 0; i < balloonCount; i++) {
			const color = generateRandomRGBColor();
			const left = props.gameState.balloonCloud ? randomIntFromInterval(-20, 100) : 50;
			const delay = props.gameState.balloonCloud ? randomIntFromInterval(0, 10000) : 0;
			const balloonStyle = {
				left: `${left}%`,
				backgroundColor: color,
				color: color,
				opacity: 0,
				animationDelay: `${delay}ms`
			};
			balloonContainer.push(
				<div key={i} className="balloon" style={balloonStyle}>
					<div key={`balloonString${i}`} className={'balloonString'}>
						؁
					</div>
				</div>
			);
		}
		return balloonContainer;
	}

	function renderSaveMapDisplay() {
		return (
			<div key={'saveMapDisplay'} className="saveMapDisplay" onContextMenu={(e) => e.preventDefault()}>
				<p>Enter a name to save map as:</p>
				<button
					key={'closeSaveMapDisplay'}
					className={'closePopUpWindow'}
					onClick={() => setDisplay({ ...display, savePopUp: false })}
				>
					X
				</button>
				<input
					key={'saveNameInputBox'}
					className={'saveNameInputBox'}
					onChange={(e) => setMapSaveName(e.target.value)}
				/>
				<WaveButton
					key={'confirmSaveMapBtn'}
					className={'confirmSaveMapBtn'}
					onClick={() => {
						saveMapToLocal({ name: mapSaveName, ...props.gameState });
						setMapSaveName(null);
						setDisplay({ ...display, savePopUp: false });
					}}
					text={'Save Map'}
				/>
			</div>
		);
	}

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

	return (
		<div>
			<div className="gameMapContainer">
				{display.winPopUp ? renderGameWinDisplay() : null}
				{display.savePopUp ? renderSaveMapDisplay() : null}
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
			/>
		</div>
	);
};

export default Game;
