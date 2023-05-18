import { GeoPoint } from "../types";

export function movePointTowards(pointA: GeoPoint, pointB: GeoPoint, distanceInMeters: number): GeoPoint {
	const earthRadius = 6378137;  // Earth's radius in meters

	// Convert latitude and longtitude to radians
	const latA = pointA.latitude * Math.PI / 180;
	const lonA = pointA.longtitude * Math.PI / 180;
	const latB = pointB.latitude * Math.PI / 180;
	const lonB = pointB.longtitude * Math.PI / 180;

	// Calculate the bearing from pointA to pointB
	const bearing = Math.atan2(Math.sin(lonB - lonA) * Math.cos(latB),
		Math.cos(latA) * Math.sin(latB) - Math.sin(latA) * Math.cos(latB)
      * Math.cos(lonB - lonA));

	// Calculate the new latitude and longitude
	const newLat = Math.asin(Math.sin(latA) * Math.cos(distanceInMeters / earthRadius)
      + Math.cos(latA) * Math.sin(distanceInMeters / earthRadius) * Math.cos(bearing));

	const newLon = lonA + Math.atan2(Math.sin(bearing) * Math.sin(distanceInMeters / earthRadius) * Math.cos(latA),
		Math.cos(distanceInMeters / earthRadius) - Math.sin(latA) * Math.sin(newLat));

	// Convert back to degrees
	const newLatitude = newLat * 180 / Math.PI;
	const newLongtitude = newLon * 180 / Math.PI;

	// Create a new geopoint object with the updated coordinates
	const newPoint = { latitude: newLatitude, longtitude: newLongtitude };

	return newPoint;
}

export function RandomLocation(from: number, to: number, fixed: number): number {
	return parseFloat((Math.random() * (to - from) + from).toFixed(fixed));
}
