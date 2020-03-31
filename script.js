const button = document.querySelector('.search')
const search = document.querySelector(".location")
const dataLeft = document.querySelectorAll("[data-left]")
const dataTemp = document.querySelectorAll("[data-temp]")
const dataWeek = document.querySelectorAll("[data-week]")
const dataCondit = document.querySelectorAll("[data-condit]")


//Variables for weekly information
const getDay = new Date
let actualDay = getDay.getDay()
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

button.addEventListener('click',() =>{
    const left = document.querySelector(".actualWeather-container")
    const right = document.querySelector(".container-extra")

    //Call the API that will give the latitude and longitude based on the location sought
    //If the key  is not working go to https://opencagedata.com and get your onw free key
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${search.value}&key=263e0626e1114726b99dcedf7d9b3d92`)
    .then(response => response.json())
    .then(data =>{

        //Get the API results
        let lat = data.results[0].geometry.lat
        let lng = data.results[0].geometry.lng
        
        //Proxy for the DarkSKy API - It will not work without a server or proxy, more information in the DarkSKy API documentation
        const proxy = 'http://cors-anywhere.herokuapp.com/'
        //If the key is not working go to https://darksky.net and get your own free key
        const api = `${proxy}https://api.darksky.net/forecast/b9accc1bfaec94ddbef7f295674bb1fc/${lat},${lng}`
        console.log(data) // Check the results

        //Call the DarSky API
        fetch(api)
        .then(response => response.json())
        .then(data =>{
            console.log(data) //Check the results

            //Right block information 
            const info = data.daily.data
            //Automate the implementation of information
            for (let counter = 0; counter < info.length; counter++) {
                if(actualDay === 7){
                    actualDay = 0
                }
                dataWeek[counter].innerText = days[actualDay]
                dataCondit[counter].innerText = info[counter].summary
                 //(any -32 * (5 / 9)) Transform the temperature measurement to celsius
                dataTemp[counter].innerText = `Min: ${Math.floor(info[counter].temperatureLow -32 * (5 / 9))}°C  Max: ${Math.floor(info[counter].temperatureHigh -32 * (5 / 9))}°C`
                actualDay++
            }

            //Left block information
            const location = data.timezone
            const local = location.replace("_", " ").replace("/", " / ")
            const svgIcon = data.currently.icon
            const temperature = data.currently.temperature
            dataLeft[0].innerText = local
            dataLeft[1].innerHTML = `${Math.floor(temperature -32 * (5 / 9))}°C <img src="./svg/${svgIcon}.svg" alt="" class="temperature-icon">`
            dataLeft[2].innerHTML = `<span>Climate description:</span> ${data.hourly.summary}`
            dataLeft[3].innerHTML = `<span>Humidity:</span> ${data.currently.humidity}`
            dataLeft[4].innerHTML = `<span>Wind Speed:</span> ${data.currently.windSpeed}`
            dataLeft[5].innerHTML = `<span>Summary of the day:</span> ${data.daily.summary}`

            //To make the results screen appear, that way the screen only appears when you get all the results
            left.classList.add("active")
            left.classList.remove("off")
            right.classList.add("active")
            right.classList.remove("off")
        })
    })
})