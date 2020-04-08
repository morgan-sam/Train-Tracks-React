import React, { useRef } from 'react';
import WaveButton from './WaveButton';

export const OptionsButtons = (props) => {
	const { setGameWinState, setPlacedTracks, setDisplay, display, seed, inGameNewMap } = props;

	const clipboard = useRef(null);
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
						value={seed}
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
						inGameNewMap();
					}}
					text={'New Map'}
				/>

				<WaveButton key={'quitBtn'} onClick={() => props.quitGame()} text={'Quit Game'} />
			</div>
		</div>
	);
};

export default OptionsButtons;
