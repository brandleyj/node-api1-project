// implement your API here
const express = require("express");

const db = require("./data/db");

const server = express();

server.use(express.json());

const port = 6000;
server.listen(port, () => console.log(`Server started on port ${port}`));

server.post("/api/users", (req, res) => {
	const dbData = req.body;
	if (!dbData.name || !dbData.bio) {
		res
			.status(400)
			.json({ errorMessage: "Please provide name and bio for the user." });
	} else {
		db.insert(dbData)
			.then(user => {
				res.status(201).json(user);
			})
			.catch(error => {
				res.status(500).json({
					error: "There was an error while saving the user to the database"
				});
			});
	}
});

server.get("/api/users", (req, res) => {
	db.find()
		.then(users => res.send(users))
		.catch(error =>
			res.status(500).json({
				error: "The user information could not be retrieved."
			})
		);
});

server.get("/api/users/:id", (req, res) => {
	const id = req.params.id;
	db.findById(id)
		.then(dbById => {
			if (dbById) {
				res.send(dbById);
			} else {
				res.status(404).json({
					message: "The user with the specified ID does not exist."
				});
			}
		})
		.catch(error =>
			res
				.status(500)
				.json({ error: "The user information could not be retrieved." })
		);
});

server.delete("/api/users/:id", (req, res) => {
	const id = req.params.id;
	db.remove(id)
		.then(dbItem => {
			if (dbItem) {
				res.json(dbItem);
			} else {
				res
					.status(404)
					.json({ message: "The user with the specified ID does not exist." });
			}
		})
		.catch(error =>
			res.status(500)({ error: "The user could not be removed" })
		);
});

server.put("/api/users/:id", (req, res) => {
	const id = req.params.id;
	const changes = req.body;

	if (!changes.name || !changes.bio) {
		res
			.status(400)
			.json({ errorMessage: "Please provide name and bio for the user." });
	} else {
		db.update(id, changes)
			.then(dbItem => {
				if (!dbItem) {
					res.status(404).json({
						message: "The user with the specified ID does not exist."
					});
				} else {
					res.status(200).json(db);
				}
			})
			.catch(error => {
				res.status(500).json({
					message: "error: The user information could not be modified"
				});
			});
	}
});
