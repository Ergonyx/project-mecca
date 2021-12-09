const itemList = document.getElementById('itemList')
const filters = document.getElementById('filters')
const header = document.getElementById('header')

// Toggle visibility of individual categories when toggled in the filter list.
const funkyTest = (category) => {
  const lmnt = document.getElementById(category)  
  lmnt.classList.toggle('is-hidden')
}
const hideItems = (category) => {
  const lmnt = document.getElementById(category)
  let items = lmnt.querySelectorAll('.itemCard')
  items.forEach(lmnt => {
    lmnt.classList.toggle('is-hidden')
  })
}
const hideFilters = () => {
  const filterList = document.querySelectorAll('.filterCheckbox')
  const filterListToggle = document.getElementById('filterListToggle')
  filterListToggle.classList.toggle('fa-plus')
  filterListToggle.classList.toggle('fa-minus')
  // filterListToggle.textContent === '+' ? filterListToggle.textContent = '-' : filterListToggle.textContent = '+'
  filterList.forEach(lmnt => {
    lmnt.classList.toggle('is-hidden')
  })
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
        return "ERROR: Store name not found."
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
            const category = `
              <div id="${lmnt.replace(/[\s]/gm,'')}" class="container categoryBorder">
                <span class="title is-5 categoryHeader cursorPointer" onclick=hideItems('${lmnt.replace(/[\s]/gm,'')}')>${lmnt}</span>
              </div>
            `
            itemList.insertAdjacentHTML("beforeend", category)
            const filter = `
              <div class="filterCheckbox is-hidden">
                <input type="checkbox" onchange=funkyTest('${lmnt.replace(/[\s]/gm,'')}') checked> ${lmnt}
              </div>
            `
            filters.insertAdjacentHTML("beforeend", filter)
        })

        // Add all the items into their respective categories.
        items.forEach(lmnt => {
            const category = document.getElementById(lmnt.category.replace(/[\s]/gm,''))
            const item = `
            <div class="itemCard ${lmnt.store} is-hidden">
                <div class="itemTitle">
                    ${getStoreName(lmnt.store)} - <a href="${lmnt.url}" target="_blank">${lmnt.title}</a>
                    - <s>${lmnt.regularPrice}</s> <strong>${lmnt.discount}% OFF!</strong> ONLY ${lmnt.salePrice}
                </div>
            </div>
            `
            category.insertAdjacentHTML("beforeend", item)
        })
        
        // Modify the header to provide any important information.
        const timezoneOffset = new Date().getTimezoneOffset() * 60
        const lastUpdated = new Date(new Date(data.stats.lastUpdated).getTime() - timezoneOffset)
        const notice = `
          <strong><p class="title is-4">Last Updated:</p>${lastUpdated}</strong>
          <p>The data this page uses is only updated once every 4-6 hours. You should call to confirm any items on this list are still in stock before going to the store.</p>
        `
        header.insertAdjacentHTML("beforeend", notice)
    })
    
// Bulma CSS navbar burger support
    document.addEventListener('DOMContentLoaded', () => {

      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    
      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
    
        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {
    
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);
    
            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
    
          });
        });
      }
    
    });