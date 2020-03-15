import React from 'react';

export const CornerButton = (props) => {
	return (
		<div
			className={`cornerButton ${props.corner}`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
};

export const AxisButton = (props) => {
	return (
		<div
			className={`axisButton ${props.edge}`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
};

export const CentreButton = (props) => {
	return (
		<div
			className={`centreButton`}
			onClick={props.clickEvent}
			onMouseOver={props.hoverEvent}
			onMouseLeave={props.hoverEnd}
		/>
	);
};
