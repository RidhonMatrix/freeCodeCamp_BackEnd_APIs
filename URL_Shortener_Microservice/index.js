require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');
const mongoose = require('mongoose');
const shortid = require('shortid');
const { url } = require('inspector');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// db connect 
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to database!");
	})
	.catch((error) => {
		console.log("Connection failed!", error);
		process.exit();
	});

// schema 
const urlSchema = new mongoose.Schema({
    Original_url:  String,
    short_url: String
});
const URL_MODEL = mongoose.model('Url', urlSchema);

// shorturl 
app.post('/api/shorturl', (req, res) => {
  var OriginalURL = req.body.url;

  // remove http
  const urlExtractor = OriginalURL
    .replace(/http[s]?\:\/\//, '')
    .replace(/\/(.+)?/, '');

      

  dns.lookup(urlExtractor, (err, address, family) => {
    if (err) {
      res.json({
        error: 'invalid url'
      });
    }else{
      // res.send(`Addresses: ${address}, Family: IPv${family}`);
      
      const is_url_exist = URL_MODEL.findOne({Original_url: OriginalURL})
      .then(url_exists => {
        if(url_exists){
          res.json({
            Original_url:  url_exists.Original_url,
            short_url: url_exists.short_url
          })
        }
        else{
          var shortenedURL = shortid.generate().toString();
          let newURL = new URL_MODEL({
            Original_url:  OriginalURL,
            short_url: shortenedURL
          });

          newURL.save();

          res.json({
            original_url: OriginalURL,
            short_url: shortenedURL
          });
        }
      })
    }
  });

});

app.get('/api/shorturl/:short_url',async (req, res) => {
  // console.log(req.params.short_url);
  const find_url = await URL_MODEL.findOne({
    short_url: req.params.short_url
  })
  res.redirect(find_url.Original_url);


});


app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
