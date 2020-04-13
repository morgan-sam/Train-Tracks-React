import React, { useState } from 'react';
import { colorToWhiteArray } from '../utility/colorFunctions';
import { getWaveButtonStyles } from '../styles/waveButton';

const WaveButton = ({ className, onClick, text }) => {
	const [ hovered, setHoveredState ] = useState(false);
	const [ buttonPressed, setPressedState ] = useState(false);

	const { btnDefaultStyle, btnPressedStyle, rectangleStyle, textStyle } = getWaveButtonStyles(hovered);

	const rectangleCount = 5;
	const startRotation = 30;
	const rotationOffset = 2;
	const endRotation = -15 + rectangleCount * rotationOffset;
	const startTransition = 1.5;
	const endTransition = 3;
	const transitionOffset = 0.1;
	const cubicBezierFunction = 'cubic-bezier(0,1.84,0,.32)';

	const rectangleArray = createRectangleArray(rectangleCount);

	function createRectangleArray(recCount) {
		let rectangleArray = [];
		const blueRecColors = colorToWhiteArray('#5bb1cd', recCount * 1.2);
		const purpleRecColors = colorToWhiteArray('#800080', recCount * 1.2);
		for (let i = 0; i < recCount; i++) {
			const curRecStyle = {
				background: `linear-gradient(1turn,${blueRecColors[blueRecColors.length - i - 1]},${purpleRecColors[
					purpleRecColors.length - i - 1
				]})`,
				transform: hovered
					? `rotate(${endRotation + rotationOffset * i}deg) skewY(0deg)`
					: `rotate(${startRotation + rotationOffset * i}deg) skewY(45deg)`,
				transition: hovered
					? `all ${startTransition + transitionOffset * i}s ${cubicBezierFunction}`
					: `all ${endTransition}s ${cubicBezierFunction}`
			};
			rectangleArray.push(
				<div key={i} style={{ ...rectangleStyle, ...curRecStyle }} className="rectangle" id={`rec${i}`} />
			);
		}
		return rectangleArray;
	}

	const btnStyle = buttonPressed ? { ...btnDefaultStyle, ...btnPressedStyle } : btnDefaultStyle;

	function renderButtonWhiteBackground() {
		return (
			<div
				style={{
					zIndex: '-2',
					top: '0',
					left: '0',
					position: 'absolute',
					height: '100%',
					width: '100%',
					backgroundColor: 'white'
				}}
			/>
		);
	}

	return (
		<button
			style={btnStyle}
			className={className}
			onMouseOver={() => setHoveredState(true)}
			onMouseLeave={() => (!buttonPressed ? setHoveredState(false) : null)}
			onClick={() => {
				setHoveredState(true);
				// setPressedState(true);
				// const menuBtn = onClick.toString().match(/(?:Screen|setGameState)/g);
				// const waitTime = menuBtn ? 600 : 100;
				// setTimeout(() => setPressedState(false), 200);
				// setTimeout(onClick, waitTime);
				onClick();
			}}
		>
			{rectangleArray}
			<div style={textStyle}>{text}</div>
			{renderButtonWhiteBackground()}
		</button>
	);
};

export default WaveButton;
