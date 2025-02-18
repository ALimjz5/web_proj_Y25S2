const express = require('express');
const router = express.Router();
const db = require("./services/dbservice");
const userService = require("./services/user");
const tokenService = require("./services/token");
const crypto = require('crypto');
const favoriteService = require('./services/favorite');
const cardService = require("./services/card");
const cors = require('cors');
const validator = require('validator');

db.connect()
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error.message);
    });
router.use(express.json());

router.use(express.urlencoded({
    extended: true
}));

router.use(express.json());
router.use(cors());

//AUTHENTICATION==================================================================
function authenticationCheck(req, res, next) {
    const authHeader = req.headers['authorization']; // Get the Authorization header
    if (!authHeader) {
        return res.status(401).json({ "message": "No token provided." });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ "message": "Invalid Authorization header format." });
    }

    if (!token) {
        res.status(401).json({ "message": "No tokens are provided." });
    } else {
        tokenService.checktoken(token)
            .then(function (response) {
                if (response) {
                    res.locals.userId = response._id;
                    next();
                } else {
                    res.status(401).json({ "message": "Invalid token provided." });
                }
            })
            .catch(function (error) {
                res.status(500).json({ "message": error.message });
            });
    }
}

router.put('/api/users', authenticationCheck);
router.get('/api/users/*', authenticationCheck);
router.delete('/api/users', authenticationCheck);

router.get('/api/favorites/*', authenticationCheck);
router.post('/api/favorites', authenticationCheck);
router.put('/api/favorites/*', authenticationCheck);
router.delete('/api/favorites/*', authenticationCheck);

router.get('/api/cards/*', authenticationCheck);
router.post('/api/cards', authenticationCheck);
router.put('/api/cards/*', authenticationCheck);
router.delete('/api/cards/*', authenticationCheck);

router.get('/api/users/logout', function (req, res) {
    let id = res.locals.userId;
    tokenService.removeToken(id)
        .then(function (response) {
            res.status(200).json({ 'message': 'Logout successful' });
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        })
})

router.post('/api/users/login', function (req, res) {
    console.log('Received' + JSON.stringify(req.body, null, 2));
    let data = req.body;

    if (!data || !data.password) {
        return res.status(400).json({ message: "Missing username or password" });
    }
    let encryptedpw = crypto.createHash('sha256').update(data.password).digest('hex');
    userService.getUserLogInfo(data.username, encryptedpw)
        .then(function (response) {
            if (!response) {
                res.status(401).json({ "message": "Login unsuccessful. Please try again later." });
            } else {
                let strToHash = response.username + Date.now();
                let token = crypto.createHash('sha256').update(strToHash).digest('hex');
                tokenService.updateToken(response._id, token)
                    .then(function (response) {
                        res.status(200).json({ 'message': 'Login successful', 'token': token });
                    })
                    .catch(function (error) {
                        res.status(500).json({ "message": error.message });
                    })
            }
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        })
})

