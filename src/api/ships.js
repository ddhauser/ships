const express = require('express');

const router = express.Router();

const vesselInfo = require('../../data/vesselInfo.json');
const vesselLocations = require('../../data/vesselLocations.json');

/**
 * Get ships locations
 */
router.get('/points', (req, res) => {
  // Return as geoJson
  res.json({
    type: 'FeatureCollection',
    features: vesselLocations.map(location => ({
      type: 'Feature',
      id: location._id,
      geometry: location.lastpos.geometry,
      properties: {
        course: location.lastpos.course,
      },
    })),
  });
});

/**
 * Get biggest ship
 */
router.get('/biggest', (req, res) => {
  const EMPTY = {
    size: Number.NEGATIVE_INFINITY,
  };

  // Get vessel with the biggest 'size' property, where size is a number
  const vesselsWithSize = vesselInfo.filter(v => !isNaN(v.size));
  const biggest = vesselsWithSize.reduce((v1, v2) => (v1.size > v2.size ? v1 : v2), EMPTY);

  // If no vessel found, _id is undefined
  if (biggest._id) {
    res.json(biggest);
  } else {
    console.warn('no ship found');
    res.sendStatus(404);
  }
});

/**
 * Get ship data
 */
router.get('/:id/data', (req, res) => {
  const { id } = req.params;

  const vessel = vesselInfo.filter(v => v._id === id)[0];
  if (vessel) {
    res.json(vessel);
  } else {
    console.warn(`ship with id=${id} not found`);
    res.sendStatus(404);
  }
});

/**
 * Edit ship data
 */
router.post('/:id/data', (req, res) => {
  const { id } = req.params;

  const vessel = vesselInfo.filter(v => v._id === id)[0];
  if (vessel) {
    console.log(`ship with id=${id} updated to`, req.body);

    // Save changes
    Object.assign(vessel, req.body);

    res.sendStatus(200);
  } else {
    console.warn(`ship with id=${id} not found`);
    res.sendStatus(404);
  }
});

module.exports = router;
