let userCurrentPosition = [230, 10]
let ballCurrentPosition = [245, 50]
let hDirection = 2
let vDirection = 2
const grid = document.querySelector('.grid')

class Block{
    constructor(x,y){
        this.bottomLeft = [x, y]
        this.bottomRight = [x + 100, y]
        this.topLeft = [x, y + 20]
        this.topRight = [x + 100, y + 20]
    }
}

const blocks = []

for (let i = 0; i < 5; i++) {
    for(let j = 0; j < 3; j++ ){
        blocks.push(new Block(10 + 110*i, 270 - 30*j))
    }
  }
  

function addBlocks(){
    blocks.forEach(element => {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = element.bottomLeft[0] + 'px'
        block.style.bottom = element.bottomLeft[1] + 'px'

        grid.appendChild(block)
        
    });
}

addBlocks()



//add user
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

document.addEventListener('keydown', moveUser)
window.addEventListener('deviceorientation', handleOrientation)

function drawUser(){
    user.style.left = userCurrentPosition[0] + 'px'
    user.style.bottom = userCurrentPosition[1] + 'px'
}


function doOnOrientationChange() {
    switch(window.orientation) {  
      case -90: case 90:
        alert('landscape');
        break; 
      default:
        alert('portrait');
        break; 
    }
}
  
window.addEventListener('orientationchange', doOnOrientationChange);
  
// Initial execution if needed
doOnOrientationChange();

function moveUser(e){
    switch (e.key){
        case 'ArrowLeft':
            if(userCurrentPosition[0] > 0){
                userCurrentPosition[0] -= 20
            }
            break;
        case 'ArrowRight':
            let effectiveWidth = parseInt(getComputedStyle(grid).width) - parseInt(getComputedStyle(user).width)
            if(userCurrentPosition[0] < effectiveWidth){
                userCurrentPosition[0] += 20
            }
            break;
    }

    drawUser()
}

function handleOrientation(event){
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    alert('hey')
  
    if(gamma > 30){
        userCurrentPosition[0] -= 20
    } else if (gamma<-30){
        userCurrentPosition[0] += 20
    }


}

const ball = document.createElement('div')
ball.classList.add('ball')
grid.append(ball)
drawBall()

function drawBall(){
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

const gameLoop = setInterval(ballMovment, 15)

function ballMovment(){
    //Check collision with ceiling
    if(parseInt(getComputedStyle(grid).height) - parseInt(getComputedStyle(ball).height) < parseInt(getComputedStyle(ball).bottom))
    {
        vDirection = -1*vDirection
    }

    if(parseInt(getComputedStyle(grid).width) - parseInt(getComputedStyle(ball).width) < parseInt(getComputedStyle(ball).left))
    {
        hDirection = -1*hDirection
    }

    if(0 > parseInt(getComputedStyle(ball).left))
    {
        hDirection = -1*hDirection
    }
    
    if( parseInt(getComputedStyle(user).bottom) + parseInt(getComputedStyle(user).height) > parseInt(getComputedStyle(ball).bottom) && 
        parseInt(getComputedStyle(user).left) < parseInt(getComputedStyle(ball).left) &&
        parseInt(getComputedStyle(user).left) + parseInt(getComputedStyle(user).width)  > parseInt(getComputedStyle(ball).left)){
            vDirection = -1*vDirection
        }
    
    blocks.forEach(element => {
        if(element.bottomLeft[0] < parseInt(getComputedStyle(ball).left) && element.topRight[0] > parseInt(getComputedStyle(ball).left)+10
        && ((parseInt(getComputedStyle(ball).bottom) < element.topRight[1] && (parseInt(getComputedStyle(ball).bottom) > element.bottomRight[1]) || (parseInt(getComputedStyle(ball).bottom) + 10 > element.bottomLeft[1] && parseInt(getComputedStyle(ball).bottom) + 10 < element.topLeft[1]))    ))
        {
            vDirection = -1*vDirection
            //console.log(blocks.indexOf(element))
            Array.from(document.querySelectorAll('.block'))[blocks.indexOf(element)].classList.remove('block')

            //blocks[blocks.indexOf(element)].classList.remove('block')
            blocks.splice(blocks.indexOf(element),1)
        }

        // if(element.bottomLeft[1] < parseInt(getComputedStyle(ball).bottom) && element.topRight[1] > parseInt(getComputedStyle(ball).bottom)+10
        // && (parseInt(getComputedStyle(ball).left) + 10 > element.bottomLeft[0] || parseInt(getComputedStyle(ball).left) < element.topRight[0]))
        // {
        //     hDirection = -1*hDirection
        //     //console.log(blocks.indexOf(element))
        //     Array.from(document.querySelectorAll('.block'))[blocks.indexOf(element)].classList.remove('block')

        //     //blocks[blocks.indexOf(element)].classList.remove('block')
        //     blocks.splice(blocks.indexOf(element),1)
        // }  

    });



    if(parseInt(getComputedStyle(ball).bottom)<0)
    {
        //alert('you lose')
        //clearInterval(gameLoop)
    } 

    if(blocks.length == 0){
        alert('you win')
        clearInterval(gameLoop)

    }

    ballCurrentPosition[0] += hDirection
    ballCurrentPosition[1]+= vDirection
    drawBall()
}
