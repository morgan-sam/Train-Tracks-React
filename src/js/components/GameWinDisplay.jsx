import React from 'react';
import 'css/balloon.css';
import WinDisplayBackground from 'js/components/WinDisplayBackground';

export const GameWinDisplay = (props) => {
	const { display, setDisplay, visualEffects, themeColor } = props;
	return (
		<div key={'gameWinDisplay'} className="winDisplay" onContextMenu={(e) => e.preventDefault()}>
			<h2 key={'winText'} className="winText">
				You Win!
			</h2>
			<button
				key={'closeWinDisplay'}
				className={'closePopUpWindow'}
				onClick={() => setDisplay({ ...display, winPopUp: false })}
			>
				X
			</button>
			<div key={'balloonContainer'} className={'balloonContainer'}>
				<WinDisplayBackground visualEffects={visualEffects} themeColor={themeColor} />
			</div>
		</div>
	);
};

export default GameWinDisplay;
