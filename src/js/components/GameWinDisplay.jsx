import React from 'react';
import WinDisplayBackground from './WinDisplayBackground';

export const GameWinDisplay = (props) => {
	const { display, setDisplay, balloonCloud } = props;
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
				<WinDisplayBackground balloonCloud={balloonCloud} />
			</div>
		</div>
	);
};

export default GameWinDisplay;
