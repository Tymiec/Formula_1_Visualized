let main

checkMain = setInterval(function() {
    main = document.querySelector('main')
    
    if (main != null) {
        let wrapper = document.createElement('div')
        wrapper.classList.add('wrapper')
        main.appendChild(wrapper)

        fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/f7b328f0198cfdab2c7d2356597418cd5a12d46f/testing/lap%20vis/N%C3%BCrburgring.svg')
        .then(response => response.text())
        .then(text => {
            wrapper.innerHTML = text
            wrapper.innerHTML += text

            let svgs = document.querySelectorAll('main svg')
            svgs[0].id = 'track'
            svgs[1].classList.add('racer')
            
            console.log(svgs[0].querySelector('path').getTotalLength())
        })


        clearInterval(checkMain)
    }
}, 300)