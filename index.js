#!/usr/bin/env node

import inquirer from "inquirer"; //This is to get users inputs

let favorites = [] //to store users favorites

const getWeather = async (city) =>{
    try{
        //need to get latitude and longtitude based on city name
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=f9d68e67ed699913a848f7babb21ee9b`)
        const data = await response.json()
        const cityDetails = data[0]
        const lat = cityDetails.lat
        const lon = cityDetails.lon
        try{
            //with lat and lon we can now find weather of the city
            const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=f9d68e67ed699913a848f7babb21ee9b`)
            const weatherData = await weather.json()
            const weatherDetails = weatherData.weather[0]
            const tempDetails = weatherData.main
            console.log("\nWeather in", city, "is:", weatherDetails.main, "\nTempatures of:", tempDetails.temp, "F", "\nFeels Like: ", tempDetails.feels_like, "F")
        }
        catch(error){
            //error handling
            console.log("Error occured please try again")
        }
    }
    catch(error){
        //error handling, if city does not exist
        console.log("Error has occured, city does not exist")
    }
}

//getWeather("London") test to see if getWeather() works

const CLI = async() =>{
    //constantly loop until a user quits CLI
    while (true){
        //present users with choices to choose from, this can prevent user caused errors with wrong inputs
        const {option} = await inquirer.prompt({
            type: "list",
            name: "option",
            message: "Hi welcome to weather-cli. Please pick an option!",
            choices: [
                "1. Enter a city for the current weather",
                "2. Add a city to your favorites list",
                "3. View favorites",
                "4. Update favorites list",
                "5. Quit",
            ],
        })
        //If option 1
        if (option === "1. Enter a city for the current weather"){
            const {city} = await inquirer.prompt({
                type: "input",
                name: "city",
                message: "Enter a city to find it's current weather",
            })
            if (city != ''){
                await getWeather(city)
            }
            else{
                console.log("Please enter a city, try again")
            }
        }
        //if option 2
        else if(option === "2. Add a city to your favorites list"){
            const {favorite} = await inquirer.prompt({
                type: "input",
                name: "favorite",
                message: "Enter a city to add to your favorites",
            })
            //check if favorites has 3 elements
            if (favorites.length === 3){
                console.log("You have 3 favorites, cannot add more")
            }
            else{
                favorites.push(favorite)
            }
            console.log("Your favorites", favorites)
        }
        //if options 3
        else if (option === "3. View favorites"){
            //if favorites is empty
            if(favorites.length === 0){
                console.log("You have no favorites")
            }
            else{
                console.log("Your favorites", favorites)
                //loop through list and get weather of each element
                for (let i = 0; i < favorites.length; i++){
                    await getWeather(favorites[i])
                }
            }
        }
        //if option 4
        else if(option === "4. Update favorites list"){
            // if no elements in favorites 
            if(favorites.length === 0){
                console.log("You have no favorites")
            }
            //if there are elements in favorites
            else{
                //set of actions
                const {manage} = await inquirer.prompt({
                    type: "list",
                    name: "manage",
                    message: "Please pick your action",
                    choices:[
                        "1. Clear favorites list",
                        "2. Remove a city from your favorites",
                        "3. Replace a city with another city in your favorites"
                    ]
                })
                //clear list
                if (manage === "1. Clear favorites list"){
                    favorites = []
                }
                //remove element in list
                else if (manage === "2. Remove a city from your favorites"){
                    const {removal} = await inquirer.prompt({
                        type:"input",
                        name: "removal",
                        message: "Please enter the city you would like to remove"
                    })
                    //loop through list and remove element
                    for (let i = 0; i <favorites. length; i++){
                        if (removal === favorites[i]){
                            favorites.splice(i, 1)
                            console.log(removal, "has been removed")
                            //return
                        }
                    }
                    // if city is not in favorites
                    console.log("City is not in your favorites")
                }
                //replace element in list
                else{
                    //remove element
                    const {removal} = await inquirer.prompt({
                        type:"input",
                        name: "removal",
                        message: "Please enter the city you would like to remove"
                    })
                    for (let i = 0; i <favorites. length; i++){
                        if (removal === favorites[i]){
                            favorites.splice(i, 1)
                            //enter new city user wants to add
                            const {update} = await inquirer.prompt({
                                type: "input",
                                name: "update",
                                message: "Please enter a new city you want to add"
                            })
                            favorites.push(update)
                            console.log(update, "has been added")
                            console.log(removal, "has been removed")
                            //return
                        }
                    }
                    console.log("City is not in your favorites")
                }
            }
        }
        // if user quits
        else{
            console.log("Bye Thank You!")
            break
        }
    }
}

CLI()