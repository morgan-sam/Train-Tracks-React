import React, { useEffect, useState } from 'react';
import { colorToWhiteArray } from '../utility/colorToWhite';
import { print } from '../utility/utilityFunctions';

const WaveButton = ({ className, onClick, text }) => {
	const [ hovered, setHoveredState ] = useState(false);

	const btnStyle = {
		position: 'relative',
		overflow: 'hidden',
		cursor: 'pointer',
		background: 'none',
		zIndex: '0',
		borderRadius: '1rem',
		border: '1px #ccc solid'
	};

	const textStyle = { zIndex: '1', color: hovered ? 'white' : 'black', transition: hovered ? '1s' : '3s' };

	const rectangleStyle = {
		top: '10rem',
		left: '-14rem',
		height: '1000%',
		width: '500%',
		position: 'absolute',
		zIndex: '-1',
		borderRadius: '50rem'
	};

	const startRotation = -30;
	const endRotation = 130;
	const rotationOffset = 4;
	const defaultTransition = 2;
	const transitionOffset = 0.1;

	let rectangleArray = createRectangleArray('#009999', 20);

	function createRectangleArray(color, recCount) {
		let rectangleArray = [];
		const recColors = colorToWhiteArray(color, recCount * 1.2);
		for (let i = 0; i < recCount; i++) {
			const curRecStyle = {
				background: `linear-gradient(1turn,${recColors[recColors.length - i - 1]},${recColors[
					recColors.length - i - 2
				]})`,
				transform: hovered
					? `rotate(${startRotation + rotationOffset * i}deg)`
					: `rotate(${startRotation + endRotation + rotationOffset * i}deg)`,
				transition: hovered ? `${defaultTransition + transitionOffset * i}s` : `1.5s`
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
