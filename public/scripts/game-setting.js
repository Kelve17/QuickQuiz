let numberOfQuestionsChoosen = 10
const categoryChoosen = document.getElementById("category")
const difficultyChoosen  = document.getElementById("difficulty")


function createGame() {
    let difficultyStr = difficultyChoosen.options[difficultyChoosen.selectedIndex].text
    let categoryStr = categoryChoosen.options[categoryChoosen.selectedIndex].value
    localStorage.setItem("numberOfQuestions", numberOfQuestionsChoosen)
    localStorage.setItem("category", categoryStr)
    localStorage.setItem("difficulty", difficultyStr)
}


function valueChanged(value){
    numberOfQuestionsChoosen = value
}

