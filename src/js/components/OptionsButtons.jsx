import React, { useRef } from 'react';
import WaveButton from 'js/components/WaveButton';
import { addHintTrack } from 'js/trackFunctions/addHintTrack';

export const OptionsButtons = (props) => {
	const {
		mapTracks,
		placedTracks,
		setGameWon,
		setPlacedTracks,
		setDisplay,
		display,
		seed,
		inGameNewMap,
		quitGame
	} = props;

	const clipboard = useRef(null);

	return (
		<div className="inGameOptions">
			<div className="topRowInGameButtons">
				<WaveButton
					key={'addHintTrackButton'}
					onClick={() => {
						const newTrackArray = addHintTrack(mapTracks, placedTracks);
						setPlacedTracks(newTrackArray);
					}}
					text={'Add Hint Track'}
					clickDelay={50}
				/>
				<WaveButton
					key={'highlightDefaultTilesBtn'}
					onClick={() => setDisplay({ ...display, defaultHighlights: !display.defaultHighlights })}
					text={display.defaultHighlights ? 'Hide Default Tiles' : 'Show Default Tiles'}
					clickDelay={50}
				/>
				<WaveButton
					key={'showMapSolutionBtn'}
					onClick={() => setDisplay({ ...display, solutionVisible: !display.solutionVisible })}
					text={display.solutionVisible ? 'Hide Map Solution' : 'Show Map Solution'}
					clickDelay={200}
				/>
			</div>
			<div className="bottomRowInGameButtons">
				<WaveButton
					key={'resetMapBtn'}
					onClick={async () => {
						setGameWon(false);
						setPlacedTracks([]);
						setDisplay({ ...display, winPopUp: false, solutionVisible: false });
					}}
					text={'Reset Map'}
					clickDelay={100}
				/>
				<WaveButton
					key={'saveMapBtn'}
					onClick={() => {
						setDisplay({ ...display, savePopUp: true, winPopUp: false });
					}}
					text={'Save Map'}
					clickDelay={100}
				/>
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
					key={'newMapBtn'}
					onClick={() => {
						setGameWon(false);
						setPlacedTracks([]);
						setDisplay({ ...display, winPopUp: false, solutionVisible: false });
						inGameNewMap();
					}}
					text={'New Map'}
					clickDelay={200}
				/>

				<WaveButton key={'quitBtn'} onClick={() => quitGame()} text={'Quit Game'} />
			</div>
		</div>
	);
};

export default OptionsButtons;
