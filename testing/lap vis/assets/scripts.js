let main
let canvas
let ctx

let fps = 60
let percent = 0
let direction = 1
let pathSegments = []

checkMain = setInterval(function() {
    main = document.querySelector('main')
    
    if (main != null) {
        loadTrack()
        clearInterval(checkMain)
    }
}, 300)

async function loadTrack() {
    await fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/f7b328f0198cfdab2c7d2356597418cd5a12d46f/testing/lap%20vis/N%C3%BCrburgring.svg')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(xml => {
            path = xml.querySelector('svg path').getAttribute('d')
            let canvas = document.querySelector('canvas')
            canvas.setAttribute('data-path', path)

            let svg = xml.querySelector('svg')
            let main = document.querySelector('main')
            main.appendChild(svg)
            svg.style.display = 'none'
        })

    canvas = document.querySelector('canvas')
    path = canvas.getAttribute('data-path')
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 4

    let p = new Path2D(path)
    ctx.stroke(p)
    
    let commands = path.split(new RegExp('([a-zA-Z])'))
    let accumulatedPath = ''

    let dummyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    dummyPath.setAttribute('d', path)
    let fullPathTotalLenght = Number(dummyPath.getTotalLength())
    let previousTotalLength = 0

    pathSegments = [] // TODO: change controlPoints to absolute (not relative) points
    let lastPathSegment = []
    
    for (let i = 0; i < commands.length; i++) {
        if (Number.isNaN(Number(commands[i]))) {
            i++

            let pathSegment = { 
                command: '0', 
                controlPt0: NaN,
                controlPt1: NaN,
                controlPt2: NaN,
                controlPt3: NaN,
                controlPt4: NaN,
                controlPt5: NaN,
                length: NaN
            } 

            pathSegment['command'] = commands[i - 1]

            let controlPts = commands[i].split(new RegExp('(,|-)'))
            let counter = 0
            
            for (let j = 0; j < controlPts.length; j++) {
                if (controlPts[j] == '-') {
                    j++
                    pathSegment['controlPt' + counter++] = -Number(controlPts[j])
                } else if (Number.isInteger(Number(controlPts[j][0]))) {
                    pathSegment['controlPt' + counter++] = Number(controlPts[j])
                }
            }
            
            accumulatedPath += commands[i - 1] + commands[i]
            let dummyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            dummyPath.setAttribute('d', accumulatedPath)
            
            let totalLenght = Number(dummyPath.getTotalLength())
            pathSegment['length'] = (totalLenght - previousTotalLength) / fullPathTotalLenght
            previousTotalLength = totalLenght

            pathSegments.push(pathSegment)
        }
    }

    // start the animation
    animate()
}

function animate() {
    // set the animation position (0-100)
    percent += direction

    if (percent > 100) {
        percent = 0
    }

    draw(percent)

    // request another frame
    setTimeout(function () {
        requestAnimationFrame(animate)
    }, 1000 / fps)
}


// draw the current frame based on sliderValue
function draw(sliderValue) {
    let canvas = document.querySelector('canvas')
    let ctx = canvas.getContext('2d')
    
    // redraw path
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 4

    path = canvas.getAttribute('data-path')
    let p = new Path2D(path)
    ctx.stroke(p)

    // draw the tracking rectangle
    let sumPercent = 0
    let index = 0
    
    while (sliderValue > sumPercent) {
        if (index == pathSegments.length)
            break
        
        if (!Number.isNaN(pathSegments[index].length))
            sumPercent += pathSegments[index++].length * 100
    }
    
    index--
    console.log(pathSegments[index])

    /*
    if (sliderValue < 25) {
        var percent = sliderValue / 24;
        xy = getLineXYatPercent({
            x: 100,
            y: 20
        }, {
            x: 200,
            y: 160
        }, percent);
    } else if (sliderValue < 50) {
        var percent = (sliderValue - 25) / 24
        xy = getQuadraticBezierXYatPercent({
            x: 200,
            y: 160
        }, {
            x: 230,
            y: 200
        }, {
            x: 250,
            y: 120
        }, percent);
    } else if (sliderValue < 75) {
        var percent = (sliderValue - 50) / 24
        xy = getCubicBezierXYatPercent({
            x: 250,
            y: 120
        }, {
            x: 290,
            y: -40
        }, {
            x: 300,
            y: 200
        }, {
            x: 400,
            y: 150
        }, percent);
    } else {
        var percent = (sliderValue - 75) / 25
        xy = getLineXYatPercent({
            x: 400,
            y: 150
        }, {
            x: 500,
            y: 90
        }, percent);
    }
    */

    drawDot(xy, '#f00')
}

// draw tracking dot at xy
function drawDot(point, color) {
    let canvas = document.querySelector('canvas')
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
}

// line: percent is 0-1
function getLineXYatPercent(startPt, endPt, percent) {
    let dx = endPt.x - startPt.x
    let dy = endPt.y - startPt.y
    let X = startPt.x + dx * percent
    let Y = startPt.y + dy * percent

    return ({
        x: X,
        y: Y
    })
}

// quadratic bezier: percent is 0-1
function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    let x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x
    let y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y

    return ({
        x: x,
        y: y
    })
}

// cubic bezier percent is 0-1
function getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
    let x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x)
    let y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y)

    return ({
        x: x,
        y: y
    })
}

// cubic helper formula at percent distance
function CubicN(pct, a, b, c, d) {
    let t2 = pct * pct
    let t3 = t2 * pct
    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3
}