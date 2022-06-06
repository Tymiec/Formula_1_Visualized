let main

customOnLoad = setInterval(function() {
    main = document.querySelector('main')
    
    if (main != null) {
        let wrapper = main.querySelector('div.wrapper')

        fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/f7b328f0198cfdab2c7d2356597418cd5a12d46f/testing/lap%20vis/N%C3%BCrburgring.svg')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(xml => {
            // Insert track
            svg = xml.querySelector('svg')

            // Ainmate driver
            svg.querySelector('path').id = 'track'
            addCircle(svg, '#f00', 180000)
            wrapper.innerHTML = ''
            wrapper.appendChild(svg)

            svg.innerHTML = svg.innerHTML // HACK

            // Event Listeners
            const playbackSpeedInput = document.querySelector('main nav div#speed input')
            
            playbackSpeedInput.addEventListener('input', function() {
                document.querySelector('main nav div#speed span').innerHTML = 'x' + Math.pow(2, this.value)
            })

            animations = document.querySelectorAll('animateMotion')
    
            animations.forEach(element => {
                element.addEventListener('repeatEvent', function() {
                    const playbackSpeedInput = document.querySelector('main nav div#speed input')
                    const playbackSpeed = Math.pow(2, playbackSpeedInput.value)
                    let initialDur = this.getAttribute('data-dur')
                    initialDur = initialDur.replace('ms', '')
                    this.setAttribute('dur', Number(initialDur) * 1 / Number(playbackSpeed) + 'ms')
                })
            })
        })
        
        Promise.all([
            fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/circuits.csv')
            .then(response => response.text())
            .then(text => processCSV(text)),
    
            fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/races.csv')
            .then(response => response.text())
            .then(text => processCSV(text)),
            
            fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/lap_times_named.csv')
            .then(response => response.text())
            .then(text => processCSV(text))
        ]).then(data => {
            let circuits
            let races
            let lapTimes

            // Fail safe, odpowiednie przypisanie zmiennych
            data.forEach(element => {
                if (element.length < 100)
                    circuits = element
                else if (element.length > 10000)
                    lapTimes = element
                else
                    races = element
            })
            
            const yearSelector = document.querySelector('main nav div#year input')
            
            yearSelector.addEventListener('change', function () {
                trackSelector.innerHTML = ''

                for (let i = 0; i < races.length; i++)
                    if (races[i].year == this.value)
                        for (let j = 0; j < circuits.length; j++)
                            if (races[i].circuitId == circuits[j].circuitId)
                                createOption(circuits[j].name, circuits[j].circuitId)
            })

            const trackSelector = document.querySelector('main nav div#track select')

            trackSelector.addEventListener('change', function () {
                getTrack(this, races, lapTimes)
            })
        })

        clearInterval(customOnLoad)
    }
}, 300)

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

function addCircle(svg, color, dur) {
    svg.setAttribute('data-lap', 0)
    svg.setAttribute('data-speed', 16)

    let circle = document.createElement('circle')
    circle.setAttribute('r', '6')
    circle.setAttribute('fill', color)

    let animateMotion = document.createElement('animateMotion')
    animateMotion.setAttribute('dur', dur / 16 + 'ms')
    animateMotion.setAttribute('repeatCount', 'indefinite')
    animateMotion.setAttribute('data-dur', dur + 'ms')
    animateMotion.setAttribute('data-lap', 0)

    let mpath = document.createElement('mpath')
    mpath.setAttribute('xlink:href', '#track')

    animateMotion.appendChild(mpath)
    circle.appendChild(animateMotion)
    svg.appendChild(circle)
}

function createOption(name, circuitId) {
    let option = document.createElement('option')
    name = name.replaceAll('"', '')
    let value = [name, circuitId]
    option.value = value
    option.innerHTML = name
    document.querySelector('main nav div#track select').appendChild(option)
}

function getTrack(trackSelector, races, lapTimes) {
    let vals = trackSelector.value
    let temp = vals.split(',')
    trackName = temp[0]
    circuitId = temp[1]
    
    fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/f7b328f0198cfdab2c7d2356597418cd5a12d46f/testing/lap%20vis/' + trackName + '.svg')
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(xml => {
        let wrapper = document.querySelector('main div.wrapper')
        // Insert track
        svg = xml.querySelector('svg')

        // Ainmate driver
        svg.querySelector('path').id = 'track'
        
        const year = document.querySelector('main nav div#year input').value
        let raceId
    
        for (let i = 0; i < races.length; i++) {
            if (races[i].year == year && races[i].circuitId == circuitId) {
                raceId = races[i].raceId
                break
            }
        }

        const colours = ['#f2003c', '#f85900', '#f28800', '#f2ab00', '#efcc00', '#f0ea00', '#b1d700', '#00ca24', '#00a877', '#00a78a', '#00a59c', '#00a3ac', '#0093af', '#0082b2', '#006ebf', '#7d00f8', '#9f00c5', '#b900a6', '#d00081', '#e20064']
        let drivers = []

        for (let i = 0; i < lapTimes.length; i++) {
            if (lapTimes[i].raceId == raceId) {
                if (drivers[lapTimes[i].DriverName2] == undefined)
                    drivers[lapTimes[i].DriverName2] = new Array()

                drivers[lapTimes[i].DriverName2].push(lapTimes[i].milliseconds)
            }
        }

        console.log(drivers)
        let colourIndex = 0

        for (const key in drivers) {
            if (Object.hasOwnProperty.call(drivers, key)) {
                const element = drivers[key]
                addCircle(svg, colours[colourIndex++], element[0])
            }
        }

        
        wrapper.innerHTML = ''
        wrapper.appendChild(svg)
        
        svg.innerHTML = svg.innerHTML // HACK

        animations = document.querySelectorAll('animateMotion')
        console.log(animations)
    
        animations.forEach(element => {
            element.addEventListener('repeatEvent', function () {
                // FIXME: napisać od nowa, znaleźć sposób na przechowywanie zmiennych globalnych
                // synchronizacja na okrążeniach, lub wykombinować jak przyśpieszać w locie
                // zamiast przy zmianie okrążenia
        
                let parent = this.parentElement.parentElement
                let currentLap = Number(this.getAttribute('data-lap'))
                let maxLap = Number(parent.getAttribute('data-lap'))
                
                if (++currentLap > maxLap) {
                    maxLap++
                    parent.setAttribute('data-lap', maxLap)

                    const playbackSpeedInput = document.querySelector('main nav div#speed input')
                    parent.setAttribute('data-speed', playbackSpeedInput.value)
                }
                
                this.setAttribute('data-lap', currentLap)
                
                const playbackSpeed = parent.getAttribute('data-speed')

                if (currentLap == maxLap) {
                    let initialDur = this.getAttribute('data-dur')
                    initialDur = initialDur.replace('ms', '')
                    this.setAttribute('dur', Number(initialDur) * 1 / Number(playbackSpeed) + 'ms')
                }
            })
        })
    })
}