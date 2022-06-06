let main
let canvas
let ctx

let percent = 0
let pathSegments = []

let simSpeed = 6

class Driver {
    constructor(id, name, lapTimes, hue) {
        console.log(id)
        this.id = id
        this.name = name
        this.lapTimes = lapTimes
        this.colour = this.hslToHex(hue, 100, 50)

        this.lap = 1
        this.time = []
        this.percent = 0
        this.prevPercent = -Infinity
        
        for (let i = 0; i < lapTimes.length; i++) {
            this.time[i] = 0

            for (let j = 0; j < i; j++)
                this.time[i] += Number(lapTimes[j])
        }
    }

    hslToHex(h, s, l) {
        l /= 100
        const a = s * Math.min(l, 1 - l) / 100
        
        const f = n => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')   // convert to Hex and prefix "0" if needed
        }

        return `#${f(0)}${f(8)}${f(4)}`
    }
}

customOnLoad = setInterval(function () {
    main = document.querySelector('main')
    
    if (main != null) {
        loadTrack(20)
        loadRaces()
        loadDrivers('2017', 'British Grand Prix')
        clearInterval(customOnLoad)
    }
}, 300)

async function loadTrack(circuitId) {
    await fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/lap%20vis/svg/' + circuitId + '.svg')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(xml => {
            path = xml.querySelector('svg path#track').getAttribute('d')
            let canvas = document.querySelector('canvas#track')
            canvas.setAttribute('data-path', path)

            let svg = xml.querySelector('svg')
            main = document.querySelector('main')
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
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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

function loadRaces() {
    fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/races.csv')
        .then(response => response.text())
        .then(text => processCSV(text))
        .then(data => {
            const yearSelector = document.querySelector('main nav div#yearSelector select')
            const trackSelector = document.querySelector('main nav div#trackSelector select')
            let groups = yearSelector.querySelectorAll('optgroup')

            for (let i = 1996; i < 2022; i++) {
                let option = document.createElement('option')
                option.innerHTML = i

                if (i < 2004) 
                    groups[0].appendChild(option)
                else if (i < 2013)
                    groups[1].appendChild(option)
                else
                    groups[2].appendChild(option)
            }

            yearSelector.addEventListener('change', function () {
                trackSelector.innerHTML = ''

                for (let i = 0; i < data.length; i++)
                    if (data[i].year == this.value)
                        createOption(data[i].name, data[i].circuitId)
            })

            trackSelector.addEventListener('change', function () {
                loadTrack(this.value)
            })
        })
}

function loadDrivers(year, GP) {
    fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/GPs/' + year + ' ' + GP + '.csv')
        .then(response => response.text())
        .then(text => processCSV(text))
        .then(data => {
            console.log(data)
            let driversLaps = {}

            data.forEach(el => {
                if (!(el['driverId'] + ' ' + el['DriverName2'] in driversLaps))
                    driversLaps[el.driverId + ' ' + el.DriverName2] = []

                driversLaps[el.driverId + ' ' + el.DriverName2].push(el['milliseconds'])
            })

            let drivers = []
            let hue = 0

            for (driver in driversLaps) {
                let id = driver.match(/\d/g)
                id = id.join('')
                
                let name = driver.match(/[a-zA-Z]/g)
                name = name.join('')

                drivers.push(new Driver(id, name, driversLaps[driver], hue))

                hue += Object.keys(driversLaps).length
            }

            animate(simSpeed / 16, drivers)
        })
}


function animate(playbackSpeed, drivers) {
    percent += playbackSpeed
    draw(percent, drivers)
    setTimeout(function () { requestAnimationFrame(function() { animate(simSpeed / 16, drivers)  }) }, 16)
}

function draw(sliderValue, drivers) {
    let canvas = document.querySelector('canvas#drivers')
    let ctx = canvas.getContext('2d')
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 4

    let minTime = Infinity

    drivers.forEach(driver => {
        if (driver.time[driver.lap] < minTime)
            minTime = driver.time[driver.lap]
    })

    drivers.forEach(driver => {
        // draw the tracking rectangle
        let sumPercent = 0
        let index = 0
        let startPoint = [ NaN, NaN ]

        let delta = (driver.time[driver.lap] - minTime) / minTime * 100 // FIXME: delta should increase overtime to reach max at the end of the lap
        driver.prevPercent = driver.percent
        driver.percent = (sliderValue - delta) % 100

        /*
        if (driver.prevPercent > driver.percent && driver.percent > 0) {
            driver.lap++
            console.log(driver.id, driver.percent, driver.prevPercent)
        }
        */

        while (driver.percent > sumPercent) {
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
    
        let tempPercent = (driver.percent - pathSegments[index - 1]['accumulatedPercent']) / (pathSegments[index]['percent'])
        let xy = { x: undefined, y: undefined }
    
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
    
        drawDot(xy, driver.colour, ctx)
    })
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

    return lines
}

function isLineCommand(command) { return (command.toLocaleLowerCase() == 'l' || command.toLocaleLowerCase() == 'h' || command.toLocaleLowerCase() == 'v') }
function isCubicCommand(command) { return (command.toLocaleLowerCase() == 's' || command.toLocaleLowerCase() == 'c') }

function createOption(name, circuitId) {
    let option = document.createElement('option')
    name = name.replaceAll('"', '')
    option.value = circuitId
    option.innerHTML = name
    document.querySelector('main nav div#trackSelector select').appendChild(option)
}

function groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
    }, {})
}