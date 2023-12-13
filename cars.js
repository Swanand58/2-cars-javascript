let car1 = document.getElementById('car1');
let car2 = document.getElementById('car2');
let r_track = document.querySelector('.red_track');
let b_track = document.querySelector('.blue_track');
let speed = 20;
var counter = 0;
var lastScore = document.getElementById('last_score');
var rightTrack = document.getElementById('red_track');
var leftTrack = document.getElementById('blue_track');
var leftGOMusic = new Audio('gameOver.mp3');
var rightGOMusic = new Audio('gameOver.mp3');
var score = new Audio('score.mp3');
var score1 = new Audio('score.mp3');
var myScoreValue = document.getElementById('score');
var myScore = 0;
var scoreIncrement = 15;
var startTime = Date.now();
var gameIsRunning = true;
var gameDuration = 600000; //Game runs for 10 minutes in Total
var gameOverflag = false;
var triangleCounter = 0;
var maxTriangles = 20;

var explode_left = document.getElementById('explode_left');
var explode_right = document.getElementById('explode_right');

var highScore = localStorage.getItem("highScore") || 0;
var highScoreElement = document.getElementById("high-score");
highScoreElement.textContent = "High Score: " + highScore;


var Audio = document.getElementById("Audio");
var isPlaying = false;

function togglePlay() {
  isPlaying ? Audio.pause() : Audio.play();
};

Audio.onplay = function() {
  isPlaying = true;
};
Audio.onpause = function() {
  isPlaying = false;
};


