customOnLoad = setInterval(function () {
    main = document.querySelector('main')

    if (main != null) {
        const btns = document.querySelectorAll('#graph_select label')
        const graphType = document.querySelector('#graph_type')

        const nav = document.querySelector('main nav')
        const input = nav.querySelector('input')
        const label = nav.querySelector('label')
    
        btns[0].addEventListener('mouseup', function() {
            console.log('test')
            nav.style.opacity = '1'
            input.setAttribute('min', 1)
            input.setAttribute('max', 1096)
            input.setAttribute('value', 1096)
            input.setAttribute('placeholder', 'raceId')
            label.innerHTML = 'RaceId'
            graphType.style.opacity = 0
        })
        
        btns[1].addEventListener('mouseup', function() {
            console.log('test')
            nav.style.opacity = '1'
            input.setAttribute('min', 1)
            input.setAttribute('max', 1096)
            input.setAttribute('value', 1096)
            input.setAttribute('placeholder', 'raceId')
            label.innerHTML = 'RaceId'
            graphType.style.opacity = 0
        })
        
        btns[2].addEventListener('mouseup', function () {
            console.log('test')
            label.innerHTML = 'RaceId'
            nav.style.opacity = '0'
        })

        btns[3].addEventListener('mouseup', function () {
            console.log('test')
            nav.style.opacity = '1'
            input.setAttribute('min', 1950)
            input.setAttribute('max', 2022)
            input.setAttribute('value', 2021)
            input.setAttribute('placeholder', 'Rok')
            label.innerHTML = 'Rok'
            graphType.style.opacity = 1
        })


        clearInterval(customOnLoad)
    }
}, 300)