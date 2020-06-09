import React, { useRef } from 'react';
import WaveButton from 'js/components/WaveButton';
import MapSeedCopyButton from 'js/components/MapSeedCopyButton';
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
					onClick={() => setDisplay({ ...display, savePopUp: true, winPopUp: false })}
					text={'Save Map'}
					clickDelay={100}
				/>
				<MapSeedCopyButton seed={seed} />
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
