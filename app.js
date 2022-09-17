// create variable to hold the state of the game
let mistakes = 0
let currentQuestion = 0

// Some enumerations to use in the code
const NEW_GAME  = 1
const CORRECT   = 2
const INCORRECT = 3

const TRUE      = 1
const FALSE     = 0

// Sounds to play to the user throughout the game
const audioNewGame   = document.getElementById("new-game-sound")
const audioCorrect   = document.getElementById("correct-sound")
const audioIncorrect = document.getElementById("incorrect-sound")
const audioMusic     = document.getElementById("music")

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
    playSound(NEW_GAME) // Play the 'new game' sound
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
    let buttonPressed = document.getElementById(i)  // Get current pressed button

    let parent = buttonPressed.parentElement        // Store the parent element of the button
    
    if ((row * col) == question) {
        playSound(CORRECT)          // Play the 'correct' sound
        buttonPressed.remove()      // Get rid of the current button
        parent.innerHTML = question // Slot the solution in place of the button
        currentQuestion++           // Add one to question counter
        showBoyAvatar(CORRECT)      // Display happy boy avatar
        showQuestion()              // Get the next question
    } else {
        playSound(INCORRECT)        // Play the 'incorrect' sound
        mistakes++                  // Add 1 to the mistakes counter
        showBoyAvatar(INCORRECT)    // Display sad boy avatar
        showMistakes()              // Display the mistakes count to the user
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

    // Get all instances of <button>
    const x = document.getElementsByTagName("button");
   
    // Loop through all of our <button> instances to add event listeners.
    for (let i = 0; i < x.length; i++) {
        document.getElementById(x[i].id).addEventListener("click", function() {
           checkAnswer(i+1)
        })
     }

     // Add an event to the close button on the instructions screen
     document.getElementById("close").addEventListener("click", function () {
        showInstructions(FALSE)
     })
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to play a sound according t
// if the user chose a correct answer or not.
//
// Arguments: NEW_GAME: (0), CORRECT: (1), INCORRECT: (2)
function playSound(ident) {
    switch (ident) {
        case NEW_GAME  : audioNewGame.play(); break;
        case CORRECT   : audioCorrect.play(); break;
        case INCORRECT : audioIncorrect.play(); break;
    }
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to display a happy avatar
// with a correct answer and a sad answer with an incorrect
// answer.
//
// Arguments: CORRECT: (1), INCORRECT: (2)
function showBoyAvatar(status) {
    // status: CORRECT or INCORRECT
    if(status == CORRECT) {
        // Show the 'happy' boy avatar
        document.getElementById("boy-avatar").innerHTML = "<img src='images/happy.png' height='100' />"
    } else {
        // Show the 'sad' boy avatar
        document.getElementById("boy-avatar").innerHTML = "<img src='images/sad.png' height='100' />"
    }
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to display a splash screen
// at the beginning of the game.
//
// Arguments: TRUE (1), FALSE (0)
function showInstructions(p) {
    
    if(p) {
        // Display instructions
        document.getElementById("instructions").style.visibility = "visible";
    } else {
        // Hide instructions
        document.getElementById("instructions").style.visibility = "hidden";
    }
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to play or pause the in-play
// music
//
// Arguments: TRUE (1), FALSE (0)
function playMusic(p) {
    if(p) document.getElementById("music").play()
    else document.getElementById("music").pause()
}

//////////////////////////////////////////////////////////////////
// INITIALISATION FUNCTIONS

// run addEventListener Function
addEventListeners()

// run showQuestion Function
showQuestion()

// Show instructions
showInstructions(TRUE)

//////////////////////////////////////////////////////////////////

