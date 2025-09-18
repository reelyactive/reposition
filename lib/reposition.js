/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const DEFAULT_MEASUREMENT_UNITS = [ 'deg', 'deg', 'm' ];
const LATITUDE_METRES_PER_DEGREE = 111111;
const FEET_PER_METRE = 3.28084;


/**
 * Convert the given position and coordinate system to WGS84.
 * @param {Array} position The position in [ x, y, (z) ] format.
 * @param {Object} coordinateSystem Optional processing options.
 * @param {Object} options Optional processing options.
 * @return {Array} The converted position.
 */
function toWGS84(position, coordinateSystem, options) {
  options = options || {};

  if(!isValidPosition(position) || !isValidCoordinateSystem(coordinateSystem)) {
    return null;
  }

  let convertedPosition = [];

  // Custom origin coordinate system
  if(coordinateSystem.type === 'customOrigin') {
    let measurementUnits =
                  determineMeasurementUnits(coordinateSystem.measurementUnits);
    let originLatitude = coordinateSystem.originOffset[1];
    let isRotated = Number.isFinite(coordinateSystem.horizontalPlaneRotation) &&
                    (coordinateSystem.horizontalPlaneRotation !== 0);
    let offsets = [];

    // Calculate lon/lat offset degrees based on horizontal plane rotation
    if(isRotated) {
      let xMetres = toMetresOffset(position[0], measurementUnits[0]);
      let yMetres = toMetresOffset(position[1], measurementUnits[1]);
      let rads = coordinateSystem.horizontalPlaneRotation * Math.PI / 180;

      let lonMetres = (xMetres * Math.cos(rads)) + (yMetres * Math.sin(rads));
      let latMetres = (yMetres * Math.cos(rads)) - (xMetres * Math.sin(rads));

      offsets.push(toDegreesOffset(lonMetres, 'm', true, originLatitude));
      offsets.push(toDegreesOffset(latMetres, 'm', false));
    }

    // Calculate lon/lat offset degrees based on North-aligned horizontal plane
    else {
      offsets.push(toDegreesOffset(position[0], measurementUnits[0], true,
                                   originLatitude));
      offsets.push(toDegreesOffset(position[1], measurementUnits[1], false));
    }

    // Calculate altitude offset metres, if applicable
    if(position.length === 3) {
      offsets.push(toMetresOffset(position[2], measurementUnits[2]));
    }

    // Apply offsets in each axis
    offsets.forEach((offset, index) => {
      let origin = (index < coordinateSystem.originOffset.length) ?
                                      coordinateSystem.originOffset[index] : 0;
      convertedPosition.push(origin + offset);
    });
    
  }

  return convertedPosition;
}


/**
 * Validate whether the given position is an array of 2 or 3 numbers.
 * @param {Array} position The position in [ x, y, (z) ] format.
 * @return {Boolean} Whether the position is valid or not.
 */
function isValidPosition(position) {
  return Array.isArray(position) &&
         (position.length >= 2) && (position.length <= 3) &&
         position.every(element => typeof element === 'number');
}


/**
 * Validate whether the given coordinate system meets the minimum criteria.
 * @param {Object} coordinateSystem The coordinate system.
 * @return {Boolean} Whether the coordinate system is valid or not.
 */
function isValidCoordinateSystem(coordinateSystem) {
  switch(coordinateSystem?.type) {
    case 'customOrigin':
      if(!isValidPosition(coordinateSystem.originOffset)) {
        return false;
      }
      return true;
    default:
      return false;
  }
}


/**
 * Determine the measurement units for the coordinate system.
 * @param {Array} measurementUnits The optional measurement unit source.
 * @return {Array} The measurement units in each axis.
 */
function determineMeasurementUnits(measurementUnits) {
  if(!Array.isArray(measurementUnits)) {
    return DEFAULT_MEASUREMENT_UNITS;
  }

  let updatedMeasurementUnits = [];

  for(let dimension = 1; dimension <= 3; dimension++) {
    if(measurementUnits.length < dimension) {
      updatedMeasurementUnits.push(DEFAULT_MEASUREMENT_UNITS[dimension - 1]);
    }
    else {
      updatedMeasurementUnits.push(measurementUnits[dimension - 1]);
    }
  }

  return updatedMeasurementUnits;
}


/**
 * Convert the given offset to degrees.
 * @param {Number} offset The offset.
 * @param {String} measurementUnit The measurement unit of the offset.
 * @param {Boolean} isLongitude Whether the offset pertains to longitude.
 * @param {Number} originLatitude The latitude of the origin in degrees.
 * @return {Number} The offset in degrees.
 */
function toDegreesOffset(offset, measurementUnit, isLongitude, originLatitude) {
  let metresPerDegree = LATITUDE_METRES_PER_DEGREE;

  if(isLongitude) {
    metresPerDegree *= Math.cos((originLatitude || 0) * Math.PI / 180);
  }

  switch(measurementUnit) {
    case 'm':
      return offset / metresPerDegree;
    case 'ft':
      return offset / FEET_PER_METRE / metresPerDegree;
    default: // Assume degrees
      return offset;
  }
}


/**
 * Convert the given offset to metres.
 * @param {Number} offset The offset.
 * @param {String} measurementUnit The measurement unit of the offset.
 * @return {Array} The offset in metres.
 */
function toMetresOffset(offset, measurementUnit) {
  switch(measurementUnit) {
    case 'ft':
      return offset / FEET_PER_METRE;
    default: // Assume metres
      return offset;
  }
}


module.exports.toWGS84 = toWGS84;