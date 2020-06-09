import React from 'react';
import WaveButton from 'js/components/WaveButton';

export const MapSeedCopyButton = (props) => {
	return (
		<div className="mapSeedOptionContainer">
			<WaveButton
				style={{ zIndex: '4' }}
				className="mapSeedBtn"
				key="mapSeedBtn"
				onClick={() => {
					navigator.clipboard.writeText(props.seed);
				}}
				text={'🌱'}
			/>
			<div className="mapSeedExplanation">
				<span>Copy map seed to clipboard</span>
			</div>
		</div>
	);
};

export default MapSeedCopyButton;
