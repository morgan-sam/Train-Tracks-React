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
