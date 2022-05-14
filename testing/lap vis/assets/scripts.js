let main
let canvas
let ctx

let percent = 0
let pathSegments = []

let simSpeed = 6

chstomOnLoad = setInterval(function() {
    main = document.querySelector('main')
    
    if (main != null) {
        loadTrack()
        // loadDrivers()
        animate(1 / simSpeed)
        clearInterval(chstomOnLoad)
    }
}, 300)

async function loadTrack() {
    await fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/lap%20vis/svg/20.svg')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(xml => {
            path = xml.querySelector('svg path#track').getAttribute('d')
            let canvas = document.querySelector('canvas#track')
            canvas.setAttribute('data-path', path)

            // TESTING
            
            let driverCanvas = document.querySelector('canvas#driver')
            driverCanvas.setAttribute('width', size[2])
            driverCanvas.setAttribute('height', size[3])

            // TESTING

            let svg = xml.querySelector('svg')
            let main = document.querySelector('main')
            main.appendChild(svg)
            svg.style.display = 'none'
        })
    
    const speedSelector = document.querySelector('#speedSelector')

    speedSelector.addEventListener('input', function() { 
        simSpeed = Math.pow(2, this.querySelector('input').value)
        this.querySelector('span').innerHTML = 'x' + simSpeed
    })

    canvas = document.querySelector('canvas#track')
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
    
    pathSegments = [] // TODO: change controlPoints to absolute (not relative) points and change S/s to C/c
    let currentPoint = [0, 0]
    let previousSegment

    for (let i = 0; i < commands.length; i++) {
        if (Number.isNaN(Number(commands[i]))) {
            i++
            
            let pathSegment = { command: '',  controlPt0: NaN, controlPt1: NaN, controlPt2: NaN, controlPt3: NaN, controlPt4: NaN, controlPt5: NaN, percent: NaN, accumulatedPercent: NaN, org: '' } 
            pathSegment['command'] = commands[i - 1]
            pathSegment['org'] = commands[i]
            
            let controlPts = commands[i].split(new RegExp('(,|-)'))
            let counter = 0
            
            for (let j = 0; j < controlPts.length; j++) {
                let negativeMultiplier = 1
                
                if (controlPts[j] == '-') {
                    j++
                    negativeMultiplier = -1
                }
                
                if (!isNaN(controlPts[j]) && !isNaN(parseFloat(controlPts[j]))) {
                    if (pathSegment['command'].toLocaleLowerCase() == 's' && counter == 0) {
                        if (isCubicCommand(previousSegment['command'])) {
                            let delta = previousSegment['controlPt4'] - previousSegment['controlPt2']
                            pathSegment['controlPt' + counter] = previousSegment['controlPt4'] + delta
                            counter++
                            
                            delta = previousSegment['controlPt5'] - previousSegment['controlPt3']
                            pathSegment['controlPt' + counter] = previousSegment['controlPt5'] + delta
                            counter++
                        } else {
                            pathSegment['controlPt' + counter] = currentPoint[0]
                            counter++
                            
                            pathSegment['controlPt' + counter] = currentPoint[1]
                            counter++
                        }
                    } else if (pathSegment['command'].toLocaleLowerCase() == 'h' && counter == 0) {
                        pathSegment['controlPt1'] = currentPoint[1]
                    } else if (pathSegment['command'].toLocaleLowerCase() == 'v' && counter == 0) {
                        pathSegment['controlPt0'] = currentPoint[0]
                    }

                    if (pathSegment['command'] == pathSegment['command'].toLocaleLowerCase()) {
                        pathSegment['controlPt' + counter] = (currentPoint[counter % 2] + (Number(controlPts[j])) * negativeMultiplier)
                    } else {
                        pathSegment['controlPt' + counter] = (Number(controlPts[j]) * negativeMultiplier)
                    }

                    previousSegment = pathSegment
                    counter++
                }
            }

            if (pathSegment['command'].toLocaleLowerCase() == 'h' || pathSegment['command'].toLocaleLowerCase() == 'v')
                counter++

            currentPoint = [pathSegment['controlPt' + (counter - 2)], pathSegment['controlPt' + ((counter - 2) + 1)]]

            accumulatedPath += commands[i - 1] + commands[i]
            let dummyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            dummyPath.setAttribute('d', accumulatedPath)
            
            let totalLenght = Number(dummyPath.getTotalLength()) * 100
            pathSegment['percent'] = (totalLenght - previousTotalLength) / fullPathTotalLenght
            pathSegment['accumulatedPercent'] = totalLenght / fullPathTotalLenght
            previousTotalLength = totalLenght

            pathSegments.push(pathSegment)
        }
    }

    console.log(pathSegments)
}

