import React, { useEffect, useState } from 'react';
import { colorToWhiteArray } from '../utility/colorToWhite';
import { print } from '../utility/utilityFunctions';

const WaveButton = ({ className, onClick, text }) => {
	const [ hovered, setHoveredState ] = useState(false);
	const [ buttonPressed, setPressedState ] = useState(false);

	const btnDefaultStyle = {
		position: 'relative',
		overflow: 'hidden',
		cursor: 'pointer',
		background: 'none',
		zIndex: '0',
		borderRadius: '1rem',
		border: '1px #ccc solid',
		outline: 'none',
		transition: '0.3s',
		top: '0px',
		boxShadow: '0px 5px 0px 2px #eee'
	};

	const btnPressedStyle = {
		transition: '0.1s',
		top: '10px',
		boxShadow: 'none'
	};

	const textStyle = {
		zIndex: '1',
		color: hovered ? 'white' : 'black',
		transition: hovered ? `${0.8}s` : '3s'
	};

	const rectangleStyle = {
		top: '0%',
		left: '-50%',
		height: '200%',
		width: '500%',
		position: 'absolute',
		zIndex: '-1',
		borderRadius: '50rem'
	};

	const rectangleCount = 5;

	const startRotation = 0;
	const rotationOffset = 2;
	const endRotation = -15 + rectangleCount * rotationOffset;
	const startTransition = 0.1;
	const endTransition = 3;
	const transitionOffset = 0.1;

	let rectangleArray = createRectangleArray(rectangleCount);

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
					: `rotate(${startRotation + rotationOffset * i}deg) skewY(60deg)`,
				transition: hovered ? `${startTransition + transitionOffset * i}s` : `${endTransition}s`
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
				setPressedState(true);
				const menuBtn = onClick.toString().match(/(?:Screen|setGameState)/g);
				const waitTime = menuBtn ? 600 : 100;
				setTimeout(() => setPressedState(false), 200);
				setTimeout(onClick, waitTime);
			}}
		>
			{rectangleArray}
			<div style={textStyle}>{text}</div>
			{renderButtonWhiteBackground()}
		</button>
	);
};

export default WaveButton;
