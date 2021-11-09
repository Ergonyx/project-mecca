const wrapper = document.getElementById('wrapper')

// fetch('http://localhost:80/mecca')
fetch('https://www.alexrichardson.tech/mecca', )
    .then(response => response.json())
    .then(data => {
        const categories = []
        data.forEach(lmnt => {
            if (categories.indexOf(lmnt.category) < 0) {
                categories.push(lmnt.category)
            }
        });
        // Sort categories 
        categories.sort().forEach(lmnt => {
            const category = `<div id="${lmnt}"><h2>${lmnt}</h2></div>`
            wrapper.insertAdjacentHTML("beforeend", category)
        })
        data.forEach(lmnt => {
            const category = document.getElementById(lmnt.category)
            const item = `
            <div class="itemCard ${lmnt.store}">
                <div class="itemTitle">
                    <a href="${lmnt.url}" target="_blank">${lmnt.title}</a>
                    - <s>${lmnt.regularPrice}</s> <strong>${lmnt.discount}% OFF!</strong> ONLY ${lmnt.salePrice}
                </div>
            </div>
            `
            category.insertAdjacentHTML("beforeend", item)
        })

        console.log(categories)
        console.log(data)
    })