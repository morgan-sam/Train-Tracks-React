import React, { useEffect, useState, useRef } from 'react';
import Map from './map';
import WaveButton from './waveButton';
import { generateMapBackground } from '../generation/generateIcon';
import { randomIntFromInterval } from '../utility/utilityFunctions';
import { generateRandomRGBColor } from '../utility/colorFunctions';
import { saveMapToLocal } from '../utility/localStorage';

export const Game = (props) => {
	const clipboard = useRef(null);

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

	function renderOptionsButtons() {
		return (
			<div className="inGameOptions">
				<div className="topRowInGameButtons">
					<WaveButton
						key={'resetMapBtn'}
						onClick={async () => {
							setGameWinState(false);
							setPlacedTracks([]);
							setDisplay({ ...display, winPopUp: false, solutionVisible: false });
						}}
						text={'Reset Map'}
					/>
					<WaveButton
						key={'highlightDefaultTilesBtn'}
						onClick={() => setDisplay({ ...display, defaultHighlights: !display.defaultHighlights })}
						text={display.defaultHighlights ? 'Hide Default Tiles' : 'Show Default Tiles'}
					/>
					<WaveButton
						key={'showMapSolutionBtn'}
						onClick={() => setDisplay({ ...display, solutionVisible: !display.solutionVisible })}
						text={display.solutionVisible ? 'Hide Map Solution' : 'Show Map Solution'}
					/>
				</div>
				<div className="bottomRowInGameButtons">
					<div className="mapSeedOptionContainer">
						<WaveButton
							style={{ zIndex: '4' }}
							className="mapSeedBtn"
							key="mapSeedBtn"
							onClick={() => {
								clipboard.current.select();
								document.execCommand('copy');
							}}
							text={'🌱'}
						/>
						<div className="mapSeedExplanation">
							<span>Copy map seed to clipboard</span>
						</div>
						<textarea
							ref={clipboard}
							readOnly
							unselectable="on"
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								opacity: 0,
								width: 0,
								height: 0,
								resize: 'none',
								cursor: 'default'
							}}
							value={props.gameState.seed}
						/>
					</div>
					<WaveButton
						key={'saveMapBtn'}
						onClick={() => {
							setDisplay({ ...display, savePopUp: true, winPopUp: false });
						}}
						text={'Save Map'}
					/>

					<WaveButton
						key={'newMapBtn'}
						onClick={() => {
							setGameWinState(false);
							setPlacedTracks([]);
							setDisplay({ ...display, winPopUp: false, solutionVisible: false });
							props.inGameNewMap();
						}}
						text={'New Map'}
					/>

					<WaveButton key={'quitBtn'} onClick={() => props.quitGame()} text={'Quit Game'} />
				</div>
			</div>
		);
	}

	useEffect(
		() => {
			async function addCutOutToScreen() {
				if (display.savePopUp) {
					setDisplay({ ...display, saveBoxCutOut: await generateMapBackground(props.gameState.mapObject) });
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
						top: '64px',
						left: '0px',
						border: display.saveBoxCutOut ? '1px solid black' : 'none'
					}}
				/>
			</div>
			{renderOptionsButtons()}
		</div>
	);
};

export default Game;
