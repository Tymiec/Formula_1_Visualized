let main
let fps = 60
let percent = 0
let direction = 1
let totalLength = 0
let canvas
let ctx

checkMain = setInterval(function() {
    main = document.querySelector('main')
    
    if (main != null) {
        let wrapper = main.querySelector('div.wrapper')
        
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
            console.log(svg.querySelector('path').getTotalLength())
        })

    canvas = document.querySelector('canvas')
    path = canvas.getAttribute('data-path')
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 4

    let p = new Path2D(path)
    ctx.stroke(p)

    console.log(path)

    let commands = path.split(new RegExp('([A-Z]|[a-z])'))

    for (let i = 0; i < commands.length; i++)
        commands[i] = commands[i].split(new RegExp('(,|-)'))

    console.log(commands)

    // getTotalLenght
    let lastPoint = [0, 0]
    let lastControlPt = [0, 0]
    let lastCommand = ''
    let command = ''
    
    for (let i = 0; i < commands.length; i++) {
        if (Number.isNaN(Number(commands[i][0]))) {
            lastCommand = commands[i][0]
            i++

            if (lastCommand != undefined)
                command += lastCommand

            commands[i].forEach(element => {
                command += element
            })

            console.log(command)

            let controlPts = []

            for (let j = 0; j < commands[i].length; j++) {
                if (commands[i][j] == '-') {
                    j++
                    controlPts.push(-Number(commands[i][j]))
                } else if (Number.isInteger(Number(commands[i][j][0]))) {
                    controlPts.push(Number(commands[i][j]))
                }
            }

            switch (lastCommand) {
                case 'M':
                    lastPoint[0] = controlPts[0]
                    lastPoint[1] = controlPts[1]
                    break
                case 'm':
                    lastPoint[0] = lastPoint[0] + controlPts[0]
                    lastPoint[1] = lastPoint[1] + controlPts[1]
                    break
                case 'L':
                    totalLength += getLineLenght(lastPoint[0], lastPoint[1], controlPts[0], controlPts[1])
                    console.log('L totalLenght = ', totalLength)
                    
                    lastPoint[0] = controlPts[0]
                    lastPoint[1] = controlPts[1]
                    break
                case 'l':
                    totalLength += getLineLenght(lastPoint[0], lastPoint[1], lastPoint[0] + controlPts[0], lastPoint[1] + controlPts[1])
                    console.log('l totalLenght = ', totalLength)
                    
                    lastPoint[0] = lastPoint[0] + controlPts[0]
                    lastPoint[1] = lastPoint[1] + controlPts[1]
                    break
                case 'C':
                    totalLength += getCubicBezierLength(/* currentPt.x */ lastPoint[0], /* currentPt.y */ lastPoint[1], /* startControlPt.x */ controlPts[0], /* startControlPt.y */ controlPts[1], /* endControlPt.x */ controlPts[2], /* endControlPt.y */ controlPts[3], /* endPt.x */ controlPts[4], /* endPt. */ controlPts[5])
                    console.log('C totalLenght = ', totalLength)

                    lastControlPt[0] = controlPts[2]
                    lastControlPt[1] = controlPts[3]
                    
                    lastPoint[0] = controlPts[0]
                    lastPoint[1] = controlPts[1]
                    break
                case 'c':
                    totalLength += getCubicBezierLength(lastPoint[0], lastPoint[1], lastPoint[0] + controlPts[0], lastPoint[1] + controlPts[1], lastPoint[0] + controlPts[2], lastPoint[1] + controlPts[3], lastPoint[0] + controlPts[4], lastPoint[1] + controlPts[5])
                    console.log('c totalLenght = ', totalLength)

                    lastControlPt[0] = controlPts[2]
                    lastControlPt[1] = controlPts[3]
                    
                    lastPoint[0] = lastPoint[0] + controlPts[0]
                    lastPoint[1] = lastPoint[1] + controlPts[1]
                    break
                case 'S':
                    if (lastCommand == 'C' || lastCommand == 'c' || lastCommand == 'S' || lastCommand == 's') {
                        totalLength += getCubicBezierLength(lastPoint[0], lastPoint[1], lastControlPt[0], lastControlPt[1], controlPts[0], controlPts[1], controlPts[2], controlPts[3], 40)
                    } else {
                        console.log('Last command was not Cubic Bezier') // Shouldn't happen (90% sure?)
                        totalLength += getCubicBezierLength(lastPoint[0], lastPoint[1], lastPoint[0], lastPoint[1], controlPts[0], controlPts[1], controlPts[2], controlPts[3], 40)
                    }

                    console.log('S totalLenght = ', totalLength)

                    lastControlPt[0] = controlPts[2]
                    lastControlPt[1] = controlPts[3]

                    lastPoint[0] = controlPts[0]
                    lastPoint[1] = controlPts[1]
                    break
                case 's':
                    if (lastCommand == 'C' || lastCommand == 'c' || lastCommand == 'S' || lastCommand == 's') {
                        totalLength += getCubicBezierLength(/* currentPt.x */ lastPoint[0], /* currentPt.y */ lastPoint[1], /* .x */ lastPoint[0] - lastControlPt[0], /* .y */ lastPoint[1] - lastControlPt[1], /* currentPt.x + dx2 */ lastPoint[0] + controlPts[0], /* currentPt.y + dy2 */ lastPoint[1] + controlPts[1], /* currentPt.x + dx */ lastPoint[0] + controlPts[2], /* currentPt.y + dy */ lastPoint[1] + controlPts[3], 40)
                    } else {
                        console.log('Last command was not Cubic Bezier') // Shouldn't happen (90% sure?)
                        totalLength += getCubicBezierLength(lastPoint[0], lastPoint[1], lastPoint[0], lastPoint[1], lastPoint[0] + controlPts[0], lastPoint[1] + controlPts[1], lastPoint[0] + controlPts[2], lastPoint[1] + controlPts[3], 40)
                    }

                    console.log('s totalLenght = ', totalLength)

                    lastControlPt[0] = controlPts[2]
                    lastControlPt[1] = controlPts[3]
                    
                    lastPoint[0] = lastPoint[0] + controlPts[0]
                    lastPoint[1] = lastPoint[1] + controlPts[1]
                    break
            }
        }
    }

    console.log(totalLength)

    // start the animation
    // animate()
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
    let xy


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

function getLineLenght(x1, y1, x2, y2) {
    return Math.sqrt( ( (x2 - x1) * (x2 - x1) ) + ( (y2 - y1) * (y2 - y1) ) )
}

function getQuadraticBezierLength(x1, y1, x2, y2, x3, y3) {
    let a, e, c, d, u, a1, e1, c1, d1, u1, v1x, v1y

    v1x = x2 * 2
    v1y = y2 * 2
    d = x1 - v1x + x3
    d1 = y1 - v1y + y3
    e = v1x - 2 * x1
    e1 = v1y - 2 * y1
    c1 = (a = 4 * (d * d + d1 * d1))
    c1 += (b = 4 * (d * e + d1 * e1))
    c1 += (c = e * e + e1 * e1)
    c1 = 2 * Math.sqrt(c1)
    a1 = 2 * a * (u = Math.sqrt(a))
    u1 = b / u
    a = 4 * c * a - b * b
    c = 2 * Math.sqrt(c)

    return (a1 * c1 + u * b * (c1 - c) + a * Math.log((2 * u + u1 + c1) / (u1 + c))) / (4 * a1)
} 

function getCubicBezierLength(Ax, Ay, Bx, By, Cx, Cy, Dx, Dy, sampleCount) {
    var ptCount = sampleCount || 40
    var totDist = 0
    var lastX = Ax
    var lastY = Ay
    var dx, dy

    for (var i = 1; i < ptCount; i++) {
        var pt = cubicQxy(i / ptCount, Ax, Ay, Bx, By, Cx, Cy, Dx, Dy)
        dx = pt.x - lastX
        dy = pt.y - lastY
        totDist += Math.sqrt(dx * dx + dy * dy)
        lastX = pt.x
        lastY = pt.y
    }

    dx = Dx - lastX
    dy = Dy - lastY

    totDist += Math.sqrt(dx * dx + dy * dy)
    return totDist
}

function cubicQxy(t, ax, ay, bx, by, cx, cy, dx, dy) {
    ax += (bx - ax) * t
    bx += (cx - bx) * t
    cx += (dx - cx) * t
    ax += (bx - ax) * t
    bx += (cx - bx) * t
    ay += (by - ay) * t
    by += (cy - by) * t
    cy += (dy - cy) * t
    ay += (by - ay) * t
    by += (cy - by) * t

    return ({
        x: ax + (bx - ax) * t,
        y: ay + (by - ay) * t
    })
}