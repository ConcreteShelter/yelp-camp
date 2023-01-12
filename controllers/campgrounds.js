const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const campground = require('../models/campground');
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// module.exports.index = async (req, res) => {
//     const campgrounds = await Campground.find({}).sort({ _id: -1 });
//     res.render('campgrounds/index', { campgrounds });
// }

module.exports.index = async (req, res) => {
    const perPage = 10
    const page = req.params.page || 1
    const totalCampgrounds = await Campground.find({})
    const campgrounds = await Campground
        .find({})
        .sort({ _id: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, campgrounds) {
            Campground.count().exec(function (err, count) {
                if (err) return next(err)
                res.render('campgrounds/index', {
                    totalCampgrounds,
                    campgrounds,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })

}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground
        .findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    };
    await campground.save();
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect(`/campgrounds/list/1`)
}