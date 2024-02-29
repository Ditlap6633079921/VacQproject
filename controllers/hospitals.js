const Hospital = require('../models/Hospital');
const vacCenter = require('../models/VacCenter');

// @desc    get vaccine centers
// @route   GET /api/v1/hospitals/vacCenters/
// @access  Public
exports.getVacCenters = (req, res, next) => {
    vacCenter.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Vaccine Centers."
            })
        } else {
            res.send(data)
        }
    });
};

// @desc    get all hospitals
// @route   GET /api/v1/hospitals/
// @access  Public
exports.getHospitals = async (req, res, next) => {
    // init field to exclude
    const removeFields = ["sort", "select","page","limit"]

    // define query and request query
    let query;
    let reqQuery = {...req.query}

    // remove sort , select from reqQuery
    removeFields.forEach(e => delete reqQuery[e])

    // define query string : before process the query operation, we need to change it to string first.
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`)
    query = Hospital.find(JSON.parse(queryStr)).populate("appointments")

    // when we process about matching operation already, then we're going to process specific param

    // Select
    if (req.query.select) {
        const field = req.query.select.split(',').join(' ')
        query = query.select(field)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('name');
    }

    // Page
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page-1) * limit
    const endIndex = page * limit
    const total = await Hospital.countDocuments()

    query = query.skip(startIndex).limit(limit)     // skip to startIndex


    try {
        const hospitals = await query;

        // pagination result
        const pagination = {}

        if (endIndex < total) {
            pagination.next = {
                page: page+1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page-1,
                limit
            }
        }

        res.status(200).send({
            success: true,
            count: hospitals.length,
            pagination,
            data: hospitals
        });
    } catch (e) {
        res.status(400).send({
            success: false
        });
    }
};

// @desc    get single hospital by id
// @route   GET /api/v1/hospitals/:id
// @access  Public
exports.getHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(400).send({
                success: false
            });
        }
        res.status(200).send({
            success: true,
            data: hospital
        });
    } catch (e) {
        res.status(400).send({
            success: false
        });
    }
};

// @desc    create a new hospital
// @route   POST /api/v1/hospitals/
// @access  Private
exports.createHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).send({
            success: true,
            data: hospital
        });
    } catch (e) {
        res.status(400).send({
            success: false
        });
    }
};

// @desc    update an existing hospital by id
// @route   PUT /api/v1/hospitals/:id
// @access  Private
exports.updateHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!hospital) {
            return res.status(400).send({
                success: false
            });
        }

        res.status(200).send({
            success: true,
            data: hospital
        });
    } catch (e) {
        res.status(400).send({
            success: false
        });
    }
};

// @desc    delete an existing hospital by id
// @route   DELETE /api/v1/hospitals/:id
// @access  Private
exports.deleteHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(400).send({
                success: false
            });
        }

        await hospital.deleteOne();

        res.status(200).send({
            success: true,
            data: {}
        });
    } catch (e) {
        console.log(e.message)
        res.status(400).send({
            success: false
        });
    }
};