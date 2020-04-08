import React from 'react';
import WaveButton from '../components/WaveButton';

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
