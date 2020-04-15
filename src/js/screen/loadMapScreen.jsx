import React, { useState } from 'react';
import WaveButton from 'js/components/WaveButton';
import Dropdown from 'js/components/Dropdown';
import DeleteMapConfirmScreen from 'js/screen/deleteMapConfirmScreen.jsx';
import { generateMapIcon } from 'js/generation/icon/generateMapIcon';
import ReturnToMainMenuBtn from 'js/components/ReturnToMainMenuBtn.jsx';

import { getLocalStorageMaps } from 'js/utility/localStorage';

function renderSavedMapsDropdownValues() {
	const localMaps = getLocalStorageMaps();
	let dropDownValues = [];
	localMaps.forEach(async (el) => {
		dropDownValues.push({
			display: el.name,
			seed: el.seed,
			size: el.size,
			mapObject: el.mapObject
		});
	});

	return dropDownValues;
}

export const LoadMapScreen = (props) => {
	const [ screenState, setScreenState ] = useState('load');
	const [ mapIcon, setMapIcon ] = useState(null);

	async function displaySavedGameMapIcon(mapObject) {
		setMapIcon(mapObject ? await generateMapIcon(mapObject, false) : null);
	}

	if (screenState === 'load') {
		return (
			<div className="menu loadMapScreen">
				<Dropdown
					className="loadMapDropdown"
					style={{ width: '12rem', height: '2rem' }}
					placeholder={'Select a map'}
					options={renderSavedMapsDropdownValues()}
					onChange={(item) => {
						const { display, ...mapObject } = item;
						props.setGameState({ ...props.gameState, ...mapObject });
					}}
					onHover={(mapObject) => {
						if (mapObject !== null) displaySavedGameMapIcon(mapObject);
					}}
				/>
				<img
					alt=""
					src={mapIcon}
					className="mapIcon"
					style={{ border: mapIcon ? '0.15rem #aaa solid' : 'none' }}
				/>

				<WaveButton
					className="loadSaveMapBtn"
					key={'loadSaveMapBtn'}
					onClick={() => {
						if (props.gameState.mapObject) props.setGameState({ ...props.gameState, active: true });
					}}
					text={'Load Map'}
				/>
				<WaveButton
					className="deleteSaveMapBtn"
					key={'deleteSaveMapBtn'}
					onClick={() => {
						if (mapIcon) setScreenState('deleteOne');
					}}
					text={'Delete Map'}
				/>
				<WaveButton
					className="deleteAllSavedMapsBtn"
					key={'deleteAllSavedMapsBtn'}
					onClick={() => setScreenState('deleteAll')}
					text={'Delete All Maps'}
				/>
				<ReturnToMainMenuBtn {...props} />
			</div>
		);
	} else {
		const deleteModeOnAll = screenState === 'deleteOne' ? false : true;
		return (
			<DeleteMapConfirmScreen
				{...props}
				mapIcon={mapIcon}
				deleteModeOnAll={deleteModeOnAll}
				quitToLoadScreen={() => {
					setMapIcon(null);
					setScreenState('load');
				}}
			/>
		);
	}
};

export default LoadMapScreen;
