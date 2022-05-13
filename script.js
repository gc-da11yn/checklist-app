console.log("Loading Techniques...")

let techniques_json = []

fetch('criteria.json')
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		techniques_json = JSON.stringify(data)
		raw_criteria = JSON.parse(techniques_json)
		console.log(techniques_json)
		populateDropdown()
	})
	.catch(function(err) {
		console.log('error: ' + err);
	});
	
console.log(techniques_json)
let raw_criteria = techniques_json
console.log(raw_criteria)
let current_criterion = undefined
let raw_current_techniques;
updateRaw()
let techniques = raw_current_techniques.sort()
let checked_Techniques = []
console.log(techniques)

function updateRaw() {
	if (current_criterion === "all" || current_criterion === undefined) {
		console.log("update with all")
		raw_current_techniques = []
		raw_criteria.forEach((crit, ind) => {
			crit.techniques.forEach((technique) => {
				raw_current_techniques.push(technique)
			})
		})
		return
	}
	raw_criteria.forEach((crit, ind) => {
		if (crit.id === current_criterion) raw_current_techniques = raw_criteria[ind].techniques
	})
	raw_current_techniques.sort()
	//techniques = raw_current_techniques.sort()
}

function recArr(v) {
	if (!Array.isArray(v)) return v
	
	let newUl = document.createElement("ul")
			v.forEach( (point) => {
				
				let newLi = document.createElement("li")
				let newElem = recArr(point)
				if (newElem.tagName == "UL") {
					newUl.append(newElem)
				} else {
					newLi.append(newElem)
					newUl.append(newLi)
				}
				
			})
	return newUl
}

let sortTable = (tab) => {
	let rows = []
	console.log(tab)
	for (let i=1, row; row = tab.rows[i]; i++) {
		rows.push(srow)
	}
	console.log(rows)
	rows.sort(function(a, b) {
		if (a.id > b.id) return 1
		if (a.id < b.id) return -1
		return 0
	})
	for (let i=1, row; row = tab.rows[i]; i++) {
		console.log(`BEFORE edit:`)
		console.log(tab.rows[i])
		tab.rows[i] = rows[i-1]
		console.log(`AFTER edit:`)
		console.log(tab.rows[i])
		console.log("SHOULD BE:")
		console.log(rows[i-1])
	}
}

let searchTag = (kw='*', sortval=0) => {
	if (sortval === 0) techniques = raw_current_techniques.sort(function(a, b) {
		if (a.id > b.id) return 1
		if (a.id < b.id) return -1
		return 0
	})
	if (sortval === 1) techniques = raw_current_techniques.sort(function(a, b) {
		if (a.cat > b.cat) return -1
		if (a.cat < b.cat) return 1
		return 0
	})
	console.log(`Search: "${kw}"`)
	
	while (table.childElementCount > 2) {
		table.removeChild(table.lastElementChild)
	}
	
	techniques.forEach( (technique) => {
		//console.log(`TAGS: ${technique.tags.toString()}, DLD RESULT: ${technique.tags.DLD(kw, 3)}`)
		if (technique.tags.DLD(kw, 2) || kw === "*") {
			console.log(technique)
			/*technique.tags.forEach( (tag) => {
				console.log(`Tag: ${tag}, Distance: ${DLD(kw, tag)}, ${technique.tags.DLD(kw, 3)}`)
			})*/
			
			let newTr = document.createElement("tr")
			
			let newTh = document.createElement("th")
			newTh.setAttribute("scope", "row")
			newTh.append(technique.id)
			
			let newTd1 = document.createElement("td")
			newTd1.append(technique.cat)
			
			let newTd2 = document.createElement("td")
			if (technique.content.length == 1) {
				newTd2.append(technique.content)
			} else {
				let newUl = document.createElement("ul")
				newUl.setAttribute("class", "topList")
				technique.content.forEach( (point, index) => {
					
					let newLi = document.createElement("li")
					let newElem = recArr(point)
					if (newElem.tagName == "UL") {
						newUl.append(newElem)
					} else {
						newLi.append(newElem)
						newUl.append(newLi)
					}
					

				})
				newTd2.append(newUl)
			}
			
			let newTd3 = document.createElement("td")
			
			let chkBtn = document.createElement("button")
			chkBtn.append(`Mark Complete`)
			chkBtn.setAttribute("id", `${technique.id}-btn`)
			chkBtn.addEventListener("click", function(event) {
				event.preventDefault()
				if (chkBtn.textContent == "Mark Complete") {
					console.log(`1: ${technique.id}`)
					markComplete(technique.id)
				} else if (chkBtn.textContent == "Mark Incomplete") markIncomplete(technique.id)
			})
			
			
			newTd3.append(chkBtn)
			
			
			newTr.append(newTh, newTd1, newTd2, newTd3)
			console.log(newTr)
			table.appendChild(newTr)
		}
	})
}

