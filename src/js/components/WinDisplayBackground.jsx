import React from 'react';
import { randomIntFromInterval } from '../utility/utilityFunctions';
import { generateRandomRGBColor } from '../utility/colorFunctions';

export const WinDisplayBackground = (props) => {
	const balloonCount = props.balloonCloud ? 300 : 1;
	let balloonContainer = [];
	for (let i = 0; i < balloonCount; i++) {
		const color = generateRandomRGBColor();
		const left = props.balloonCloud ? randomIntFromInterval(-20, 100) : 50;
		const delay = props.balloonCloud ? randomIntFromInterval(0, 10000) : 0;
		const balloonStyle = {
			left: `${left}%`,
			backgroundColor: color,
			color: color,
			opacity: 0,
			animationDelay: `${delay}ms`
		};
		balloonContainer.push(
			<div key={i} className="balloon" style={balloonStyle}>
				<div key={`balloonString${i}`} className={'balloonString'}>
					؁
				</div>
			</div>
		);
	}
	return balloonContainer;
};

export default WinDisplayBackground;
