import React from 'react';
import ReturnToMainMenuBtn from '../components/returnToMainMenuBtn.jsx';

export const AboutScreen = (props) => {
	return (
		<div className="menu aboutScreen">
			<p>This game was created with React.</p>
			<p>
				<a href="https://github.com/morgan-sam/Train-Tracks-React">Source Code</a>
			</p>
			<p>Samuel Morgan - 2020</p>
			<ReturnToMainMenuBtn {...props} />
		</div>
	);
};

export default AboutScreen;