let clearTables = () => {
	if (table.childElementCount > 2)
		while (table.childElementCount > 2) {
			table.removeChild(table.lastElementChild)
		}
	
	if (checked_table.childElementCount > 2)
		while (checked_table.childElementCount > 2) {
			checked_table.removeChild(checked_table.lastElementChild)
		}
}

let updateTables = () => {
	clearTables()
	
	checked_Techniques.forEach( (technique) => {
		//console.log(`TAGS: ${technique.tags.toString()}, DLD RESULT: ${technique.tags.DLD(kw, 3)}`)
		console.log(technique)
		/*technique.tags.forEach( (tag) => {
			console.log(`Tag: ${tag}, Distance: ${DLD(kw, tag)}, ${technique.tags.DLD(kw, 3)}`)
		})*/
		
		let newTr = document.createElement("tr")
		
		let newTh = document.createElement("th")
		newTh.setAttribute("scope", "row")
		newTh.append(technique.id)
		
		let newTd1 = document.createElement("td")
		newTd1.append(technique.cat)
		
		// HIDE CONTENT FROM CHECKED TABLE
		/*let newTd2 = document.createElement("td")
		if (technique.content.length == 1) {
			newTd2.append(technique.content)
		} else {
			let newUl = document.createElement("ul")
			newUl.setAttribute("class", "topList")
			technique.content.forEach( (point, index) => {
				
				let newLi = document.createElement("li")
				let newElem = recArr(point)
				if (newElem.tagName == "UL") {
					newUl.append(newElem)
				} else {
					newLi.append(newElem)
					newUl.append(newLi)
				}
			})
			newTd2.append(newUl)
		}*/
		let newTd3 = document.createElement("td")
			
		let chkBtn = document.createElement("button")
		chkBtn.append(`Mark Incomplete`)
		chkBtn.setAttribute("id", `${technique.id}-btn`)
		chkBtn.addEventListener("click", function(event) {
			event.preventDefault()
			if (chkBtn.textContent == "Mark Complete") {
				markComplete(technique.id)
			} else if (chkBtn.textContent == "Mark Incomplete") markIncomplete(technique.id)
		})
		
		
		newTd3.append(chkBtn)
		
		
		newTr.append(newTh, newTd1, newTd3)
		console.log(newTr)
		checked_table.appendChild(newTr)
	})
			
	techniques.forEach( (technique) => {
		//console.log(`TAGS: ${technique.tags.toString()}, DLD RESULT: ${technique.tags.DLD(kw, 3)}`)
		let kw = input.value
		if (kw === '') kw = '*'
		if (technique.tags.DLD(kw, 2) || kw === "*") {
			console.log(technique)
			/*technique.tags.forEach( (tag) => {
				console.log(`Tag: ${tag}, Distance: ${DLD(kw, tag)}, ${technique.tags.DLD(kw, 3)}`)
			})*/
			
			let newTr = document.createElement("tr")
			
			let newTh = document.createElement("th")
			newTh.setAttribute("scope", "row")
			newTh.append(technique.id)
			
			let newTd1 = document.createElement("td")
			newTd1.append(technique.cat)
			
			let newTd2 = document.createElement("td")
			if (technique.content.length == 1) {
				newTd2.append(technique.content)
			} else {
				let newUl = document.createElement("ul")
				newUl.setAttribute("class", "topList")
				technique.content.forEach( (point, index) => {
					
					let newLi = document.createElement("li")
					let newElem = recArr(point)
					if (newElem.tagName == "UL") {
						newUl.append(newElem)
					} else {
						newLi.append(newElem)
						newUl.append(newLi)
					}
				})
				newTd2.append(newUl)
			}
			let newTd3 = document.createElement("td")
			
			let chkBtn = document.createElement("button")
			chkBtn.append(`Mark Complete`)
			chkBtn.setAttribute("id", `${technique.id}-btn`)
			chkBtn.addEventListener("click", function(event) {
				event.preventDefault()
				if (chkBtn.textContent == "Mark Complete") {
					markComplete(technique.id)
				} else if (chkBtn.textContent == "Mark Incomplete") markIncomplete(technique.id)
			})
			
			
			newTd3.append(chkBtn)
			
			
			newTr.append(newTh, newTd1, newTd2, newTd3)
			console.log(newTr)
			table.appendChild(newTr)
		}
	})
}

