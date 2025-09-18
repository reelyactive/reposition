/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const reposition = require('../../lib/reposition.js');
const assert = require ('assert');


// Input data for the scenario
const INPUT_DATA_INVALID_POSITION = { lat: 123, lon: 456 };
const INPUT_DATA_INVALID_SYSTEM = {};
const INPUT_DATA_CUSTOM_ORIGIN_POSITION_DEG = [ -0.00877, 0.01117, 10 ];
const INPUT_DATA_CUSTOM_ORIGIN_POSITION_FT =
                                   [ -2240.450648739, 4071.88290589, 32.8084 ];
const INPUT_DATA_CUSTOM_ORIGIN_POSITION_ROTATED =
                                       [ -1211.9544478485, 733.388008366, 10 ];
const INPUT_DATA_CUSTOM_ORIGIN_SYSTEM = {
    type: "customOrigin",
    originOffset: [ -73.57123, 45.50883, 0 ]
};
const INPUT_DATA_CUSTOM_ORIGIN_SYSTEM_FT = {
    type: "customOrigin",
    originOffset: [ -73.57123, 45.50883, 0 ],
    measurementUnits: [ 'ft', 'ft', 'ft' ]
};
const INPUT_DATA_CUSTOM_ORIGIN_SYSTEM_ROTATED = {
    type: "customOrigin",
    originOffset: [ -73.57123, 45.50883, 0 ],
    measurementUnits: [ 'm', 'm' ],
    horizontalPlaneRotation: 30
};


// Expected outputs for the scenario
const EXPECTED_DATA_INVALID_INPUT = null;
const EXPECTED_DATA_CUSTOM_ORIGIN = [ -73.58, 45.52, 10 ];


// Describe the scenario
describe('reposition', () => {

  // Test the toWGS84 function with no input data
  it('should handle no input data', () => {
    assert.deepEqual(reposition.toWGS84(), EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the toWGS84 function with an invalid position
  it('should handle an invalid position', () => {
    assert.deepEqual(reposition.toWGS84(INPUT_DATA_INVALID_POSITION,
                                        INPUT_DATA_CUSTOM_ORIGIN_SYSTEM),
                     EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the toWGS84 function with an invalid coordinate system
  it('should handle an invalid coordinate system', () => {
    assert.deepEqual(reposition.toWGS84(INPUT_DATA_CUSTOM_ORIGIN_POSITION_DEG,
                                        INPUT_DATA_INVALID_SYSTEM),
                     EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the toWGS84 function with a custom origin
  it('should handle a customOrigin coordinate system', () => {
    assert.deepEqual(reposition.toWGS84(INPUT_DATA_CUSTOM_ORIGIN_POSITION_DEG,
                                        INPUT_DATA_CUSTOM_ORIGIN_SYSTEM),
                     EXPECTED_DATA_CUSTOM_ORIGIN);
  });

  // Test the toWGS84 function with a custom origin using feet
  it('should handle a customOrigin coordinate system using feet', () => {
    assert.deepEqual(reposition.toWGS84(INPUT_DATA_CUSTOM_ORIGIN_POSITION_FT,
                                        INPUT_DATA_CUSTOM_ORIGIN_SYSTEM_FT),
                     EXPECTED_DATA_CUSTOM_ORIGIN);
  });

  // Test the toWGS84 function with a custom origin with rotation
  it('should handle a customOrigin coordinate system with rotation', () => {
    assert.deepEqual(reposition.toWGS84(
                                     INPUT_DATA_CUSTOM_ORIGIN_POSITION_ROTATED,
                                     INPUT_DATA_CUSTOM_ORIGIN_SYSTEM_ROTATED),
                     EXPECTED_DATA_CUSTOM_ORIGIN);
  });

});
