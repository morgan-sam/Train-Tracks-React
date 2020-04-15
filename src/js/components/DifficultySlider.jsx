import React, { useState } from 'react';

export const DifficultySlider = (props) => {
	const [ hover, setHover ] = useState(false);
	const SLIDER_REM_WIDTH = 5;

	const containerStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	};

	const labelDefaultStyle = {
		position: 'absolute',
		height: '1.5rem',
		width: '1.5rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '1px solid #444',
		backgroundColor: 'white',
		borderRadius: '100%',
		zIndex: '-1',
		opacity: '0',
		transition: '0.5s',
		transform: `translate(${(props.gameState.difficulty - 3) * 67.5}%, 100%)`
	};

	const labelHoverStyle = {
		transform: `translate(${(props.gameState.difficulty - 3) * 67.5}%, 120%)`,
		opacity: '1',
		transition: '1s'
	};

	const labelStyle = hover ? { ...labelDefaultStyle, ...labelHoverStyle } : labelDefaultStyle;

	return (
		<div style={containerStyle}>
			<input
				className="difficultySlider"
				onChange={(e) =>
					props.setGameState({
						...props.gameState,
						difficulty: parseInt(e.target.value)
					})}
				type="range"
				min="1"
				max="5"
				value={props.gameState.difficulty}
				style={{ width: `${SLIDER_REM_WIDTH}rem` }}
				onMouseOver={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			/>
			<div className="difficultyLabel" style={labelStyle}>
				{props.gameState.difficulty}
			</div>
		</div>
	);
};

export default DifficultySlider;