let sortData = () => {
	if (technique_radio.checked) {
		console.log(`Sorting by technique`)
		checked_Techniques = checked_Techniques.sort(function(a, b) {
			if (a.id > b.id) return 1
			if (a.id < b.id) return -1
			return 0
		});
		techniques = techniques.sort(function(a, b) {
			if (a.id > b.id) return 1
			if (a.id < b.id) return -1
			return 0
		})
	} else if (importance_radio.checked) {
		console.log(`Sorting by importance`)
		checked_Techniques = checked_Techniques.sort(function(a, b) {
			if (a.id > b.id) return 1
			if (a.id < b.id) return -1
			return 0
		}).sort(function(a, b) {
			if (a.cat > b.cat) return -1
			if (a.cat < b.cat) return 1
			return 0
		});
		techniques = techniques.sort(function(a, b) {
			if (a.id > b.id) return 1
			if (a.id < b.id) return -1
			return 0
		}).sort(function(a, b) {
			if (a.cat > b.cat) return -1
			if (a.cat < b.cat) return 1
			return 0
		})
	}
	
	updateTables()
}

let markComplete = (t) => {
	
	// Iterate over unchecked techniques
	console.log(techniques.toString())
	for (let i = 0; i < techniques.length; i++) {
		if (techniques[i].id == t) {
			checked_Techniques.push(techniques[i])
			techniques.splice(i,1)
		}
	}
	console.log(techniques.toString())
	
	sortData()
	
}

let markIncomplete = (t) => {
	
	for (let i = 0; i < checked_Techniques.length; i++) {
		if (checked_Techniques[i].id == t) {
			techniques.push(checked_Techniques[i])
			checked_Techniques.splice(i,1)
		}
	}
	
	sortData()
}

let alert = document.getElementById('error');
let search_button = document.getElementById('searchButton');
let showall_button = document.getElementById('showAllButton');
let input = document.getElementById('search');
let table = document.getElementById('results_table');
let checked_table = document.getElementById('checked_table');
let technique_radio = document.getElementById('radio-sort_T');
let importance_radio = document.getElementById('radio-sort_I');
let crit_dropdown = document.getElementById('criteria-menu');
let current_search = undefined

let populateDropdown = () => {
	raw_criteria.forEach( (crit) => {
		let newOption = document.createElement("option")
		newOption.setAttribute("value", `${crit.id}`)
		newOption.textContent = `${crit.id}: ${crit.name}`
		crit_dropdown.append(newOption)
	})
}



