import React, { useState } from 'react';
import { saveMapToLocal } from 'js/utility/localStorage';
import WaveButton from 'js/components/WaveButton';

export const SaveMapDisplay = (props) => {
	const { display, setDisplay, gameState } = props;
	const [ mapSaveName, setMapSaveName ] = useState(null);
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
					saveMapToLocal({ name: mapSaveName, ...gameState });
					setMapSaveName(null);
					setDisplay({ ...display, savePopUp: false });
				}}
				text={'Save Map'}
			/>
		</div>
	);
};

export default SaveMapDisplay;
