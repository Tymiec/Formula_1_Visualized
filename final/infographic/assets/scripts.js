customOnLoad = setInterval(function () {
    main = document.querySelector('main')

    if (main != null) {
        navigation()
        /*
        fetch('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/descriptions.csv')
        .then(response => response.text())
        .then(data => {
            let races = data.split('\n')

            const raceIdInput = document.querySelector('main nav div input')

            // get description on load
            const description = document.querySelector('section')
            description.innerHTML = ''

            races.forEach(race => {
                const fields = race.split('|')

                if (fields[0] == raceIdInput.value) {
                    let h2 = document.createElement('h2')
                    let article = document.createElement('article')
                    h2.innerHTML = fields[1]
                    description.appendChild(h2)
                    description.appendChild(article)

                    for (let i = 2; i < fields.length; i += 2) {
                        let div = document.createElement('div')
                        let p = document.createElement('p')
                        let img = document.createElement('img')

                        p.innerHTML = fields[i]
                        img.src = fields[i + 1]

                        div.appendChild(p)
                        div.appendChild(img)
                        article.appendChild(div)
                    }
                }
            });

            // get description on raceIdInput change
            raceIdInput.addEventListener('change', function() {
                const description = document.querySelector('section')
                description.innerHTML = ''

                races.forEach(race => {
                    const fields = race.split('|')

                    if (fields[0] == this.value) {
                        let h2 = document.createElement('h2')
                        let article = document.createElement('article')
                        h2.innerHTML = fields[1]
                        description.appendChild(h2)
                        description.appendChild(article)

                        for (let i = 2; i < fields.length; i += 2) {
                            let div = document.createElement('div')
                            let p = document.createElement('p')
                            let img = document.createElement('img')

                            p.innerHTML = fields[i]
                            img.src = fields[i + 1]

                            div.appendChild(p)
                            div.appendChild(img)
                            article.appendChild(div)
                        }
                    }
                });
            })
        })
        */
        clearInterval(customOnLoad)
    }
}, 300)

function navigation() {
    const btns = document.querySelectorAll('#graph_select label')
    const graphType = document.querySelector('#graph_type')

    const nav = document.querySelector('main nav')
    const input = nav.querySelector('input')
    const label = nav.querySelector('label')

    btns[0].addEventListener('mouseup', function () {
        nav.style.opacity = '1'
        input.setAttribute('min', 1)
        input.setAttribute('max', 1096)
        input.value = 1096
        input.setAttribute('placeholder', 'raceId')
        label.innerHTML = 'RaceId'
        graphType.style.opacity = 0
        input.style.opacity = 1
        label.style.opacity = 1
    })

    btns[1].addEventListener('mouseup', function () {
        nav.style.opacity = '1'
        input.setAttribute('min', 1)
        input.setAttribute('max', 1096)
        input.value = 1096
        input.setAttribute('placeholder', 'raceId')
        label.innerHTML = 'RaceId'
        graphType.style.opacity = 0
        input.style.opacity = 1
        label.style.opacity = 1
    })

    btns[2].addEventListener('mouseup', function () {
        nav.style.opacity = '1'
        input.setAttribute('min', 1950)
        input.setAttribute('max', 2022)
        input.value = 2021
        input.setAttribute('placeholder', 'Rok')
        label.innerHTML = 'Rok'
        graphType.style.opacity = 1
        input.style.opacity = 1
        label.style.opacity = 1
    })

    btns[3].addEventListener('mouseup', function () {
        nav.style.opacity = '0'
    })

    btns[4].addEventListener('mouseup', function () {
        nav.style.opacity = '0'
    })

    btns[5].addEventListener('mouseup', function () {
        nav.style.opacity = '1'
        input.setAttribute('min', 1950)
        input.setAttribute('max', 2022)
        input.value = 2021
        input.setAttribute('placeholder', 'Rok')
        label.innerHTML = 'Rok'
        input.style.opacity = 0
        label.style.opacity = 0
        graphType.style.opacity = 1
    })

    btns[5].addEventListener('mouseup', function () {
        nav.style.opacity = '0'
    })

    btns[6].addEventListener('mouseup', function () {
        input.style.opacity = 0
        label.style.opacity = 0
        graphType.style.opacity = 1
    })

    btns[7].addEventListener('mouseup', function () {
        nav.style.opacity = '0'
    })
}