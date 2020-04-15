import React, { useEffect } from 'react';
import 'css/startMapScreen.css';
import WaveButton from 'js/components/WaveButton';
import Dropdown from 'js/components/Dropdown';
import DifficultySlider from 'js/components/DifficultySlider';
import ReturnToMainMenuBtn from 'js/components/ReturnToMainMenuBtn.jsx';
import { getRandomSeed } from 'js/utility/utilityFunctions';

const SLIDER_WIDTH_REM = 5;

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
					<DifficultySlider {...props} />
					<div className="questionBox difficultyQuestionBox">?</div>
					<div className="startOptionExplanation difficultyExplanation">
						Adjusts the amount of default tiles in game. Difficulty 3 ensures the absolute minimum amount of
						default tiles required for a map that has one definitive solution.<br />
						<br />Difficulties above 3 may require trial and error and will likely have multiple possible
						solutions (only one solution accepted).
					</div>
				</div>

				<p className="startMapOptionLabel">Theme Color:</p>
				<div className="startMapSliderRow">
					<input
						className="colorSlider"
						onChange={(e) =>
							props.setThemeColor({
								...props.themeColor,
								selected: parseInt(e.target.value)
							})}
						type="range"
						min={0}
						max={props.themeColor.available.length - 1}
						value={props.themeColor.selected}
						style={{ width: `${SLIDER_WIDTH_REM * 2}rem` }}
					/>
					<div
						className="colorDemoBox"
						style={{ backgroundColor: props.themeColor.available[props.themeColor.selected] }}
					/>
				</div>
				<div className="startOptionOptionRow">
					<input
						type="checkbox"
						className="startOptionCheckbox"
						onChange={(e) => props.setVisualEffects(!e.target.checked)}
					/>
					<p className="startOptionRowLabel">Disable Visual Effects</p>
					<div className="questionBox visualEffectsQuestionBox">?</div>
					<div className="startOptionExplanation visualEffectsExplanation">
						Disables the game background and win display visual effects.<br />
						<br />Can increase performance on old browsers/PCs.
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
