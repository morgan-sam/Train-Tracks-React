import React from 'react';

import { colorToWhiteArray } from '../utility/colorFunctions';

export const MapBackground = (props) => {
	const numberOfShapes = 20;
	const colorArray = colorToWhiteArray('#b19cd9', numberOfShapes + 1);
	let backgroundShapes = [];
	for (let i = 0; i < numberOfShapes; i++) {
		const backgroundShapeStyle = {
			backgroundColor: colorArray[i],
			animation: `spin ${15 + 0.25 * (i + 1)}s infinite linear`,
			height: `${100 - 4 * i}%`,
			width: `${100 - 4 * i}%`
		};
		backgroundShapes.push(<div key={i} className="mapBackgroundShape" style={backgroundShapeStyle} />);
	}
	return <div className="mapBackgroundContainer">{backgroundShapes}</div>;
};

export default MapBackground;
