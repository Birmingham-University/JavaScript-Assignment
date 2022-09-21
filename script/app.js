//////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES AND CONSTANTS
//////////////////////////////////////////////////////////////////

// create variable to hold the state of the game
let mistakes        = 0
let currentQuestion = 0
let skipped         = 0

// Some useful constants to use in the code
const NEW_GAME      = 1
const CORRECT       = 2
const INCORRECT     = 3
const SKIPPED       = 4
const MAX_PLAYS     = 100 // This is for a full game at the moment

// Useful constants
const TRUE          = 1
const FALSE         = 0

// Is the sound set as on or off?
let soundFlag       = TRUE

// Player details for the JSON xAPI object
let playerName      = ""
let playerEmail     = ""

// Sounds to play to the user throughout the game
const audioNewGame   = document.getElementById("new-game-sound")
const audioCorrect   = document.getElementById("correct-sound")
const audioIncorrect = document.getElementById("incorrect-sound")
const audioMusic     = document.getElementById("music")

//////////////////////////////////////////////////////////////////
// this section of code adds all answers from the 10 times table
// to the answers array. This includes repeated values.
//////////////////////////////////////////////////////////////////
let answers = []
for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
        answers.push(i * j)
    }
}

// this code randomises the order of the answers array
answers = answers.sort(() => Math.random() - 0.5)

//////////////////////////////////////////////////////////////////
// This function displays the number of incorrectly answered
// questions in the top left of the screen.
//////////////////////////////////////////////////////////////////
function showMistakes() {
    document.getElementById("mistakes").innerText = mistakes
}

//////////////////////////////////////////////////////////////////
// This function displays the number of skipped questions in the
// top left of the screen.
//////////////////////////////////////////////////////////////////
function showSkipped() {
    document.getElementById("skipped").innerText = skipped
    currentQuestion++ // Add to the current question so we can move on
}

//////////////////////////////////////////////////////////////////
// This function displays the new question in the top left of the
// screen.
//////////////////////////////////////////////////////////////////
function showQuestion() { 

    playSound(NEW_GAME) // Play the 'new game' sound
    document.getElementById('num').innerText = answers[currentQuestion]
}

//////////////////////////////////////////////////////////////////
// This function checks if the correct button is pressed and
// sets all variables to report to the user
//////////////////////////////////////////////////////////////////
function checkAnswer(i) {
    // Has the game finished?
    if (currentQuestion >= 100) {
        alert("GAME FINISHED")
        return
    }

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
        if(currentQuestion > MAX_PLAYS) showScoreboard(TRUE) // Is this the end of the game?
    } else {
        playSound(INCORRECT)        // Play the 'incorrect' sound
        mistakes++                  // Add 1 to the mistakes counter
        currentQuestion++           // Add one to question counter
        showBoyAvatar(INCORRECT)    // Display sad boy avatar
        showMistakes()              // Display the mistakes count to the user
        if(currentQuestion > MAX_PLAYS) showScoreboard(TRUE) // Is this the end of the game?
    }
}

