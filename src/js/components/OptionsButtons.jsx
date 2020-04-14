import React, { useRef } from 'react';
import WaveButton from './WaveButton';
import {
	findIndexOfArrayInMatrix,
	randomArrayEntry,
	isNonEmptyArray,
	compareArrays
} from '../utility/utilityFunctions';

export const OptionsButtons = (props) => {
	const {
		mapTracks,
		placedTracks,
		setGameWinState,
		setPlacedTracks,
		setDisplay,
		display,
		seed,
		inGameNewMap,
		quitGame
	} = props;
	const clipboard = useRef(null);

	const getRandomNonPlacedTrack = (mapTracks, placedTracks) => {
		const placedTracksArray = placedTracks.map((el) => el.tile);
		const placedRailTypesArray = placedTracks.map((el) => el.railType);
		const unplacedTracks = [ ...mapTracks ].filter((el) => {
			if (el.defaultTrack) return false;
			const index = findIndexOfArrayInMatrix(el.tile, placedTracksArray);
			if (index === -1) return true;
			return placedRailTypesArray[index] !== el.railType;
		});
		if (isNonEmptyArray(unplacedTracks)) return randomArrayEntry(unplacedTracks);
		else return null;
	};

	const replaceOldTrackInArray = (newTrack, tracks) => {
		if (!newTrack) return tracks;
		const filteredTracks = tracks.filter((el) => !compareArrays(newTrack.tile, el.tile));
		return [ ...filteredTracks, newTrack ];
	};

	return (
		<div className="inGameOptions">
			<div className="topRowInGameButtons">
				<WaveButton
					key={'addHintTrackButton'}
					clickDelay={50}
					onClick={() => {
						const randomTrack = getRandomNonPlacedTrack(mapTracks, placedTracks);
						const newTrackArray = replaceOldTrackInArray(randomTrack, placedTracks);
						setPlacedTracks(newTrackArray);
					}}
					text={'Add Hint Track'}
				/>
				<WaveButton
					key={'highlightDefaultTilesBtn'}
					clickDelay={50}
					onClick={() => setDisplay({ ...display, defaultHighlights: !display.defaultHighlights })}
					text={display.defaultHighlights ? 'Hide Default Tiles' : 'Show Default Tiles'}
				/>
				<WaveButton
					key={'showMapSolutionBtn'}
					clickDelay={200}
					onClick={() => setDisplay({ ...display, solutionVisible: !display.solutionVisible })}
					text={display.solutionVisible ? 'Hide Map Solution' : 'Show Map Solution'}
				/>
			</div>
			<div className="bottomRowInGameButtons">
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
					key={'saveMapBtn'}
					onClick={() => {
						setDisplay({ ...display, savePopUp: true, winPopUp: false });
					}}
					clickDelay={100}
					text={'Save Map'}
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
						setGameWinState(false);
						setPlacedTracks([]);
						setDisplay({ ...display, winPopUp: false, solutionVisible: false });
						inGameNewMap();
					}}
					clickDelay={200}
					text={'New Map'}
				/>

				<WaveButton key={'quitBtn'} onClick={() => quitGame()} text={'Quit Game'} />
			</div>
		</div>
	);
};

export default OptionsButtons;
