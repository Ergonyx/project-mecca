const itemList = document.getElementById('itemList')
const filters = document.getElementById('filters')
const header = document.getElementById('header')

// Toggle visibility of individual categories when toggled in the filter list.
const funkyTest = (category) => {
  console.log(category)
  const lmnt = document.getElementById(category)  
  lmnt.classList.toggle('visible')
  lmnt.classList.toggle('hidden')
}

// function to convert store code into a readable name.
const getStoreName = (store) => {
    switch (store) {
      case 'BBBC':
        return "Burnaby, BC"
        break;
      case 'CalNE':
        return "Calgary NE, AB"
        break;
      case 'CalNW':
        return "Calgary NW, AB"
        break;
      case 'CalSE':
        return "Calgary SE, AB"
        break;
      case 'Edm1':
        return "Edmonton South, AB"
        break;
      case 'EdmW':
        return "Edmonton West, AB"
        break;
      case 'ONHM':
        return "Hamilton, ON"
        break;
      case 'LYBC':
        return "Langley, BC"
        break;
      case 'ONLON':
        return "London, ON"
        break;
      case 'ONOTT':
        return "Ottawa, ON"
        break;
      case 'SKST':
        return "Saskatoon North, SK"
        break;
      case 'VBBC':
        return "Vancouver, BC"
        break;
      case 'BCVIC1':
        return "Victoria, BC"
        break;
      case 'WpgW':
        return "Winnipeg West, MB"
        break;
      default:
        return "ERROR 37..."
        break;
    }
  }
  
  // fetch('http://localhost:80/mecca', )
  fetch('https://www.alexrichardson.tech/mecca', )
    .then(response => response.json())
    .then(data => {
        const categories = []
        const items = data.yyc
        // Build list of categories for later use.
        items.forEach(lmnt => {
            if (categories.indexOf(lmnt.category) < 0) {
                categories.push(lmnt.category)
            }
        });
        // Sort categories and create filters for each
        categories.sort().forEach(lmnt => {
            const category = `<div id="${lmnt.replace(/[\s]/gm,'')}" class="visible"><h2>${lmnt}</h2></div>`
            itemList.insertAdjacentHTML("beforeend", category)
            const filter = `<div><input type="checkbox" onchange=funkyTest('${lmnt.replace(/[\s]/gm,'')}') checked> ${lmnt}</div>`
            filters.insertAdjacentHTML("beforeend", filter)
        })
        // Add all the items into their respective categories.
        items.forEach(lmnt => {
            const category = document.getElementById(lmnt.category.replace(/[\s]/gm,''))
            const item = `
            <div class="itemCard ${lmnt.store}">
                <div class="itemTitle">
                    ${getStoreName(lmnt.store)} - <a href="${lmnt.url}" target="_blank">${lmnt.title}</a>
                    - <s>${lmnt.regularPrice}</s> <strong>${lmnt.discount}% OFF!</strong> ONLY ${lmnt.salePrice}
                </div>
            </div>
            `
            category.insertAdjacentHTML("beforeend", item)
        })
        // Modify the header to provide any important information.
        const lastUpdated = data.stats.lastUpdated.split('T')
        const notice = `
          <strong>Last Updated:<br>${lastUpdated[0]} at ${lastUpdated[1].replace(/.\d*Z/gm, '')} UTC</strong>
          <p>The data this page uses is only updated once every 4-6 hours. You should call to confirm any items on this list are still in stock before going to the store.</p>
        `
        header.insertAdjacentHTML("beforeend", notice)
    })