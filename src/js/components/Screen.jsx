import React from 'react';
import Game from './Game';
import LoadMapScreen from '../screen/loadMapScreen.jsx';
import HowToPlayScreen from '../screen/howToPlayScreen.jsx';
import StartMapScreen from '../screen/startMapScreen.jsx';
import AboutScreen from '../screen/aboutScreen.jsx';
import MainMenuScreen from '../screen/mainMenuScreen.jsx';

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

	return <div className="screen">{getScreenDisplay(props.currentScreen)}</div>;
};

export default Screen;
