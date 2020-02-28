import React, { useEffect, useState } from 'react';
import { colorToWhiteArray } from '../utility/colorToWhite';
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

	let rectangleArray = createRectangleArray('#009999', 10);

	function createRectangleArray(color, recCount) {
		let rectangleArray = [];
		const recColors = colorToWhiteArray(color, recCount);
		for (let i = 0; i < recCount; i++) {
			const curRecStyle = {
				backgroundColor: recColors[i],
				transform: hovered
					? `rotate(${startRotation + rotationOffset * i}deg)`
					: `rotate(${startRotation + endRotation + rotationOffset * i}deg)`,
				transition: `${defaultTransition + transitionOffset * i}s`
			};
			rectangleArray.push(
				<div key={i} style={{ ...rectangleStyle, ...curRecStyle }} className="rectangle" id={`rec${i}`} />
			);
		}
		return rectangleArray;
	}

	return (
		<button
			className={className}
			style={btnStyle}
			onMouseOver={() => setHoveredState(true)}
			onMouseLeave={() => setHoveredState(false)}
			onClick={() => setTimeout(onClick, 500)}
		>
			{rectangleArray}
			<div style={textStyle}>{text}</div>
		</button>
	);
};

export default WaveButton;
