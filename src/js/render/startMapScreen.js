import React, { useEffect } from 'react';
import WaveButton from '../components/waveButton';
import Dropdown from '../components/dropdown';
import ReturnToMainMenuBtn from './returnToMainMenuBtn';
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
		<div className="generateMapSection">
			<p key={'Map Size Label'}>Map Size</p>
			<div>{props.selectedMap ? props.selectedMap.size : null}</div>
			<Dropdown
				key={'selectMapSize'}
				style={{ width: '3rem', height: '2rem', textAlign: 'center', padding: '0 1.25rem 0 0.5rem' }}
				options={getMapSizeOptions()}
				className="mapSizeOption"
				placeholder={'8x8'}
				onHover={() => null}
				onChange={(item) => {
					props.setGameState({ ...props.gameState, size: item.value });
				}}
			/>
			<p key={'Map Seed Label'}>Map Seed</p>
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
			<div className="pathFindingOptionRow">
				<input
					type="checkbox"
					className="pathFindingCheckbox"
					onChange={(e) => props.setGameState({ ...props.gameState, pathFinding: !e.target.checked })}
				/>
				<p className="pathFindingLabel">Disable Map Generation Path Finding</p>
				<div className="pathFindingQuestionBox">?</div>
				<div className="pathFindingExplanation">
					Disables use of breadth first search algorithm in map generation. Can increase performance on old
					browsers/PCs. Maps may be lessed balanced.
				</div>
			</div>
			<div className="pathFindingOptionRow">
				<input
					type="checkbox"
					className="pathFindingCheckbox"
					onChange={(e) => props.setGameState({ ...props.gameState, balloonCloud: !e.target.checked })}
				/>
				<p className="pathFindingLabel">Disable Win Screen Balloon Cloud</p>
				<div className="pathFindingQuestionBox">?</div>
				<div className="pathFindingExplanation">
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
