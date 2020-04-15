import React from 'react';
import { colorToWhiteArray } from 'js/utility/colorFunctions';

export const MapBackground = (props) => {
	const colorSelected = props.themeColor.available[props.themeColor.selected];
	const numberOfShapes = 20;
	const colorArray = colorToWhiteArray(colorSelected, numberOfShapes + 1);
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
