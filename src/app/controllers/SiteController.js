const Course = require('../models/Course');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class SiteController {

    // [GET] /
    index(req, res, next) {
        Course.find({})
            .then(courses => {
                res.render('home', {
                    title: 'Home page',
                    courses: multipleMongooseToObject(courses),
                });
            })
            .catch(e => {
                next(e);
            })
    }

    // [GET] /search
    search(req, res) {
        res.render('search');
    }
}

module.exports = new SiteController;