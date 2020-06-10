import React, { useState, useRef, useEffect } from 'react';
import { colorToWhiteArray } from 'js/utility/colorFunctions';
import { getWaveButtonStyles, rectangleParameters } from 'js/styles/waveButton';

const WaveButton = ({ className, onClick, text, bounceDelay = 200, clickDelay = 500 }) => {
	const [ hovered, setHoveredState ] = useState(false);
	const [ buttonPressed, setPressedState ] = useState(false);
	const bounceTimer = useRef();
	const clickTimer = useRef();

	const { btnDefaultStyle, btnPressedStyle, rectangleStyle, textStyle, whiteBackground } = getWaveButtonStyles(
		hovered
	);

	const {
		rectangleCount,
		startRotation,
		rotationOffset,
		endRotation,
		startTransition,
		endTransition,
		transitionOffset,
		cubicBezierFunction
	} = rectangleParameters;

	const createRectangleArray = (recCount) => {
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
	};

	const rectangleArray = createRectangleArray(rectangleCount);
	const btnStyle = buttonPressed ? { ...btnDefaultStyle, ...btnPressedStyle } : btnDefaultStyle;

	return (
		<button
			style={btnStyle}
			className={className}
			onMouseOver={() => setHoveredState(true)}
			onMouseLeave={() => (!buttonPressed ? setHoveredState(false) : null)}
			onClick={() => {
				setPressedState(true);
				bounceTimer.current = setTimeout(() => {
					setPressedState(false);
					return clearTimeout(bounceTimer.current);
				}, bounceDelay);
				clickTimer.current = setTimeout(() => {
					onClick();
					return clearTimeout(clickTimer.current);
				}, clickDelay);
			}}
		>
			{rectangleArray}
			<div style={textStyle}>{text}</div>
			<div style={whiteBackground} />
		</button>
	);
};

export default WaveButton;
