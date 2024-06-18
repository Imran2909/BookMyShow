// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const port = 8080;
// const path = require('path');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// const cors = require('cors');
// const { connection, collection_connection } = require("./connector");
// app.use(cors());
// let lastBooking = null; // Variable to store the last booking

// app.get("/", (req, res) => {
//     res.send("Home page for BookMyShow");
// });

// app.post("/api/booking", async (req, res) => {
//     const { movie, slot, seats } = req.body;
//     try {
//         const getPrevData = await collection_connection.findOne({ movie, slot });
//         if (getPrevData) {
//             const updatedSeats = {
//                 "A1": seats["A1"] + (getPrevData.seats["A1"] || 0),
//                 "A2": seats["A2"] + (getPrevData.seats["A2"] || 0),
//                 "A3": seats["A3"] + (getPrevData.seats["A3"] || 0),
//                 "A4": seats["A4"] + (getPrevData.seats["A4"] || 0),
//                 "D1": seats["D1"] + (getPrevData.seats["D1"] || 0),
//                 "D2": seats["D2"] + (getPrevData.seats["D2"] || 0)
//             };

//             getPrevData.seats = updatedSeats;
//             await getPrevData.save();

//             res.send({ msg: "Data updated successfully", data: getPrevData });
//         } else {
//             const newData = new collection_connection({ movie, slot, seats });
//             await newData.save();

//             res.send({ msg: "Data added successfully", data: newData });
//         }
//     } catch (error) {
//         res.send({ msg: "Data addition failed", error: error.message });
//     }
// });


// app.get("/api/booking", async (req, res) => {
//     const { movie, slot } = req.body
//     const data = await collection_connection.find({ movie, slot })
//     try {
//         if (data.length === 0) {
//             res.send({ message: "no previous booking found" })
//         } else {
//             res.send(data)
//         }
//     } catch (error) {
//         res.send({ "message": error.message })
//     }
// });


// app.listen(8080, async () => {
//     try {
//         await connection
//         console.log('connected to db');
//     } catch (error) {
//         console.log('cannot connected to db');
//     }
//     console.log(`App listening on port 8080!`)
// });





const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { connection, collection_connection } = require("./connector");

const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Home page for BookMyShow");
});

app.post("/api/booking", async (req, res) => {
    const { movie, slot, seats } = req.body;
    try {
        const getPrevData = await collection_connection.findOne({ movie, slot });
        if (getPrevData) {
            const updatedSeats = {
                "A1": seats["A1"] + (getPrevData.seats["A1"] || 0),
                "A2": seats["A2"] + (getPrevData.seats["A2"] || 0),
                "A3": seats["A3"] + (getPrevData.seats["A3"] || 0),
                "A4": seats["A4"] + (getPrevData.seats["A4"] || 0),
                "D1": seats["D1"] + (getPrevData.seats["D1"] || 0),
                "D2": seats["D2"] + (getPrevData.seats["D2"] || 0)
            };

            getPrevData.seats = updatedSeats;
            await getPrevData.save();

            res.send({ msg: "Data updated successfully", data: getPrevData });
        } else {
            const newData = new collection_connection({ movie, slot, seats });
            await newData.save();

            res.send({ msg: "Data added successfully", data: newData });
        }
    } catch (error) {
        res.send({ msg: "Data addition failed", error: error.message });
    }
});

app.get("/api/booking", async (req, res) => {
    const { movie, slot } = req.query; // Use query parameters
    try {
        const data = await collection_connection.findOne({ movie, slot });
        if (!data) {
            res.send({ message: "No previous booking found" });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.send({ message: error.message });
    }
});

app.listen(port, async () => {
    try {
        await connection;
        console.log('Connected to database');
    } catch (error) {
        console.log('Cannot connect to database');
    }
    console.log(`App listening on port ${port}!`);
});