//////////////////////////////////////////////////////////////////
// This function add event listeners to all objects on the screen
// which the user can interact with.
//////////////////////////////////////////////////////////////////
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
        
        // Has the user provided their name and email?
        
        // Check player name is not empty
        if(!document.getElementById("player-name").value) {
            document.getElementById("player-name").style.backgroundColor = "#CC0000"  // Change bgcolor of text box to red
            document.getElementsByClassName("warning")[0].style.visibility = "visible" // Show the warning to the user
            return
        }

        // Check player email is not empty and, if entred, is valid!
        if((!document.getElementById("player-email").value) || !isEmailValid(document.getElementById("player-email").value)) {
            document.getElementById("player-email").style.backgroundColor = "#CC0000" // Change bgcolor of text box to red
            document.getElementsByClassName("warning")[1].style.visibility = "visible" // Show the warning to the user
            return
        }

        // If they are both provided then go ahead and reset the colours and close the dialog
        if(document.getElementById("player-name").value && document.getElementById("player-email").value) {
            document.getElementById("player-name").style.backgroundColor = "#faebd7"
            document.getElementById("player-email").style.backgroundColor = "#faebd7"
            document.getElementsByClassName("warning")[0].style.visibility = "hidden"
            document.getElementsByClassName("warning")[1].style.visibility = "hidden"
            showInstructions(FALSE)
            if(soundFlag) playMusic(TRUE)
        }
     })

     // Add an event to the show the instructions screen
     document.getElementById("help").addEventListener("click", function () {
        showInstructions(TRUE)
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

     // Add an event listener to skip the current question
     document.getElementById("skip-question").addEventListener("click", function () {
        skipQuestion()
        
        // Is this the end of the game?
        if(currentQuestion > MAX_PLAYS) {
            showScoreboard(TRUE)
        }
     })

     // Play again after scoreboard shown
     document.getElementById("play-again").addEventListener("click", function () {
        showScoreboard(FALSE)
        resetGame()
        showQuestion()
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
// Arguments: CORRECT: (1), INCORRECT: (2), SKIPPED (3)
//////////////////////////////////////////////////////////////////
function showBoyAvatar(status) {
    
    switch (status){
        case CORRECT : document.getElementById("boy-avatar").innerHTML = "<img src='images/happy.png' height='100' />"
            break;
        case INCORRECT : document.getElementById("boy-avatar").innerHTML = "<img src='images/sad.png' height='100' />"
            break;
        case SKIPPED : document.getElementById("boy-avatar").innerHTML = "<img src='images/confused.png' height='100' />"
            break;
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
        // Grab player name and email then hide the instructions
        playerName = document.getElementById("player-name").value
        playerEmail = document.getElementById("player-email").value
        
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
        document.getElementById("toggle-music").setAttribute("src", "images/turn_sound_off_inactive.png")
        soundFlag = TRUE
    } else {
        document.getElementById("music").pause()
        document.getElementById("toggle-music").setAttribute("src", "images/turn_sound_on_inactive.png")
        soundFlag = FALSE
    }
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to enable the user to skip
// the current question
//////////////////////////////////////////////////////////////////
function skipQuestion() {
    // Has the game finished?
    if (currentQuestion >= MAX_PLAYS) {
        showScoreboard(TRUE)
        return
    } else {
        // NEED A LINE TO REVEAL THE ANSWER
        showBoyAvatar(SKIPPED)    // Display confused boy avatar
        skipped++
        sendStatement("skipped", "http://id.tincanapi.com/verb/skipped", "Question "+currentQuestion, "http://www.tyrone.bishop/times-table");
        showSkipped()
        showQuestion()
    }
}

//////////////////////////////////////////////////////////////////
// The purpose of this function is to send a JSON xAPI statment
// to the LRS (https://watershedlrs.com/)
//
// this xAPI routine uses the xAPI Wrapper available here:
// https://github.com/adlnet/xAPIWrapper/releases
//
// Arguments:
//
// verb: chosen from https://registry.tincanapi.com/#home/verbs
// verbID: associated ID from https://registry.tincanapi.com/#home/verbs
// object: What the user is doing
// objectID: My own object ID URI
//////////////////////////////////////////////////////////////////
function sendStatement(verb, verbID, object, objectID) {

    const conf = {
        "endpoint": "https://watershedlrs.com/api/organizations/20013/lrs/", // Watershed's endpoint URI
        "auth": "Basic " + toBase64("49169e3244e6da:6dec7cd3853775")         // key and secret
    }

    ADL.XAPIWrapper.changeConfig(conf); 

    try { // in case there is an error
        const statement = {
            "actor": { // We are using the name/email combination to identify the learner
                "name": playerName,
                "mbox": "mailto:" + playerEmail
            },
            "verb": {
                "id": verbID,
                "display": { "en-gb": verb }
            },
            "object": {
                "id": objectID,
                "definition": {
                    "name": { "en-gb": object }
                }
            }
        }
        const result = ADL.XAPIWrapper.sendStatement(statement);
    }
    catch(e) {
        console.log("Unable to send xAPI statement, returned error: " + e)
    }
}

//////////////////////////////////////////////////////////////////
// Encrypt a string (username and email for example).
//
// Arguments: unencryopted string
// Returns:   the encrypted string
//////////////////////////////////////////////////////////////////
function encrypt(unencrypted_str) {
    return window.btoa(unencrypted_str)
}

//////////////////////////////////////////////////////////////////
// Decrypt a string (username and email for example).
//
// Arguments: encrypted string
// Returns:   the dencrypted string
//////////////////////////////////////////////////////////////////
function decrypt(encrypted_str) {
    return window.atob(encrypted_str)
}

//////////////////////////////////////////////////////////////////
// Start the game from the beginning if the user requestes a
// new game.
//////////////////////////////////////////////////////////////////
function resetGame() {
    mistakes        = 0
    currentQuestion = 0
    skipped         = 0
}

//////////////////////////////////////////////////////////////////
// Show the scoreboard at the end of MAX_PLAYS
//////////////////////////////////////////////////////////////////
function showScoreboard(status) {
    
    // Populate the game data
    document.getElementById("scoreboard-name").innerHTML         = playerName // Get the player's name
    document.getElementById("reported-total-correct").innerHTML  = (currentQuestion - mistakes - skipped) // Gives correct answers
    document.getElementById("reported-total-mistakes").innerHTML = mistakes
    document.getElementById("reported-total-skipped").innerHTML  = skipped

    // Display the scoreboard or not?
    if(status) {
        document.getElementById("scoreboard").style.visibility = "visible";
    }
    else {
        document.getElementById("scoreboard").style.visibility = "hidden";
    }
}

//////////////////////////////////////////////////////////////////
// Check if email is valid on input
//
// Argument: email:string
// Returns:  1 (TRUE) or 0 (FALSE)
//////////////////////////////////////////////////////////////////
function isEmailValid (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// INITIALISATION FUNCTIONS

// run addEventListener Function
addEventListeners()

// run showQuestion Function
showQuestion()

// Show instructions
showInstructions(TRUE)

//////////////////////////////////////////////////////////////////