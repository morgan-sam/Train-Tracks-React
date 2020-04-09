export const getAllDefaultTiles = (trainTrackMap) => {
	let defaultTileArr = [];
	trainTrackMap.tracks.forEach(function(el) {
		if (el.defaultTrack) defaultTileArr.push(el);
	});
	return defaultTileArr;
};