crit_dropdown.addEventListener('change', function(event) {
	console.log(crit_dropdown.value)
	current_criterion = crit_dropdown.value
	if (current_criterion === "all") {
		raw_current_techniques = []
		raw_criteria.forEach( (crit) => {
			raw_current_techniques.push(crit.techniques)
		})
	} else {
		raw_criteria.forEach( (crit) => {
			if (crit.id === current_criterion) raw_current_techniques = crit.techniques
		})
	}
	
	updateRaw()
	searchTag(current_search)
})

technique_radio.addEventListener('change', function(event) {
	console.log('T1')
	event.preventDefault();
	console.log('T2')
	sortData();
	console.log('T3')
});

importance_radio.addEventListener('change', function(event) {
	console.log('I1')
	event.preventDefault();
	console.log('I2')
	sortData();
	console.log('I3')
});


search_button.addEventListener('click', checkInput);
showall_button.addEventListener('click', showAll);
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});

function showAll(e) {
	e.preventDefault()
	updateRaw()
	current_search = '*'
	input.value = ''
	input.setAttribute('aria-invalid', false);
	if (!!document.getElementById("emptyBox")) document.getElementById("emptyBox").remove()
	if (technique_radio.checked) searchTag("*")
	if (importance_radio.checked) searchTag("*", 1)
}

function checkInput(e) {
  e.preventDefault();


  if(input.value === "") {
    alert.innerHTML = "";
    let span = document.createElement('span');
	span.setAttribute("id", "emptyBox")
    span.textContent = "Search box may not be empty";
    alert.appendChild(span);
    input.setAttribute('aria-invalid', true);
    input.focus();
  } else {
		input.setAttribute('aria-invalid', false);
		current_search = input.value
		if (!!document.getElementById("emptyBox")) document.getElementById("emptyBox").remove()
		if (technique_radio.checked) searchTag(input.value)
		if (importance_radio.checked) searchTag(input.value, 1)
  }
}

/**
 * @name DLD
 * @description Damerau-Levenshtein distance computation
 * @param {string} str1, str2 
 * 
 * @returns {integer} Computed Damerau-Levenshtein distance
 */
function DLD(str1, str2) {
  if (!str1 || str1.length === 0)
    if (!str2 || str2.length === 0)
      return 0
    else
      return str2.length
  else if (!str2)
    return str1.length

  let str1Length = str1.length
  let str2Length = str2.length
  let score = []

  let INF = str1Length + str2Length;
  score[0] = [INF]
  for (let i=0 ; i <= str1Length ; i++) {
	score[i + 1] = []
	score[i + 1][1] = i
	score[i + 1][0] = INF
	}
  for (let i=0 ; i <= str2Length ; i++) {
	  score[1][i + 1] = i
	  score[0][i + 1] = INF
	}

  let sd = {}
  let comStr = str1 + str2
  let comStrLen = comStr.length;
  for(let i=0 ; i < comStrLen ; i++) {
    let letter = comStr[i]
    if (!sd.hasOwnProperty(letter))
      sd[letter] = 0
  }

  for (let i=1 ; i <= str1Length ; i++) {
    let DB = 0
    for (let j=1 ; j <= str2Length ; j++) {
      let i1 = sd[str2[j - 1]]
      let j1 = DB

      if (str1[i - 1] == str2[j - 1]) {
        score[i + 1][j + 1] = score[i][j]
        DB = j
      }
      else
        score[i + 1][j + 1] = Math.min(score[i][j], Math.min(score[i + 1][j], score[i][j + 1])) + 1

      score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], score[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1))
    }
    sd[str1[i - 1]] = i
  }
  return score[str1Length + 1][str2Length + 1];
}

// add DLD to array prototype
Object.defineProperty(Array.prototype, 'DLD', {
    value: function(str, dist) {
		let accTags = []
		
		for (let i = 0; i < this.length; i++) {
			if (!(DLD(String(this[i]).toLowerCase(), str.toLowerCase()) > dist)) {
				console.log(`Accepting tag: ${this[i]}`)
				return true
			}
		}
		return false
		}
});