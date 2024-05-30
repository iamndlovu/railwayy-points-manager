const router = require('express').Router();
let Point = require('../../models/Point.model');

router.route('/').get(async (req, res) => {
  try {
    const points = await Point.find().sort({ pointName: 1 });
    res.json(points);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/direction').get(async (req, res) => {
  try {
    const points = await Point.find().sort({ pointName: 1 });
    console.log(points[0].safeRoute);
    res.json(await points[0].requestedRoute);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/direction').post(async (req, res) => {
  const { data } = req.body;
  try {
    const points = await Point.find().sort({ pointName: 1 });
    const point = points[0];
    point.requestedRoute = data;

    const result = await point.save();
    res.json(result);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
  return;
});

router.route('/:id').get(async (req, res) => {
  try {
    const Point = await Point.findById(req.params.id);
    Point ? res.json(Point) : res.status(400).json('Error: Point not found');
  } catch (err) {
    res.status(400).json(`Error: ${err}`);
  }
});

router.route('/add').post(async (req, res) => {
  const { pointName, status, routes, safeRoute, lastFault, changeTimes } =
    req.body;

  const newPoint = new Point({
    pointName,
    status,
    routes,
    safeRoute,
    lastFault,
    changeTimes,
  });

  try {
    const savedPoint = await newPoint.save();
    res.json(savedPoint);
  } catch (err) {
    res.status(400).json(`Error ${err}`);
  }
});

router.route('/:id').delete((req, res) => {
  Point.findByIdAndDelete(req.params.id)
    .then(() => res.json('Point deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route('/in-motion').post(async (req, res) => {
  const { data } = req.body;
  console.log('setting motion: ' + data);
  try {
    const points = await Point.find().sort({ pointName: 1 });
    const point = points[0];
    console.log(point);
    if (data) {
      point.status = 1;
      point.prevsafe = point.safeRoute;
      // point.safeRoute = 3;
    } else {
      point.status = 0;
      // point.safeRoute = point.prevsafe;
    }

    const result = await point.save();
    res.json(result);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/deg').post(async (req, res) => {
  let { data } = req.body;
  console.log('deg: ' + data );
  if (data == 180) data = 1;
  else data = 0;
  try {
    const points = await Point.find().sort({ pointName: 1 });
    const point = points[0];
    console.log(point);
    point.safeRoute = data;

    const result = await point.save();
    res.json(result);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add-fault/:id').post(async (req, res) => {
  const { data } = req.body;

  try {
    const point = await Point.findById(req.params.id);
    console.log(point);
    point.lastFault = data;

    const result = await point.save();
    res.json(result);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
