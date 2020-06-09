import React, { useRef } from 'react';
import WaveButton from 'js/components/WaveButton';

export const MapSeedCopyButton = (props) => {
	const clipboard = useRef(null);

	return (
		<div className="mapSeedOptionContainer">
			<WaveButton
				style={{ zIndex: '4' }}
				className="mapSeedBtn"
				key="mapSeedBtn"
				onClick={() => {
					clipboard.current.select();
					document.execCommand('copy');
				}}
				text={'🌱'}
			/>
			<div className="mapSeedExplanation">
				<span>Copy map seed to clipboard</span>
			</div>
			<textarea
				ref={clipboard}
				readOnly
				unselectable="on"
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					opacity: 0,
					width: 0,
					height: 0,
					resize: 'none',
					cursor: 'default'
				}}
				value={props.seed}
			/>
		</div>
	);
};

export default MapSeedCopyButton;
