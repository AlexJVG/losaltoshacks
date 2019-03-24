const router = require('express').Router();
const responses = require('./responses');
const firebase = require('firebase');

firebase.initializeApp(require('./firebase.json'));

router.post('/create-account', (req, res) => {
    let { username, password } = req.body;
    firebase.database().ref('/users/' + username).set({
        password,
        weights: {}
    });

    res.send(responses.success());
});

router.post('/account-info', async (req, res) => {
    let { username } = req.body;
    let data = (await firebase.database().ref('/users/' + username).once('value')).val()

    res.send(responses.success(data));
});

router.post('/get-recommendations', async (req, res) => {
    let { username } = req.body;
    let userWeights = (firebase.database().ref('/users/' + username + '/weights').once('value')).val();
    let movies = firebase.database().ref('/movies');
    let recommendations = [];

    for (let movie in movies) {
        let distance = distance(movies[movie].weights, userWeights);
        recommendations.push({
            movieId: movie,
            distance
        });
    }

    recommendations.sort((a, b) => {
        return b.distance - a.distance;
    });

    res.send(responses.success(recommendations));
});

router.post('/personal-rating', async (req, res) => {
    let { username, movieId } = req.body;

    let user = (await firebase.database().ref('/users/' + username).once('value')).val();
    let movie = (await firebase.database().ref('/movies/' + movieId).once('value')).val();

    if (!movie) {
        return res.send(responses.success('idk'));
    }
    
    let distanceFromMovie = distance(movie.weights, user.weights || {});
    let genresComparing = commonKeys(movie.weights, user.weights || {});
    let maxDistance = genresComparing ** .5;
    let percentRecommend = 100 * (1 - (distanceFromMovie / maxDistance));

    res.send(responses.success(percentRecommend));
});

function commonKeys(a, b) {
    let val = 0;

    for (let key in a) {
        if (!b[key])
            continue;

        val++;
    }

    return val;
}

router.post('/rate-movie', async (req, res) => {
    let { movieId, genres, databaseRating, userRating, username } = req.body;

    userRating = userRating / 10;
    
    let user = (await firebase.database().ref('/users/' + username).once('value')).val();
    let movie = (await firebase.database().ref('/movies/' + movieId).once('value')).val();

    if (!user.voted) {
        user.voted = [];
    } else {
        if (user.voted.includes(movieId)) {
            return res.send(responses.error('already_voted'));
        }
    }
    
    if (!movie) {
        let weights = {};
        databaseRating = databaseRating / 10;

        for (let i = 0; i < genres.length; i++) {
            weights[genres[i]] = (new Array(50)).fill(databaseRating);
        }

        movie = {
            weights
        }
    }

    let newMovie = clone(movie);

    // adjust the movies weights
    {
        let weights = newMovie.weights;
        let userGenres = Object.keys(user.weights || {});

        let distanceFromMovie = distance(weights, user.weights || {});
        distanceFromMovie = 1; // temp

        for (let i = 0; i < userGenres.length; i++) {
            let genre = userGenres[i]; // number
            let currentValForGenre = average(weights[genre] || []); // gets the average value for that movie
            let delta = userRating - currentValForGenre;
            console.log(distanceFromMovie);
            let value = (delta / distanceFromMovie)/*  * average(user.weights[genre]) */;
            value += currentValForGenre;

            // value = sigmoid(value);

            if (!weights[genre]) {
                weights[genre] = [];
            }

            weights[genre].push(value);
        }
    }

    let newUser = clone(user);
    
    {
        // adjust the user's weights
        let movieGenres = Object.keys(movie.weights); // bunch of numbers for active genres of the movie

        if (!newUser.weights) {
            newUser.weights = {};
        }

        for (let i = 0; i < movieGenres.length; i++) {
            let genre = movieGenres[i];

            if (!newUser.weights[genre]) {
                newUser.weights[genre] = [];
            }

            newUser.weights[genre].push((average(movie.weights[genre]) + userRating) / 2);
        }

        newUser.voted.push(movieId);
    }

    await firebase.database().ref('/users/' + username).set(newUser);
    await firebase.database().ref('/movies/' + movieId).set(newMovie);

    res.send(responses.success());

});

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function average(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i];
    }

    return (total / arr.length) || 0;
}

function sigmoid(x) {
    return 1 / (1 + (Math.E ** -x));
}

function distance(a, b) {
    let total = 0;

    for (let key in a) {
        if (!b[key])
            continue;
        
        total += (average(a[key]) - average(b[key])) ** 2;
    }

    return total ** .5;
}

module.exports = router;
