const express = require('express')
const server = express()
const nunjucks = require('nunjucks')
const body_parser = require('body-parser')
const opentdb = require('opentdb-api')

//configurar nunjucks
nunjucks.configure('src/views', {
    express: server,
    noCache: true,
})

server
    //receber dados do req.body codificado
    .use(body_parser.urlencoded({ extended: true }))
    .use(body_parser.json())
    //configurar arquivos estaticos
    .use(express.static("public"))
    //rotas da app
    .get("/", (req, res) => { return res.render("index.html") })
    .get("/game-setting", (req, res) => {
        opentdb.getCategories().then(categories => {
            return res.render("game-setting.html", { categories })
        })
    })
    .get("/high-scores", (req, res) => { return res.render("high-scores.html") })
    .get("/end", (req, res) => { return res.render("end.html") })
    .get("/start-game", (req, res) => { return res.render("game.html") })
    .get("/get-questions", (req, res) => {
        //get questions from the open trivia api 
        opentdb.getToken().then(newToken => {

            var options = {
                amount: parseInt(req.query.numberOfQuestionsChoosen),
                category: parseInt(req.query.categoryChoosen),
                difficulty: req.query.difficultyChoosen.toLowerCase(),
                type: 'multiple',
                token: newToken
            }

            opentdb.getTrivia(options).then(resp => {
                res.json(resp)
            })
        })
    })
    .listen(3000)