import React from 'react';

const CornerButton = (props) => {
	return <div className={`cornerButton ${props.corner}`} />;
};

const AxisButton = (props) => {
	return <div className={`axisButton ${props.edge}`} />;
};

const CentreButton = () => {
	return <div className={`centreButton`} />;
};

export const TileButtons = (props) => {
	const corners = [ 'top-left', 'top-right', 'bottom-left', 'bottom-right' ];
	const edges = [ 'top', 'right', 'bottom', 'left' ];
	return [
		corners.map((el) => <CornerButton corner={el} key={el} />),
		edges.map((el) => <AxisButton edge={el} key={el} />),
		<CentreButton key={props.x} />
	];
};
