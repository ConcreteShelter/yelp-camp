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
            author: '6398a2d64231d9370c5d9157',
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
                    url: 'https://res.cloudinary.com/djquvfebv/image/upload/v1671452551/YelpCamp/jcp9j6puiraifyywr7cu.jpg',
                    filename: 'YelpCamp/jcp9j6puiraifyywr7cu',
                },
                {
                    url: 'https://res.cloudinary.com/djquvfebv/image/upload/v1671452552/YelpCamp/tn4oeb9luhlphwqrzv1e.jpg',
                    filename: 'YelpCamp/tn4oeb9luhlphwqrzv1e',
                }
            ]
        })
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})