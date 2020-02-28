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

	return (
		<button
			className={className}
			style={btnStyle}
			onMouseOver={() => setHoveredState(true)}
			onMouseLeave={() => setHoveredState(false)}
			onClick={() => setTimeout(onClick, 500)}
		>
			<div style={textStyle}>{text}</div>
			<div className="wave" style={waveStyle} />
		</button>
	);
};

export default WaveButton;