function playMusic(){
    window.location.reload()
    music.play();
    console.clear();
    updateElapsedTime;
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function random_position_blue() {
    var arr = ['10', '35'];
    return arr[Math.floor(Math.random() * arr.length)];
}

function random_position_red() {
    var arr = ['55', '80'];
    return arr[Math.floor(Math.random() * arr.length)];
}

function random_object() {
    var arr = ['rect', 'circle', 'rect2', 'rect3'];
    return arr[Math.floor(Math.random() * arr.length)];

}
function generateTriangle() {
    var arr = ['triangleL', 'triangleR'];
    return arr[Math.floor(Math.random() * arr.length)];
}

function position_object(el) {
    for (var lx = 0, ly = 0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {
        x: lx,
        y: ly
    };
}

function increaseSpeed() {
    // if(speed == 0){
    //     speed = 20;
    // }
    if(speed < 3){
        speed = 20;
    }
    speed -= 2;
    
    updateSpeed(speed);
}

function updateScore(shapeType) {
    if (shapeType === 'triangleL'){
        myScore += 5;
        triangleCounter += 1;
    }else{
        myScore++;
    }
    
    myScoreValue.innerHTML = myScore;

    if (myScore % scoreIncrement === 0) {
        increaseSpeed();
    }

    if (myScore >= 20) {
        // Enable triangles
        $('.triangleL').css('display', 'block');
        $('.triangleR').css('display', 'block');
    }

}

function updateSpeed(speed) {
    
    document.getElementById('speedValue').textContent = speed;
}

function updateElapsedTime() {
    if (!gameIsRunning) return;
    
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); 
    document.getElementById('timePlayed').textContent = `Time Played: ${elapsedTime} seconds`;

    if(elapsedTime >= gameDuration / 1000){
            gameOver();
    }

    // if (elapsedTime % 60 === 0 && elapsedTime !== triangleCounter) {
    //     if (triangleCounter < maxTriangles && myScore >= 10) {
    //         generateTriangle();
    //         triangleCounter = elapsedTime;
    //     }
    // }
  
    // Save elapsed time to local storage
    localStorage.setItem('elapsedTime', elapsedTime);

  }

function gameOver() {
    if (!gameOverflag){
        clearInterval(blue_moving);
        clearInterval(red_moving);

        $('.food').remove();
        $('.food1').remove();
        $('.stone').remove();
        $('.stone1').remove();
        $('.triangleL').remove();
        $('.triangleR').remove();


        var ovr = document.getElementById('over');
        ovr.style.display = "block";

        var currentScore = parseInt(myScoreValue.textContent);
        if (currentScore > highScore) {
            highScore = currentScore;
            highScoreElement.textContent = "High Score: " + highScore;

            localStorage.setItem("highScore", highScore);
        }

        // if (timeout) {
        //     gameOver();
        // }

        updateElapsedTime();
        gameIsRunning = false;

        gameOverflag = true
}
        if (triangleCounter >= 100) {
            var gameOverElement = document.getElementById('display');
            gameOverElement.textContent = "You Win";
        }

}

var blue_moving = setInterval(() => {


    let blue_shape = document.createElement("div");

    if (random_object() == "circle") {
        blue_shape.classList.add('food');
    } else if (random_object() == "rect" || random_object() == "rect2" || random_object() == "rect3") {
        blue_shape.classList.add('stone1');
    }
    else if(generateTriangle() == "triangleL" & myScore > 20){
        blue_shape.classList.add('triangleL');
        if(triangleCounter > 100){
            gameOver();
        }
    }

    blue_shape.style.left = random_position_blue() + '%';
    r_track.appendChild(blue_shape);
    let x = -90;


    var moving = setInterval(() => {
        blue_shape.style.top = x + "px";

        var blue_car_position = position_object(car1);
        var pos_blue = position_object(blue_shape);

        // console.log(blue_car_position['y'],pos_blue['y'])
        if (blue_car_position['y'] - 45 < pos_blue['y'] && blue_car_position['x'] == pos_blue['x']) {

            if (blue_shape.className == "food") {
                score.play();
                clearInterval(moving);
                // blue_shape.style.display = "block";
                blue_shape.parentNode.removeChild(blue_shape);
                valueInScreen = parseInt(myScoreValue.textContent);
                myScoreValue.innerHTML = valueInScreen + 1;
                // console.log(counter);
                lastScore.innerHTML = valueInScreen + 1;
                updateScore("circle");


            } else if (blue_shape.className == "stone1") {
                leftGOMusic.play();
                explode_right.style.display= 'block';
                explode_right.style.top= pos_blue['y']-50 +'px';
                explode_right.style.left=  pos_blue['x']-70 +'px';
                     setTimeout(()=>{
                        explode_right.style.display= 'none';
                },1000); 
                gameOver();
                car1.style.transform = "rotate(360deg)";
                $('blue_shape').remove();
                clearInterval(blue_moving);
                // blue_shape.style.display = "block";
            } else if (blue_shape.className == "triangleL") {
                score.play();
                clearInterval(moving);
                blue_shape.parentNode.removeChild(blue_shape);
                valueInScreen = parseInt(myScoreValue.textContent);
                myScoreValue.innerHTML = valueInScreen + 5; 
                lastScore.innerHTML = valueInScreen + 5; 
                updateScore("triangleL");
            }


            // console.log(counter);

        }

        if (x > window.innerHeight && blue_shape.className == "stone1") {
            clearInterval(moving);
            // blue_shape.style.display = "block";
            $('blue_shape').remove();

        } else if (x > window.innerHeight && blue_shape.className == "food") {
            clearInterval(moving);
            clearInterval(blue_moving);
            blue_shape.style.top = "90%";
            rightGOMusic.play();
            gameOver();

        } else if (x > window.innerHeight && blue_shape.className == "triangleL") {
            clearInterval(moving);
            clearInterval(blue_moving);
            blue_shape.style.top = "90%";
            $('.triangleL').remove();
            // rightGOMusic.play();
            // gameOver();

        }

        x = x + 10;

    }, speed);

}, 500);



var red_moving = setInterval(() =>

    {

        let red_shape = document.createElement("div");


        if (random_object() == "circle") {
            red_shape.classList.add('food1');
        } else if (random_object() == "rect" || random_object() == "rect2" || random_object() == "rect3") {
            red_shape.classList.add('stone');
        }
        else if(generateTriangle() == "triangleR" & myScore > 20){
            red_shape.classList.add('triangleR');
            if(triangleCounter > 100){
                // console.log(triangleCounter);
                gameOver();
            }
        }

        red_shape.style.left = random_position_red() + '%';
        b_track.appendChild(red_shape);
        let y = -90;


        var moving = setInterval(() => {
            red_shape.style.top = y + "px";
            var red_car_position = position_object(car2);
            var pos_red = position_object(red_shape);
            // console.log(red_car_position , pos_red)


            if (red_car_position['y'] - 45 < pos_red['y'] && red_car_position['x'] == pos_red['x']) {

                if (red_shape.className == "food1") {
                    score.play();
                    clearInterval(moving);
                    // red_shape.style.display = "block";
                    red_shape.parentNode.removeChild(red_shape);
                    $('red_shape').remove();
                    
                    valueInScreen = parseInt(myScoreValue.textContent);
                    myScoreValue.innerHTML = valueInScreen + 1;
                    // console.log(counter);
                    lastScore.innerHTML = valueInScreen + 1;

                    updateScore('circle');


                } else if (red_shape.className == "stone") {
                    leftGOMusic.play();
                    
   
                    explode_left.style.display= 'block';
                    explode_left.style.top= pos_red['y']-50 +'px';
                    explode_left.style.left=  pos_red['x']-70 +'px';
                                    setTimeout(()=>{
                    explode_left.style.display= 'none';
                    },1000); 
                    gameOver();
                    car2.style.transform = "rotate(360deg)";
                    $('red_shape').remove();
                    clearInterval(red_moving);
                    // red_shape.style.display = "block";
                }
                else if (red_shape.className == "triangleR") {
                    score.play();
                    clearInterval(moving);
                    red_shape.parentNode.removeChild(red_shape);
                    valueInScreen = parseInt(myScoreValue.textContent);
                    myScoreValue.innerHTML = valueInScreen + 5; 
                    lastScore.innerHTML = valueInScreen + 5; 
                    updateScore('triangleL');
                }


                // console.log(counter);

            }


            if (y > window.innerHeight && red_shape.className == "stone") {
                clearInterval(moving);
                // red_shape.style.display = "block";
                $('red_shape').remove();

            } else if (y > window.innerHeight && red_shape.className == "food1") {
                rightGOMusic.play();
                clearInterval(red_moving);
                clearInterval(moving);
                red_shape.style.top = "90%";
                gameOver();
            }
            else if (y > window.innerHeight && red_shape.className == "triangleR") {
                if(triangleCounter > 5){
                    // var gameOverElement = document.getElementById('display');
                    // gameOverElement.innerText = "You Win";
                    gameOver();
                }
                // rightGOMusic.play();
                clearInterval(red_moving);
                clearInterval(moving);
                red_shape.style.top = "90%";
                $('.triangleR').remove();
                // gameOver();
            }

            y = y + 10;

        }, speed);
    }, 500);



let bool1 = "F"
let bool2 = "T"

document.onkeydown = function(e) {
    switch (e.key) {


        case 'z':

            if (bool1 === "T") {
               
                car1.style.left = "35%";
                car1.style.transform = "rotate(40deg)";

                setTimeout(function() {
                    car1.style.transform = "rotate(0deg)";
                }, 250);


                bool1 = "F";

                break;
            } else if (bool1 === "F") {
                car1.style.transform = "rotate(-40deg)";
                setTimeout(function() {
                    car1.style.transform = "rotate(0deg)";
                }, 250);
                car1.style.left = "10%";
            }

            bool1 = "T";

            break;


        case 'm':

            if (bool2 === "T") {

                car2.style.left = "80%";
                car2.style.transform = "rotate(40deg)";

                setTimeout(function() {
                    car2.style.transform = "rotate(0deg)";
                }, 250);
                bool2 = "F";

                break;

            } else if (bool2 === "F") {
                car2.style.transform = "rotate(-40deg)";

                setTimeout(function() {
                    car2.style.transform = "rotate(0deg)";
                }, 250);

                car2.style.left = "55%";
                bool2 = "T";

            }
            break;

    }
}; 


let bool3 = "F"
let bool4 = "T"

rightTrack.addEventListener('touchstart', event => {

            if (bool3 === "T") {
                
                car1.style.left = "35%";
                car1.style.transform = "rotate(50deg)";

                setTimeout(function() {
                    car1.style.transform = "rotate(0deg)";
                }, 250);


                bool3 = "F";

                
            } else if (bool3 === "F") {
                car1.style.transform = "rotate(-50deg)";
                setTimeout(function() {
                    car1.style.transform = "rotate(0deg)";
                }, 250);
                car1.style.left = "10%";
                 bool3 = "T";
            }

           

            
})

leftTrack.addEventListener('touchstart', event => {
                if (bool4 === "T") {

                car2.style.left = "80%";
                car2.style.transform = "rotate(50deg)";

                setTimeout(function() {
                    car2.style.transform = "rotate(0deg)";
                }, 250);
                bool4 = "F";

                

            } else if (bool4 === "F") {
                car2.style.transform = "rotate(-50deg)";

                setTimeout(function() {
                    car2.style.transform = "rotate(0deg)";
                }, 250);

                car2.style.left = "55%";
                bool4 = "T";

            }
            
})



let isMovingLeft1 = false; 
let isMovingLeft2 = true; 

function toggleMoveLeft1() {
    isMovingLeft1 = !isMovingLeft1;
    moveCar1();
}

function toggleMoveLeft2() {
    isMovingLeft2 = !isMovingLeft2;
    moveCar2();
}



function moveCar1() {
    if (isMovingLeft1) {
        car1.style.left = "35%";
        car1.style.transform = "rotate(50deg)";

        setTimeout(function() {
            car1.style.transform = "rotate(0deg)";
        }, 250);

        isMovingLeft1 = false;
    } else if (!isMovingLeft1) {
        car1.style.transform = "rotate(-50deg)";
        setTimeout(function() {
            car1.style.transform = "rotate(0deg)";
        }, 250);
        car1.style.left = "10%";
        isMovingLeft1 = true;
    }
   
}

function moveCar2() {
    if (isMovingLeft2) {
        car2.style.left = "80%";
        car2.style.transform = "rotate(50deg)";

        setTimeout(function() {
            car2.style.transform = "rotate(0deg)";
        }, 250);
        isMovingLeft2 = false;
    } else if (!isMovingLeft2) {
        car2.style.transform = "rotate(-50deg)";

        setTimeout(function() {
            car2.style.transform = "rotate(0deg)";
        }, 250);

        car2.style.left = "55%";
        isMovingLeft2 = true;
    }
}

rightTrack.addEventListener('click', moveCar1);
leftTrack.addEventListener('click', moveCar2);