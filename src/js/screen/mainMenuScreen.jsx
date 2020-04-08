import React from 'react';
import WaveButton from '../components/WaveButton';

export const MainMenuScreen = (props) => {
	return (
		<div className="mainMenuScreen" key="mainMenuScreen">
			<WaveButton
				className="startGameBtn"
				key={'startGameBtn'}
				onClick={() => {
					props.setCurrentScreen('startMap');
				}}
				text={'Start Game'}
			/>
			<WaveButton
				className="loadSavedGameBtn"
				key={'loadSavedGameBtn'}
				onClick={() => {
					props.setCurrentScreen('loadMap');
				}}
				text={'Load Saved Map'}
			/>
			<WaveButton
				className="howToPlayPageBtn"
				key={'howToPlayPageBtn'}
				onClick={async () => {
					props.setCurrentScreen('howToPlay');
				}}
				text={'How To Play'}
			/>
			<WaveButton
				className="aboutBtn"
				key={'aboutBtn'}
				onClick={() => {
					props.setCurrentScreen('about');
				}}
				text={'About'}
			/>
		</div>
	);
};

export default MainMenuScreen;
