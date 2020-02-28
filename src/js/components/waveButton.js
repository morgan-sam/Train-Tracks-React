import React, { useEffect, useState } from 'react';
import { print } from '../utility/utilityFunctions';

const WaveButton = ({ className, onClick }) => {
	const [ hovered, setHoveredState ] = useState(false);
	return (
		<button
			className={className}
			style={{
				backgroundColor: hovered ? 'red' : 'white',
				transition: '1s'
			}}
			onMouseOver={() => setHoveredState(true)}
			onMouseLeave={() => setHoveredState(false)}
			onClick={() => setTimeout(onClick, 500)}
		/>
	);
};

export default WaveButton;
