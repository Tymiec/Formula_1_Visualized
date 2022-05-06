customOnLoad = setInterval(function () {
    main = document.querySelector('main')

    if (main != null) {
        const btns = document.querySelectorAll('#graph_select label')
        const graphType = document.querySelector('#graph_type')
    
        for (let i = 0; i < btns.length - 1; i++) {
            btns[i].addEventListener('mouseup', function() {
                graphType.style.opacity = 0
            })
        }

        btns[btns.length - 1].addEventListener('mouseup', function () {
            graphType.style.opacity = 1
        })

        clearInterval(customOnLoad)
    }
}, 300)