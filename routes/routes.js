const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/data', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error'));
mdb.once('open', callback => {

});

let userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    wins: Number,
    losses: Number,
    total_points: Number
});

let User = mongoose.model('User_Collection', userSchema);

//// ?? Don't need this we are not printing out every user on the homepage
// exports.index = (req, res) => {
//     User.find((err, user) => {
//         if (err) return console.error(err);
//         res.render('index', {
//             title: 'User_List'
//         });
//     });
// };

exports.index = (req, res) => {
    let today = new Date();
    let date = `${today.getMonth()}-${today.getDate()}-${today.getFullYear()}     ${(today.getHours() + 24) % 12 || 12}:${today.getMinutes()}:${today.getSeconds()}`
    
    let displayDate = '';
    if (req.cookies.lastVisit) {
        displayDate = `Last Visited: ${req.cookies.lastVisit}`;
    } else {
        displayDate = `Welcome!`
    }

    //// TEST - Logging to console to see print all users in database
    User.find((err, user) => {
        if (err) return console.error(err);
        console.log(user);
    });
    // User.collection.remove();

    res.cookie('lastVisit', date, { maxAge: 999999999999 });

    res.render('index', {
        title: 'Home',
        icon_href: '/images/home.png',
        lastVisitedTime: displayDate
    });


}

// LOGIN page
exports.login = (req, res) => {
    res.render('login', {
        title: 'Login',
        icon_href: '/images/login.png',
        css_href: '/login.css'
    });
}

exports.about = (req, res) => {
    res.render('about', {
        title: 'About',
        icon_href: '/images/about.png',
        css_href: '/about.css'
    })
}

exports.contact = (req, res) => {
    res.render('contact', {
        title: 'Contact',
        icon_href: '/images/contact.png',
        css_href: '/contact.css'
    })
}

// Check user info against the database
exports.verifyLogin = (req, res) => {

    // ******* THIS IS WHERE WE SHOULD CHECK AGAINST THE DATABASE TO CHECK IF THE USER EXISTS AND THE PASSWORD MATCHES *******
    // instead of req.body.user === 'user' &&...     it would be some thing like req.body.user exists in the database && the password matches that is in the database
    if (req.body.username == 'user' && req.body.password == 'pass') {
        // once user and pass are verified then we create a session with any key:value pair we want, which we can check for later
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        }
        //Once logged in redirect to this page
        res.redirect('/play');
    } else {
        // if could not verify then do this
        res.redirect('/login');
    }
}

// CREATE page
exports.create = (req, res) => {
    res.render('create', {
        title: 'Create Account',
        icon_href: '/images/create.png',
        css_href: '/create.css',
        script_src: 'create.js'
    })
}

// Creating user in the database
exports.createUser = (req, res) => {
    // Might want to do hashAndSalt(req.body.password) function here or something to return the hashed and salted password before saving to db
    let user = new User({
        firstName: req.body.fname,
        lastName: req.body.lname,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        wins: 0,
        losses: 0,
        total_points: 0
    });
    user.save((err, user) => {
        if (err) return console.error(err);
        console.log(req.body.password + ' added');
    });
    res.redirect('/login');
};

// After user creates account add them to database
exports.verifyCreate = (req, res) => {
    res.send('IMPLEMENT ADDING PERSON TO DATABASE')
}





exports.private = (req, res) => {
    res.send('YOU ARE LOGGED IN!')
}

exports.play = (req, res) => {
    res.render('play', {
        title: 'Play',
        icon_href: '/images/play.png',
        css_href: '/play.css'
    });
}

exports.room = (req, res) => {
    res.render('room', {
        title: 'Room',
        icon_href: '/images/room.png',
        css_href: '/room.css'
    });
}



















exports.lost = (req, res) => {
    res.render('lost', {
        title: 'Lost?',
        css_href: 'lost.css',
        icon_href: '/images/lost.png'
    });
}