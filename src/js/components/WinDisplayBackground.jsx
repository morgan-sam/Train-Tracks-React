import React from 'react';
import { randomIntFromInterval } from 'js/utility/utilityFunctions';
import { generateRandomRGBColor } from 'js/utility/colorFunctions';

export const WinDisplayBackground = (props) => {
	let balloonContainer = [];
	const colorSelected = props.themeColor.available[props.themeColor.selected];
	if (props.visualEffects) {
		const balloonCount = 300;
		for (let i = 0; i < balloonCount; i++) {
			const color = generateRandomRGBColor();
			const left = props.visualEffects ? randomIntFromInterval(-20, 100) : 50;
			const delay = props.visualEffects ? randomIntFromInterval(0, 10000) : 0;
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
	} else balloonContainer.push(<div style={{ width: '100%', height: '100%', backgroundColor: colorSelected }} />);
	return balloonContainer;
};

export default WinDisplayBackground;
