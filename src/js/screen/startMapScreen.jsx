import React, { useEffect } from 'react';
import '../../css/startMapScreen.css';
import WaveButton from '../components/WaveButton';
import Dropdown from '../components/Dropdown';
import ReturnToMainMenuBtn from '../components/returnToMainMenuBtn.jsx';
import { getRandomSeed } from '../utility/utilityFunctions';

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
			<div className="startOptionOptionRow">
				<input
					type="checkbox"
					className="startOptionCheckbox"
					onChange={(e) => props.setGameState({ ...props.gameState, balloonCloud: !e.target.checked })}
				/>
				<p className="startOptionLabel">Disable Win Screen Balloon Cloud</p>
				<div className="startOptionQuestionBox">?</div>
				<div className="startOptionExplanation">
					Disables the balloon cloud effect at the end of a game win. Can increase performance on old
					browsers/PCs.
				</div>
			</div>
			<WaveButton
				key={'generateMapBtn'}
				onClick={() => {
					props.generateMap();
				}}
				text={'Generate Map'}
			/>
			<ReturnToMainMenuBtn {...props} />
		</div>
	);
};

export default StartMapScreen;
