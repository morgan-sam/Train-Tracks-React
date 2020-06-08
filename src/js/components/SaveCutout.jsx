import React from 'react';

export const SaveCutout = (props) => (
	<img
		alt=""
		draggable="false"
		src={props.saveBoxCutOut}
		className="saveBoxMapCutout"
		style={{
			position: 'absolute',
			top: `${props.tileRemSize}rem`,
			left: '0px',
			border: props.saveBoxCutOut ? '1px solid black' : 'none'
		}}
	/>
);

export default SaveCutout;