async function loadDrivers() {
    await fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/lap_times_named_2.csv')
        .then(response => response.text())
        .then(text => processCSV(text))
        .then(data => {

        })
}

function animate(playbackSpeed) {
    // set the animation position (0-100)
    percent += playbackSpeed

    if (percent > 100) {
        percent = 0
    }

    draw(percent)

    // request another frame
    setTimeout(function () { requestAnimationFrame(function() { animate(simSpeed / 16)  }) }, 16)
}

// draw the current frame based on sliderValue
function draw(sliderValue, driver) {
    let canvas = document.querySelector('canvas#driver')
    let ctx = canvas.getContext('2d')
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 4

    // draw the tracking rectangle
    let sumPercent = 0
    let index = 0
    let startPoint = [ NaN, NaN ]
    
    while (sliderValue > sumPercent) {
        if (index == pathSegments.length) // Prevent errors caused by rounding error
            break
        
        if (!Number.isNaN(pathSegments[index]['percent']))
            sumPercent += pathSegments[index++]['percent']
    }
    
    index--
    let previousSegment = pathSegments[index - 1]
    
    if (previousSegment == undefined) 
        return

    if (previousSegment['command'].toLocaleLowerCase() == 'm' || previousSegment['command'].toLocaleLowerCase() == 'l')
        startPoint = [previousSegment['controlPt0'], previousSegment['controlPt1']]
    else if (previousSegment['command'].toLocaleLowerCase() == 'c') 
        startPoint = [previousSegment['controlPt4'], previousSegment['controlPt5']]
    else if (previousSegment['command'].toLocaleLowerCase() == 's') 
        startPoint = [previousSegment['controlPt2'], previousSegment['controlPt3']]

    let tempPercent = (sliderValue - pathSegments[index - 1]['accumulatedPercent']) / (pathSegments[index]['percent'])

    if (isLineCommand(pathSegments[index]['command'])) {
        xy = getLineXYatPercent({ x: startPoint[0], y: startPoint[1] }, { x: pathSegments[index]['controlPt0'], y: pathSegments[index]['controlPt1'] }, tempPercent)
    } else if (pathSegments[index]['command'].toLocaleLowerCase() == 'c') {  
        xy = getCubicBezierXYatPercent(
            { x: startPoint[0], y: startPoint[1] }, 
            { x: pathSegments[index]['controlPt0'], y: pathSegments[index]['controlPt1'] },
            { x: pathSegments[index]['controlPt2'], y: pathSegments[index]['controlPt3'] },
            { x: pathSegments[index]['controlPt4'], y: pathSegments[index]['controlPt5'] },
        tempPercent)
    } else if (pathSegments[index]['command'].toLocaleLowerCase() == 's') {
        xy = getCubicBezierXYatPercent(
            { x: startPoint[0], y: startPoint[1] }, 
            { x: pathSegments[index]['controlPt0'], y: pathSegments[index]['controlPt1'] },
            { x: pathSegments[index]['controlPt2'], y: pathSegments[index]['controlPt3'] },
            { x: pathSegments[index]['controlPt4'], y: pathSegments[index]['controlPt5'] },
        tempPercent)
    }

    drawDot(xy, '#f00', ctx)
}

// draw tracking dot at xy
function drawDot(point, color, ctx) {
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

function processCSV(allText) {
    let allTextLines = allText.split(/\r\n|\n/)
    let headers = allTextLines[0].split(',')
    let lines = []

    for (let i = 1; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(',')

        if (data.length == headers.length) {
            let tarr = {}

            for (let j = 0; j < headers.length; j++)
                tarr[headers[j]] = data[j]

            lines.push(tarr)
        }
    }

    console.log(lines)
    return lines
}

function isLineCommand(command) { return (command.toLocaleLowerCase() == 'l' || command.toLocaleLowerCase() == 'h' || command.toLocaleLowerCase() == 'v') }
function isCubicCommand(command) { return (command.toLocaleLowerCase() == 's' || command.toLocaleLowerCase() == 'c') }