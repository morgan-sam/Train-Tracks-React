import { convertRailTypeToTrackImage } from 'js/trackFunctions/railTypeProcessing';

export const setHoverTrackImage = (hoverTrack, unknownRailImage) => {
	let squareStyling;
	const trackImage = convertRailTypeToTrackImage(hoverTrack);
	if (trackImage.trackType !== '?') {
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

export const setPlacedTrackImage = (trackData, railImages) => {
	let squareStyling;
	if (trackData.trackType !== '?' && trackData.trackType !== 'X') {
		squareStyling = {
			backgroundImage: `url(${trackData.trackType})`,
			transform: `rotate(${trackData.trackRotation}deg)`,
			opacity: 1
		};
	} else if (trackData.trackType === '?') {
		squareStyling = {
			backgroundImage: `url(${railImages.unknown})`,
			opacity: 1
		};
	} else {
		squareStyling = {
			backgroundImage: `url(${railImages.cross})`,
			opacity: 1
		};
	}
	return squareStyling;
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
