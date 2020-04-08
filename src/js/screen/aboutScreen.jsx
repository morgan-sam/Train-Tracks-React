import React from 'react';
import ReturnToMainMenuBtn from './returnToMainMenuBtn';

export const AboutScreen = (props) => {
	return (
		<div>
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
