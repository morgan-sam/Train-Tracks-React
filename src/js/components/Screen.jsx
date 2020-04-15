import React from 'react';
import Game from 'js/components/Game';
import LoadMapScreen from 'js/screen/loadMapScreen.jsx';
import HowToPlayScreen from 'js/screen/howToPlayScreen.jsx';
import StartMapScreen from 'js/screen/startMapScreen.jsx';
import AboutScreen from 'js/screen/aboutScreen.jsx';
import MainMenuScreen from 'js/screen/mainMenuScreen.jsx';

export const Screen = (props) => {
	const getScreenDisplay = (screen) => {
		switch (screen) {
			case 'mainMenu':
				return <MainMenuScreen {...props} />;
			case 'startMap':
				return <StartMapScreen {...props} />;
			case 'loadMap':
				return <LoadMapScreen {...props} />;
			case 'howToPlay':
				return <HowToPlayScreen {...props} />;
			case 'about':
				return <AboutScreen {...props} />;
			case 'game':
				return <Game {...props} />;
			default:
				return <MainMenuScreen {...props} />;
		}
	};

	return (
		<div className="screen" key={props.currentScreen}>
			<h1 key={'title'} className="gameTitle">
				Train Tracks
			</h1>
			{getScreenDisplay(props.currentScreen)}
		</div>
	);
};

export default Screen;
