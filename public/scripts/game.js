$(document).ready(function () {
    const question = document.getElementById("question")
    const choices = Array.from(document.getElementsByClassName("choice-text"))
    const progressText = document.getElementById("progress-text")
    const scoreText = document.getElementById("score")
    const progressBarFull = document.getElementById("progress-bar-full")
    const loader = document.getElementById("loader")
    const game = document.getElementById("game")
    const numberOfQuestionsChoosen = localStorage.getItem("numberOfQuestions")
    const categoryChoosen = localStorage.getItem("category")
    const difficultyChoosen = localStorage.getItem("difficulty")

    let currentQuestion = {}
    let acceptingAnswers = true
    let score = 0
    let questionCounter = 0
    let availableQuestions = []
    let questions = []


    $.ajax({
        type: 'get',
        url: '/get-questions',
        contentType: 'application/json',
        data: {
            numberOfQuestionsChoosen,
            categoryChoosen,
            difficultyChoosen
        },
        success: function (result) {
            questions = result.map(loadedQuestion => {
                const formattedQuestion = {
                    question: loadedQuestion.question
                }

                const answerChoices = [...loadedQuestion.incorrect_answers]
                formattedQuestion.answer = Math.floor(Math.random() * 3) + 1
                answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer)
                answerChoices.forEach((choice, index) => {
                    formattedQuestion["choice" + (index + 1)] = choice
                })
                return formattedQuestion
            })
            startGame()
        }
    })

    /*
    fetch("https://opentdb.com/api.php?amount=10&difficulty=hard").then(res => { return res.json() }).then(loadedQuestions => {
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            }
    
            const answerChoices = [...loadedQuestion.incorrect_answers]
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer)
            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice
            })
            return formattedQuestion
        })
        startGame()
    }).catch(err => {
        console.error(err)
    })
    */


    //CONSTANTS
    const CORRECT_BONUS = 2
    const MAX_QUESTIONS = numberOfQuestionsChoosen || 10

    function startGame() {
        questionCounter = 0;
        score = 0;
        availableQuestions = [...questions];
        getNewQuestion()
        game.classList.remove("hidden")
        loader.classList.add("hidden")
    }

    function getNewQuestion() {
        if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
            //save score
            localStorage.setItem("mostRecentScore", score)

            //go to the end page
            return window.location.assign("/end")
        }
        questionCounter++;
        progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`
        //update progress bar
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
        const questionIndex = Math.floor(Math.random() * availableQuestions.length)
        currentQuestion = availableQuestions[questionIndex]
        question.innerText = currentQuestion.question

        choices.forEach(choice => {
            const number = choice.dataset['number']
            choice.innerText = currentQuestion['choice' + number]
        })

        availableQuestions.splice(questionIndex, 1)
        acceptingAnswers = true
    }

    choices.forEach(choice => {
        choice.addEventListener("click", e => {
            if (!acceptingAnswers) return

            acceptingAnswers = false
            const selectedChoice = e.target
            const selectedAnswer = selectedChoice.dataset["number"]
            const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

            if (classToApply === 'correct') {
                incrementScore(CORRECT_BONUS)
            }

            selectedChoice.parentElement.classList.add(classToApply)
            //add delay
            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply)
                getNewQuestion()
            }, 1000)
        })
    })

    function incrementScore(num) {
        score += num
        scoreText.innerText = score
    }
})