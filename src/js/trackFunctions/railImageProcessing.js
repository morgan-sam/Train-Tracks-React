import { convertRailTypeToTrackImage } from 'js/trackFunctions/railTypeProcessing';

export const setHoverTrackImage = (hoverTrack, unknownRailImage) => {
	let squareStyling;
	const trackImage = convertRailTypeToTrackImage(hoverTrack);
	if (trackImage.trackType !== 'T') {
		squareStyling = {
			backgroundImage: `url(${trackImage.trackType})`,
			transform: `rotate(${trackImage.trackRotation}deg)`,
			opacity: 0.5
		};
	} else {
		squareStyling = {
			backgroundImage: `url(${unknownRailImage})`,
			opacity: 1
		};
	}
	return squareStyling;
};

export const setPlacedTrackImage = (trackData, unknownRailImage) => {
	let squareStyling, trackText;
	if (trackData.trackType !== 'T' && trackData.trackType !== 'X') {
		squareStyling = {
			backgroundImage: `url(${trackData.trackType})`,
			transform: `rotate(${trackData.trackRotation}deg)`,
			opacity: 1
		};
	} else if (trackData.trackType === 'T') {
		squareStyling = {
			backgroundImage: `url(${unknownRailImage})`,
			opacity: 1
		};
	} else {
		trackText = trackData.trackType;
		squareStyling = {
			opacity: 1
		};
	}
	return [ squareStyling, trackText ];
};

export const setDefaultTrackImage = (trackData, highlighted) => {
	let squareStyling;
	squareStyling = {
		backgroundImage: `url(${trackData.trackType})`,
		transform: `rotate(${trackData.trackRotation}deg)`,
		opacity: 1,
		filter: highlighted ? 'hue-rotate(200deg) saturate(10)' : 'none',
		transition: 'filter 1s ease-in-out'
	};
	return squareStyling;
};
