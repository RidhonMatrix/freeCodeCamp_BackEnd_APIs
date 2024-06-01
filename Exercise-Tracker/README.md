# Exercise Tracker

Create an application similar [to the example Exercise Tracker](https://exercise-tracker.freecodecamp.rocks/).

## Links

- [Assignment](https://freecodecam-boilerplate-nsulwlhqq07.ws-us114.gitpod.io/)

- [Solution](https://replit.com/@borntofrappe/boilerplate-project-exercisetracker)



## Notes

The assignment asks to support several routes and methods.

| Route                       | Method | Payload                           | Response                                                                  |
| --------------------------- | ------ | --------------------------------- | ------------------------------------------------------------------------- |
| `/api/users`                | POST   | `username`                        | `{ username, _id }`                                                       |
| `/api/users`                | GET    |                                   | `[{ username, _id }, {...}]`                                              |
| `/api/users/:_id/exercises` | POST   | `description`, `duration`, `date` | `{ _id, username, date, duration, description }`                          |
| `/api/users/:_id/logs`      | GET    |                                   | `{ _id, username, count, log: [{ date, duration, description }, {...}] }` |



### Create user

Concerning the post request to `/api/users` start by extracting the `username` from the request's body.

```js
const { username } = req.body;
```

Remember to install and initialize `body-parser` to populate the object.

```js
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
```

After creating and saving the user return a JSON object with the `_id` and `username` fields.

```js
res.json({
  username,
  _id,
});
```

With a database create a user from the model (described in a later section) and save the instance with the `.save` method.

### Get users

For the get request to `/api/users` begin by finding all users, then return an array of objects with the `username` and `_id` fields.

With a database pass an empty object to the `.find` query, so to find _all_ documents from the model.

```js
User.find({});
```

Chain the `select` function to limit the information to the desired fields.

```js
User.find({}).select("username");
```

The `_id` is automatically included.

### Create exercise

For the post request to `/api/users/:_id/exercises` extract the identifier from the route parameters, the description, duration and date from the request's body.

Find the user with a matching `_id` and append the exercise to the user's log. Finally, return a JSON object highlighting the prescribed fields.

```json
{
  _id,
  username,
  date: date.toDateString(),
  duration,
  description
}
```

The assignment asks to format the date specifically with `toDateString()`.

In terms of mongoose it seems the default value for the date is not used when the model receives `null`. Pass `undefined` instead.

```js
const exercise = new Exercise({
  // ..
  date: date || undefined,
});
```

When finding a user through the `findById` query it seems it is enough to then save the user document to store the exercise, the sub-document, as well.

### Get exercises

For the get request to `/api/users/:_id/logs` find the user with the same `_id` retrieved through the route parameter. For this user return an object with a log of exercises.

```json
{
  _id,
  username,
  count,
  log: []
}
```

For the log uses `from <= date <= to` date.

```js
let exercises = await Exercise.find({
		userId: userId,
		date: { $gte: from, $lte: to },
	})
		.select('description duration date')
		.limit(limit)
		.exec();
```

Use `let` to potentially modify the data structure through the query parameters. As per the assignment, the request can be refined with three options: `to`, `from` and `limit`.

Use `limit` to include only the prescribed number of exercises in the log.


Use `to` and/or `from`, two strings in `yyyy-mm-dd` format, to show only the exercises up to and/or from the input values.


### Mongoose schemas


```js
const userSchema = new mongoose.Schema({
    username: String
});
```



```js
const exerciseSchema = new mongoose.Schema({
    userId : String,
    userName: String,
    description : String,
    duration : Number,
    date : Date
});
```

