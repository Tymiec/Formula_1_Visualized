let main

checkMain = setInterval(function() {
    main = document.querySelector('main')
    
    if (main != null) {
        let wrapper = document.createElement('div')
        wrapper.classList.add('wrapper')
        main.appendChild(wrapper)

        fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/f7b328f0198cfdab2c7d2356597418cd5a12d46f/testing/lap%20vis/N%C3%BCrburgring.svg')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(xml => {
            svg = xml.querySelector('svg')

            svg.querySelector('path').id = 'track'

            let circle = document.createElement('circle')
            circle.setAttribute('r', '6')
            circle.setAttribute('fill', '#f00')

            let animateMotion = document.createElement('animateMotion')
            animateMotion.setAttribute('dur', '5s')
            animateMotion.setAttribute('repeatCount', 'indefinite')

            let mpath = document.createElement('mpath')
            mpath.setAttribute('xlink:href', '#track')

            animateMotion.appendChild(mpath)
            circle.appendChild(animateMotion)
            svg.appendChild(circle)

            wrapper.appendChild(svg)

            svg.innerHTML = svg.innerHTML // HACK
        })


        clearInterval(checkMain)
    }
}, 300)