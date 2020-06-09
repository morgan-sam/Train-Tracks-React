import {
	findIndexOfArrayInMatrix,
	randomArrayEntry,
	isNonEmptyArray,
	compareArrays
} from 'js/utility/utilityFunctions';

export const addHintTrack = (mapTracks, placedTracks) => {
	const randomTrack = getRandomNonPlacedTrack(mapTracks, placedTracks);
	return replaceOldTrackInArray(randomTrack, placedTracks);
};

const getRandomNonPlacedTrack = (mapTracks, placedTracks) => {
	const placedTracksArray = placedTracks.map((el) => el.tile);
	const placedRailTypesArray = placedTracks.map((el) => el.railType);
	const unplacedTracks = [ ...mapTracks ].filter((el) => {
		if (el.defaultTrack) return false;
		const index = findIndexOfArrayInMatrix(el.tile, placedTracksArray);
		if (index === -1) return true;
		return placedRailTypesArray[index] !== el.railType;
	});
	if (isNonEmptyArray(unplacedTracks)) return randomArrayEntry(unplacedTracks);
	else return null;
};

const replaceOldTrackInArray = (newTrack, tracks) => {
	if (!newTrack) return tracks;
	const filteredTracks = tracks.filter((el) => !compareArrays(newTrack.tile, el.tile));
	return [ ...filteredTracks, newTrack ];
};
