import React from 'react';

export const SaveCutout = (props) => {
	const { display, tileRemSize } = props;
	const saveBoxCutOut = display.saveBoxCutOut;
	return (
		<img
			alt=""
			draggable="false"
			src={saveBoxCutOut}
			className="saveBoxMapCutout"
			style={{
				position: 'absolute',
				top: `${tileRemSize}rem`,
				left: '0px',
				border: saveBoxCutOut ? '1px solid black' : 'none'
			}}
		/>
	);
};

export default SaveCutout;
