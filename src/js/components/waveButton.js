import React, { useEffect, useState } from 'react';
import { print } from '../utility/utilityFunctions';

const WaveButton = ({ className, onClick, text }) => {
	const [ hovered, setHoveredState ] = useState(false);

	const waveStyle = {
		width: '100%',
		height: '100%',
		left: hovered ? '0' : '-100%',
		position: 'absolute',
		transition: 'all .35s ease-Out',
		bottom: '0',
		backgroundColor: 'salmon',
		zIndex: '-1'
	};

	const btnStyle = {
		position: 'relative',
		overflow: 'hidden',
		cursor: 'pointer',
		background: 'none',
		zIndex: '0'
	};

	const textStyle = { zIndex: '1' };

	const rectangleStyle = {
		height: '1000%',
		width: '300%',
		position: 'absolute',
		zIndex: '-1',
		borderRadius: '50rem',
		transition: '2s'
	};

	const startRotation = 0;
	const endRotation = 180;
	const rotationOffset = 20;
	const defaultTransition = 5;
	const transitionOffset = 0.1;

	const recOneStyle = {
		backgroundColor: '#D1EEEE',
		transform: hovered ? `rotate(${startRotation}deg)` : `rotate(${startRotation + endRotation}deg)`,
		transition: `${defaultTransition}s`
	};

	const recTwoStyle = {
		backgroundColor: '#ADEAEA',
		transform: hovered
			? `rotate(${startRotation + rotationOffset}deg)`
			: `rotate(${startRotation + endRotation + rotationOffset}deg)`,
		transition: `${defaultTransition + transitionOffset}s`
	};

	const recThreeStyle = {
		backgroundColor: '#96CDCD',
		transform: hovered
			? `rotate(${startRotation + rotationOffset * 2}deg)`
			: `rotate(${startRotation + endRotation + rotationOffset * 2}deg)`,
		transition: `${defaultTransition + transitionOffset * 2}s`
	};

	return (
		<button
			className={className}
			style={btnStyle}
			onMouseOver={() => setHoveredState(true)}
			onMouseLeave={() => setHoveredState(false)}
			onClick={() => setTimeout(onClick, 500)}
		>
			<div style={{ ...rectangleStyle, ...recOneStyle }} className="rectangle" id="recOne" />
			<div style={{ ...rectangleStyle, ...recTwoStyle }} className="rectangle" id="recTwo" />
			<div style={{ ...rectangleStyle, ...recThreeStyle }} className="rectangle" id="recThree" />
			<div style={textStyle}>{text}</div>
		</button>
	);
};

export default WaveButton;
