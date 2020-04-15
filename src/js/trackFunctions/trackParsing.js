import { compareArrays } from 'js/utility/utilityFunctions';

export const getAllDefaultTiles = (trainTrackMap) => {
	let defaultTileArr = [];
	trainTrackMap.tracks.forEach(function(el) {
		if (el.defaultTrack) defaultTileArr.push(el);
	});
	return defaultTileArr;
};

export const getRailTypeOfPlacedTile = (coordinate, placedTracks) => {
	let railType = null;
	placedTracks.forEach(function(el) {
		if (el.tile[0] === coordinate[0] && el.tile[1] === coordinate[1]) railType = el.railType;
	});
	return railType;
};

export const checkIfPlacedTilesAllCorrect = (trainTrackMap, placedTracks) => {
	const correctTileCount = getCorrectTileCount(trainTrackMap, placedTracks);
	const defaultTileCount = getAllDefaultTiles(trainTrackMap).length;
	const placedRailTrackCount = getPlacedRailTrackCount(placedTracks);
	if (
		correctTileCount === trainTrackMap.tracks.length &&
		trainTrackMap.tracks.length === placedRailTrackCount + defaultTileCount
	) {
		return true;
	} else {
		return false;
	}
};

const getPlacedRailTrackCount = (placedTracks) => {
	const placedTiles = placedTracks;
	const placedRailTrackCount = placedTiles.filter((el) => el.railType !== 'X').length;
	return placedRailTrackCount;
};

const getCorrectTileCount = (trainTrackMap, placedTracks) => {
	return trainTrackMap.tracks.filter(function(winning) {
		let correctTile = winning.defaultTrack;
		placedTracks.forEach(function(placed) {
			if (compareArrays(winning.tile, placed.tile) && winning.railType === placed.railType) correctTile = true;
		});
		return correctTile;
	}).length;
};
