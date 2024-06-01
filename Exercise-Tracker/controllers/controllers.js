const {User, Exercise } = require('../models/models.js');


exports.createUser = async (req, res) => {
    const { username } = req.body;
    const user = new User({ username : username });

    try {
        const response = await user.save();
        res.json({
            username : username,
            _id : response._id
        })
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find().select({__v : 0});
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.createExercise = async (req, res) => {
    try {
        const { _id } = req.params;
        let { description, duration, date } = req.body;
        
        if (!date) {
            date = new Date().toISOString().substring(0, 10);
        }
        const response = await User.findById(_id);

        const exerciseObj = new Exercise({
            username : response.username,
            description : description,
            duration : parseInt(duration),
            date : date,
            userId : _id
        });
        exerciseObj.save();


        res.json({
            username: response.username,
            description: exerciseObj.description,
            duration: exerciseObj.duration,
            date: new Date(date).toDateString(),
            _id: _id
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
}

exports.getAllLogs = async (req, res) => {

    const userId = req.params._id;
	const from = req.query.from || new Date(0).toISOString().substring(0, 10);
	const to = req.query.to || new Date(Date.now()).toISOString().substring(0, 10);
	const limit = Number(req.query.limit) || 0;

	let user = await User.findById(userId).exec();

	let exercises = await Exercise.find({
		userId: userId,
		date: { $gte: from, $lte: to },
	})
		.select('description duration date')
		.limit(limit)
		.exec();

	let parsedDatesLog = exercises.map((exercise) => {
		return {
			description: exercise.description,
			duration: exercise.duration,
			date: new Date(exercise.date).toDateString(),
		};
	});

	res.json({
		_id: user._id,
		username: user.username,
		count: parsedDatesLog.length,
		log: parsedDatesLog,
	});
}