var express = require('express')
var app = express();
const  sqlite3 = require("sqlite3").verbose();
var http = require('http').Server(app);
app.use(express.urlencoded({extended: true}));
var file = 'api.db';
var db = new sqlite3.Database(file);
app.use(express.json());

const unirest = require('unirest');
const api_key = "d2dc7c81d2mshda512266aa9656cp1eded9jsnd2d3a342d500";


db.serialize(function () {
    db.run("DROP TABLE IF EXISTS recipes");
    db.run("CREATE TABLE recipes (recipeid INTEGER  PRIMARY KEY ,link TEXT,price TEXT)");

});
app.get('/', function (req, res) {



    res.sendFile(__dirname + '/inde.html');

});
function recipeQuery(ingredients, callback) {
    var query = unirest("GET", "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients");

    query.query({
        "number": "5",
        "ranking": "1",
        "ignorePantry": "false",
        "ingredients": ingredients
    });

    query.headers({
        "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "x-rapidapi-key": "91a90d759emshb141c6815b68c2dp11d00cjsna6481f2d7647"
    });

    var data;
    
   data = query.end(function (response) {
        
         //   data=response.body
        callback(response);
        //console.log(response.body);
    });
}
app.post('/getRecipes', function (req, res) {
    console.log(typeof req.body.data)
    console.log(typeof JSON.parse(req.body.data))
    var ingredients = JSON.parse(req.body.data)
    ingredients = ingredients.map(ingredient => ingredient + "%2c");
    recipeQuery(ingredients,function(response){
        res.send(response);
    })
    
    //console.log(data.missedIngredients)
    //res.send(JSON.stringify(data));
});

http.listen(3000, function () {

    

    console.log('listening on *:3000');

});