const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("Database Connected")
    })
    .catch((err) => {
        console.log("Connection Error")
        console.log(err)
    });

const db = mongoose.connection;

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63a6fa6af4b8b85b35080c44',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat recusandae ducimus sit illum obcaecati repudiandae vitae autem accusamus aut veritatis aperiam error, id mollitia quam ipsum magni exercitationem reprehenderit quibusdam.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/djquvfebv/image/upload/v1671452551/YelpCamp/yazbnazsrnweh39byoob.jpg',
                    filename: 'YelpCamp/yazbnazsrnweh39byoob',
                },
                {
                    url: 'https://res.cloudinary.com/djquvfebv/image/upload/v1671452552/YelpCamp/qxamvgk0p1c4txtkeamb.jpg',
                    filename: 'YelpCamp/qxamvgk0p1c4txtkeamb',
                }
            ]
        })
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})