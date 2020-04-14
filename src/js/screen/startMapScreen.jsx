import React, { useEffect } from 'react';
import '../../css/startMapScreen.css';
import WaveButton from '../components/WaveButton';
import Dropdown from '../components/Dropdown';
import ReturnToMainMenuBtn from '../components/returnToMainMenuBtn.jsx';
import { getRandomSeed } from '../utility/utilityFunctions';

const DIFFICULTY_SLIDER_WIDTH_REM = 5;

function getMapSizeOptions() {
	let mapSizeOptions = [];
	for (let i = 0; i < 3; i++) {
		const mapSize = 6 + i * 2;
		mapSizeOptions.push({
			display: `${mapSize}x${mapSize}`,
			value: mapSize
		});
	}
	return mapSizeOptions;
}

export const StartMapScreen = (props) => {
	useEffect(() => {
		props.setGameState({ ...props.gameState, seed: getRandomSeed() });
	}, []);

	return (
		<div className="menu startMapScreen">
			<div className="startMapOptionsContainer">
				<p className="startMapOptionLabel" key={'Map Size Label'}>
					Map Size
				</p>
				<Dropdown
					key={'selectMapSize'}
					style={{ width: '3rem', height: '2rem', textAlign: 'center', padding: '0 1.25rem 0 0.5rem' }}
					options={getMapSizeOptions()}
					className="mapSizeOption"
					placeholder={`${props.gameState.size}x${props.gameState.size}`}
					onHover={() => null}
					onChange={(item) => {
						props.setGameState({ ...props.gameState, size: item.value });
					}}
				/>
				<p className="startMapOptionLabel" key={'Map Seed Label'}>
					Map Seed
				</p>
				<div className="mapSeedOptionRow">
					<input
						key="mapSeedInput"
						type="text"
						className="mapSeedInput"
						id="mapSeedInput"
						defaultValue={props.gameState.seed}
						onChange={(e) => props.setGameState({ ...props.gameState, seed: e.target.value })}
						style={{ width: '8rem', textAlign: 'center' }}
					/>
					<div
						key="rerollSeedBtn"
						className="rerollSeedBtn"
						onClick={(e) => {
							e.preventDefault();
							props.setGameState({ ...props.gameState, seed: getRandomSeed() });
						}}
					>
						<span className="diceSymbol">⚄</span>
					</div>
				</div>

				<p className="startMapOptionLabel">Difficulty:</p>

				<div className="startMapSliderRow">
					<input
						className="difficultySlider"
						onChange={(e) =>
							props.setGameState({
								...props.gameState,
								difficulty: parseInt(e.target.value)
							})}
						type="range"
						min="1"
						max="5"
						value={props.gameState.difficulty}
						style={{ width: `${DIFFICULTY_SLIDER_WIDTH_REM}rem` }}
					/>
					<div
						className="difficultyLabel"
						style={{
							left: `${-0.2 + props.gameState.difficulty}rem`
						}}
					>
						{props.gameState.difficulty}
					</div>
					<div className="questionBox difficultyQuestionBox">?</div>
					<div className="startOptionExplanation difficultyExplanation">
						Adjusts the amount of default tiles in game. Difficulty 3 ensures the absolute minimum amount of
						default tiles required for a map that has one definitive solution.<br />
						<br />Difficulties above 3 may require trial and error and will likely have multiple possible
						solutions (only one solution accepted).
					</div>
				</div>

				<div className="startOptionOptionRow">
					<input
						type="checkbox"
						className="startOptionCheckbox"
						onChange={(e) => props.setGameState({ ...props.gameState, balloonCloud: !e.target.checked })}
					/>
					<p className="startOptionRowLabel">Disable Win Screen Balloon Cloud</p>
					<div className="questionBox balloonCloudQuestionBox">?</div>
					<div className="startOptionExplanation balloonCloudExplanation">
						Disables the balloon cloud effect at the end of a game win. Can increase performance on old
						browsers/PCs.
					</div>
				</div>
				<WaveButton
					className="generateMapBtn"
					key={'generateMapBtn'}
					onClick={() => {
						props.generateMap();
					}}
					text={'Generate Map'}
				/>
			</div>
			<ReturnToMainMenuBtn {...props} />
		</div>
	);
};

export default StartMapScreen;
