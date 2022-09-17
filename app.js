// create variable to hold the state of the game
let mistakes = 0
let currentQuestion = 0
const NEW_GAME  = 1 // ENUM for sounds to play
const CORRECT   = 2
const INCORRECT = 3

const audioNewGame   = document.getElementById("new-game-sound")
const audioCorrect   = document.getElementById("correct-sound")
const audioIncorrect = document.getElementById("incorrect-sound")

// this section of code adds all answers from the 10 times table to the answers array. This includes repeated values.
let answers = []
for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
        answers.push(i * j)
    }
}

// this code randomises the order of the answers array
answers = answers.sort(() => Math.random() - 0.5)

function showMistakes() {
    /* ADD CODE HERE

        1. insert the value of mistakes into the HTML element with id="mistakes"
    */
    document.getElementById("mistakes").innerText = mistakes
}

function showQuestion() {
    /* ADD CODE HERE

        1. insert the value of answers[currentQuestion] into the HTML element with id="num"
    */
    playSound(NEW_GAME)
    document.getElementById('num').innerText = answers[currentQuestion]
}

function checkAnswer(i) {

    // these three lines use the id of the button, i, to work out 
    // which row and column the button was
    let I = i - 1
    let row = (I % 10) + 1
    let col = (Math.floor(I / 10)) + 1

    let question = answers[currentQuestion]

    /* ADD CODE HERE
    
        1. check if row*col == answers[currentQuestion]
            if true:
                1. remove the button and replace with the number
                2. add one to the currentQuestion counter
                3. call the showQuestion function
            if false:
                1. add one to mistakes
                2. call the showMistakes function
    */

    // Get ID of clicked button
    let buttonPressed = document.getElementById(i) // Get current pressed button

    let parent = buttonPressed.parentElement // Store the parent element of the button
    
    if ((row * col) == question) {
        playSound(CORRECT)
        buttonPressed.remove() // Get rid of the current button
        parent.innerHTML = question // Slot the solution in place of the button
        currentQuestion++
        showQuestion()
    } else {
        playSound(INCORRECT)
        mistakes++
        showMistakes()
    }
}

function addEventListeners() {
    /* ADD CODE HERE

       1. add event listeners for all the grid buttons so they call the grade function.
          E.g.
          button id="1" should call grade(1)
          button id="2" should call grade(2)
          etc. 
    */

    // loop through all elements in the DOM in order to get all the buttons within 'main'
    const x = document.getElementsByTagName("button");
   
    for (let i = 0; i < x.length; i++) {

        //console.log("Element " + i + " is a <" + x[i].tagName + ">")

        document.getElementById(x[i].id).addEventListener("click", function() {
           checkAnswer(i+1)
        })
     }
}

function playSound(ident) {
    switch (ident) {
        case NEW_GAME  : audioNewGame.play(); break;
        case CORRECT   : audioCorrect.play(); break;
        case INCORRECT : audioIncorrect.play(); break;
    }
}

// run addEventListener Function
addEventListeners()

// run showQuestion Function
showQuestion()

