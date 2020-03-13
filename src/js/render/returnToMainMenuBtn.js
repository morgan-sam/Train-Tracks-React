import React from 'react';
import WaveButton from '../components/waveButton';

export const ReturnToMainMenuBtn = (props) => {
	return (
		<WaveButton
			className="returnToMainMenuBtn"
			key={'returnToMainMenuBtn'}
			onClick={() => {
				props.setCurrentScreen('mainMenu');
			}}
			text={'Return To Main Menu'}
		/>
	);
};

export default ReturnToMainMenuBtn;
