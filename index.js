const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({ 
    host:"demodb.cdfd2imbevr7.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: 'root', 
    password: "12345678", 
    database: "bac" 
}); 
module.exports = { db };

app.get('/users', (req, res)=>{
    db.query("SELECT * FROM roles",(err, result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    });
});

app.post('/create',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const date_of_birth = req.body.date_of_birth;

    db.query("INSERT INTO users (username,password,email,date_of_birth) VALUES(?,?,?,?)", [username, password, email, date_of_birth],
    (err, result)=>{
        if(err){
            console.log(err);
        } else {
            res.send("Value inserted");
        }
    }
    );
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server error');
        } else {
            if (result.length > 0) {

                if (password === result[0].password) {
                    res.send("Login successful");
                } else {
                    res.status(401).send('Invalid credentials');
                }
            } else {
                res.status(404).send('User not found');
            }
        }
    });
});

app.post('/cons', (req, res) => {
    const { concert_name, concert_description, date_time, total_seats, seats_available } = req.body;

    
        db.query("INSERT INTO concerts (concert_name, concert_description, date_time, total_seats, seats_available) VALUES (?, ?, ?, ?, ?)",
            [concert_name, concert_description, date_time, total_seats, seats_available],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error inserting data");
                }
                res.status(201).send({ message: "Value inserted", concertId: result.insertId });
            }
        );
});


app.post('/ticket', (req, res) => {
    //
    const { seat_number, ticket_price, ticket_name, ticket_description } = req.body;

    
    db.query("INSERT INTO tickets (seat_number, ticket_price, ticket_name, ticket_description) VALUES (?, ?, ?, ?)",
        [seat_number, ticket_price, ticket_name, ticket_description],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error inserting data");
            }
            res.status(201).send({ message: "Value inserted", ticketId: result.insertId });
        }
    );
});


app.post("/resale_ticket", (req, res) => {

    const { resaleName, resaleSeat, resalePrice, resaleDescription } = req.body;

   
        // Insert resale ticket data into 'resale_ticket' table
        const insertResaleTicketQuery = "INSERT INTO resale_ticket ( resale_name, resaleseat_number, resale_price, resale_description) VALUES ( ?, ?, ?, ?)";
        db.query(insertResaleTicketQuery, [resaleName, resaleSeat, resalePrice, resaleDescription], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            return res.status(200).send('Ticket and resale data added successfully');
        });
    });



app.get('/concerts', (req, res) => {
    const query = "SELECT concert_name, concert_description FROM concerts";

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.status(200).json(results);
        }
    });
});
app.get('/tickets', (req, res) => {
    const query = "SELECT ticket_id,seat_number,ticket_price,ticket_name,ticket_description FROM tickets";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/resale_ticket', (req, res) => {
    const query = "SELECT resale_id, resale_name, resaleseat_number, resale_price, resale_description FROM resale_ticket";

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.status(200).json(results);
        }
    });
});

app.listen('3000',()=>{
    console.log('Server on 3000');
})