//USERS==================================================================
router.post('/api/users', async function (req, res) {
    let data = req.body;
    let pw = crypto.createHash('sha256').update(data.password).digest('hex');
    try {
        if (!validator.isEmail(data.email)) {
            return res.status(500).json({ "message": "Invalid Email" });
        }
        if (!validator.isStrongPassword(data.password, { minLength: 8, minUppercase: 0, minNumbers: 0, minSymbols: 1 })) {
            return res.status(500).json({ "message": "Password must contain at least 8 characters and 1 special character." });
        }
        let response = await userService.addUser(data.name, data.username, pw, data.email)
        return res.status(200).json({ "message": response });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ "message": e.message });
    }

})
router.get('/api/users', function (req, res) {
    userService.getUsers()
        .then(function (response) {
            res.status(200).json(response);
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})
router.get('/api/users/me', function (req, res) {
    let userId = res.locals.userId;
    console.log(userId);
    userService.getUserById(userId)
        .then(function (response) {
            res.status(200).json(response);
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})
router.delete('/api/users', async function (req, res) {
    let id = res.locals.userId;
    await tokenService.removeToken(id);
    console.log("Token removed successfully");
    console.log(id);
    let response = await userService.deleteUser(id);
    if (response) {
        return res.status(200).json({ message: "User deleted successfully." });
    } else {
        return res.status(404).json({ message: "User not found." });
    }
})
router.put('/api/users', function (req, res) {
    let data = req.body;
    let userId = res.locals.userId;
    userService.getUserById(userId).then(function (response) {
        if (!response) {
            res.status(200).json({ "message": "Unable to find user to update." });
        } else {
            console.log(response._id);
            if (!response._id.equals(userId)) {
                res.status(403).json({ "message": "You are not authorized to perform this action." });
            } else {
                userService.updateUserById(userId, { username: data.username, name: data.name, email: data.email })
                    .then(function (response) {
                        res.status(200).json({ "message": response });
                    })
                    .catch(function (error) {
                        res.status(500).json({ "message": error.message });
                    });
            }
        }
    })
})

//FAVORITES==================================================================
router.post('/api/favorites', function (req, res) {
    let data = req.body;
    let userId = res.locals.userId;
    favoriteService.addFavorite(data.code, userId)
        .then(function (response) {
            res.status(200).json({ "message": response });
        }).catch(function (error) {
            res.status(500).json(error.message);
        });
})
// router.get('/api/favorites', function (req, res) {
//     favoriteService.getFavorite()
//         .then(function (response) {
//             res.status(200).json({ "message": response });
//         }).catch(function (error) {
//             res.status(500).json(error.message);
//         });
// })
router.get('/api/favorites', async function (req, res) {
    try {
        let userid = res.locals.userId;
        let favoriteStops = await favoriteService.getFavorites({ "user._id": userid });
        console.log(favoriteStops);
        if (favoriteStops == null || favoriteStops.length == 0) {
            return res.json({ message: "No Favorites" });
        }

        let favoriteCodes = favoriteStops.map(fav => fav.code);

        let allStops = [];
        let skip = 0;
        let moreData = true;

        while (moreData) {
            const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`, {
                headers: {
                    "AccountKey": process.env.LTA_API_KEY,
                    "accept": "application/json"
                }
            });

            const data = await response.json();

            if (data.value.length > 0) {
                allStops = allStops.concat(data.value);
                skip += data.value.length;
            } else {
                moreData = false;
            }
        }

        let favData = allStops.filter(stop => favoriteCodes.includes(stop.BusStopCode));

        const search = req.query.search;
        if (search) {
            const formatSearch = search.toLowerCase();
            const filteredData = favData.filter(busStop =>
                busStop.Description.toLowerCase().includes(formatSearch) ||
                busStop.BusStopCode.includes(search)
            );
            return res.json(filteredData);
        }

        res.status(200).json(favData);
    } catch (e) {
        res.status(500).json({ "message": e.message });
    }
})
router.delete('/api/favorites/:code', function (req, res) {
    let code = req.params.code;
    favoriteService.deleteFavorite({ "code": code })
        .then(function (response) {
            res.status(200).json({ "message": response });
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})

//TRAVEL CARD==================================================================
router.post('/api/cards', function (req, res) {
    let data = req.body;
    let userId = res.locals.userId;
    cardService.addCard(data.name, data.code, data.type, data.balance, userId)
        .then(function (response) {
            res.status(200).json({ "message": response });
        }).catch(function (error) {
            res.status(500).json(error.message);
        });
})
router.get('/api/cards/all', function (req, res) {
    cardService.getCards()
        .then(function (response) {
            res.status(200).json(response);
        }).catch(function (error) {
            res.status(500).json(error.message);
        });
})
router.get('/api/cards/mine', function (req, res) {
    let userid = res.locals.userId;
    console.log(userid);
    cardService.getCard({ "user": userid })
        .then(function (response) {
            res.status(200).json(response);
        }).catch(function (error) {
            res.status(500).json(error.message);
        });
})
router.get('/api/cards/name/:value', function (req, res) {
    let value = req.params.value;
    cardService.getCard({ "name": value })
        .then(function (response) {
            res.status(200).json({ "message": response });
        }).catch(function (error) {
            res.status(500).json(error.message);
        });
})
router.get('/api/cards/:id', function (req, res) {
    let id = req.params.id;
    cardService.getCardById(id).then(function (response) {
        res.status(200).json(response);
    })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        })
})
router.delete('/api/cards/:id', function (req, res) {
    let id = req.params.id;
    cardService.deleteCard(id)
        .then(function (response) {
            res.status(200).json({ "message": response });
        })
        .catch(function (error) {
            res.status(500).json({ "message": error.message });
        });
})
router.put('/api/cards/:id', function (req, res) {
    let id = req.params.id;
    let data = req.body;
    let userId = res.locals.userId;
    cardService.getCardById(id).then(function (response) {
        if (!response) {
            res.status(200).json({ "message": "Unable to find record to update." });
        } else {
            console.log(response._id);
            console.log(userId);
            if (!response.user._id.equals(userId)) {
                res.status(403).json({ "message": "You are not authorized to perform this action." });
            } else {
                cardService.updateCardById(id, { name: data.name, code: data.code, type: data.type, balance: data.balance })
                    .then(function (response) {
                        res.status(200).json({ "message": response });
                    })
                    .catch(function (error) {
                        res.status(500).json({ "message": error.message });
                    });
            }
        }
    })
})
//LTA API ===============================================
require("dotenv").config({ path: "./env/api.env" });
router.get("/api/bus-arrival", async function (req, res) {
    const busStopCode = req.query.busStopCode;
    if (!busStopCode) {
        return res.status(400).json({ error: "Bus stop code is required" });
    }

    try {
        const response = await fetch(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`, {
            headers: {
                "AccountKey": process.env.LTA_API_KEY,
                "accept": "application/json"
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from LTA API", details: error.message });
    }
})

router.get("/api/bus-services", async function (req, res) {
    try {
        let allServices = [];
        let skip = 0;
        let moreData = true;

        while (moreData) {
            const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/BusServices?$skip=${skip}`, {
                headers: {
                    "AccountKey": process.env.LTA_API_KEY,
                    "accept": "application/json"
                }
            });

            const data = await response.json();

            if (data.value.length > 0) {
                allServices = allServices.concat(data.value);
                skip += data.value.length;
            } else {
                moreData = false;
            }
        }

        const search = req.query.search;
        if (search) {
            const formatSearch = search.toLowerCase();
            const filteredData = allServices.filter(busService =>
                busService.ServiceNo.includes(formatSearch)
            );
            return res.json(filteredData);
        }

        res.json(allServices);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from LTA API", details: error.message });
    }
})

router.get("/api/bus-stops", async function (req, res) {
    try {
        let allStops = [];
        let skip = 0;
        let moreData = true;

        while (moreData) {
            const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${skip}`, {
                headers: {
                    "AccountKey": process.env.LTA_API_KEY,
                    "accept": "application/json"
                }
            });

            const data = await response.json();

            if (data.value.length > 0) {
                allStops = allStops.concat(data.value);
                skip += data.value.length;
            } else {
                moreData = false;
            }
        }

        const search = req.query.search;
        if (search) {
            const formatSearch = search.toLowerCase();
            const filteredData = allStops.filter(busStop =>
                busStop.Description.toLowerCase().includes(formatSearch) ||
                busStop.BusStopCode.includes(search)
            );
            return res.json(filteredData);
        }

        res.json(allStops);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from LTA API", details: error.message });
    }
});

router.get("/api/train-status", async function (req, res) {
    try {
        const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts`, {
            headers: {
                "AccountKey": process.env.LTA_API_KEY,
                "accept": "application/json"
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from LTA API", details: error.message });
    }
})

module.exports = router;