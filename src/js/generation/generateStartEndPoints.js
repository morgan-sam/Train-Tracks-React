export const generateStartEndPoints = (parameters) => {
	let edges = getEdgeCoordinatesClockwiseOrder(parameters);
	let startCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1)[0];
	let endCoordinate = edges.splice(Math.floor(Math.random() * edges.length), 1)[0];
	return [ startCoordinate, endCoordinate ];
};

function getEdgeCoordinatesClockwiseOrder(parameters) {
	const { mapWidth, mapHeight } = parameters;
	let coordinates = [];
	for (let x = 0; x < mapWidth - 1; x++) coordinates.push([ x, 0 ]); //top
	for (let y = 0; y < mapHeight - 1; y++) coordinates.push([ mapWidth - 1, y ]); //right
	for (let x = mapWidth - 1; x > 0; x--) coordinates.push([ x, mapHeight - 1 ]); //bottom
	for (let y = mapHeight - 1; y > 0; y--) coordinates.push([ 0, y ]); //left
	return coordinates;
}
