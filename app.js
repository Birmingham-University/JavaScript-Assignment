// create variable to hold the state of the game
let mistakes        = 0
let currentQuestion = 0
let skipped         = 0

// Some enumerations to use in the code
const NEW_GAME      = 1
const CORRECT       = 2
const INCORRECT     = 3

const TRUE          = 1
const FALSE         = 0

let soundFlag       = FALSE

let alreadyPlayed = [] // a place to keep all played numbers

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
    document.getElementById("mistakes").innerText = mistakes
}

function showQuestion() {
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

    // Get all instances of <button>
    const x = document.getElementsByTagName("button");
   
    // Loop through all of our <button> instances to add event listeners
    for (let i = 0; i < x.length; i++) {
        document.getElementById(x[i].id).addEventListener("click", function() {
           checkAnswer(i+1)
        })
     }

     // Add an event to the close button on the instructions screen
     document.getElementById("close").addEventListener("click", function () {
        showInstructions(FALSE)
        playMusic(TRUE)
     })

     // Add an event listener to the audio mute button
     document.getElementById("toggle-music").addEventListener("click", function () {
        // Toggle the music
        if(!soundFlag) {
            playMusic(TRUE)
        } else {
            playMusic(FALSE)
        }
     })
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to play a sound according t
// if the user chose a correct answer or not.
//
// Arguments: NEW_GAME: (0), CORRECT: (1), INCORRECT: (2)
//////////////////////////////////////////////////////////////////
function playSound(ident) {
    
    if(!soundFlag) return;

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
//////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////
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
// The purpose of this function is to allow the player to skip a
// question. This will reveal the corect answer.
//////////////////////////////////////////////////////////////////
function playMusic(p) {

    if(p) {
        document.getElementById("music").play()
        document.getElementById("toggle-music").setAttribute("src", "images/music_on.png")
        soundFlag = TRUE
    } else {
        document.getElementById("music").pause()
        document.getElementById("toggle-music").setAttribute("src", "images/music_off.png")
        soundFlag = FALSE
    }
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to play or pause the in-play
// music
//
// Arguments: TRUE (1), FALSE (0)
function skipQuestion() {
 // TO DO
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

