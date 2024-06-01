
var express = require('express');
var app = express();


var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200})); 
app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});




app.get('/api/:date?',(req,res) => {
  let input = req.params.date;

  let isValidDate = Date.parse(input);
  let isValidUnixNumber = /^[0-9]+$/.test(input)
  let isEmpty = input == "" || input == null;

  if(isValidDate){
    res.json({
      unix: (new Date(input)).valueOf(),
      utc: (new Date(input)).toUTCString()
    })
  }
  else if(isValidUnixNumber  && isNaN(isValidDate)){
    res.json({
      unix: (new Date(parseInt(input))).valueOf(),
      utc: (new Date(parseInt(input))).toUTCString()
    })
  }else if(isEmpty){
    res.json({
      unix: (new Date()).valueOf(),
      utc: (new Date()).toUTCString()
    })
  }else{
    res.json({error: "Invalid Date"});
  }

});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
