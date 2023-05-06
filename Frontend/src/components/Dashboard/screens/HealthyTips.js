import React from "react";
import axios from "axios";
import lifestyleTips from '../../../resources/healthTasks.json';

class HealthyTips extends React.Component {

    constructor(props){
        super(props);
        this.searchFitnessAPI = this.searchFitnessAPI.bind(this);
        this.searchNutritionAPI = this.searchNutritionAPI.bind(this);
        this.createFitnessCards = this.createFitnessCards.bind(this);
    }

    //SEND FITNESS INPUTS TO API

    searchFitnessAPI(event){

        event.preventDefault();
        document.getElementById('fitnessResponses').innerHTML='';
        document.getElementById('loadingIconAPI').classList.remove('hidden');
        document.getElementById('noResponse').classList.add('hidden');
        
        var type = document.getElementById('fitnessType').value;
        var area = document.getElementById('fitnessArea').value;
        var level = document.getElementById('fitnessLevel').value;

        const apiKey = '56pDYfLHtfl0UC4SuuhvDw==j44zbk6YGiJ61VXF';
        
        axios.get('https://api.api-ninjas.com/v1/exercises?muscle=' + area + '&type=' + type + '&difficulty=' + level, {
            headers: {
                'X-Api-Key': apiKey
            }
        }).then(response => {
            this.createFitnessCards(response.data);
        }).catch(error => {
            console.log(error);
        });

    }

    //CREATE ELEMENTS FROM API RESPONSE

    createFitnessCards(response){

        let fitnessTips = document.getElementById('fitnessResponses');
        document.getElementById('loadingIconAPI').classList.add('hidden');

        if(response.length === 0) {

            document.getElementById('noResponse').classList.remove('hidden');

        } else {

            for (let i = 0; i < response.length; i++) {

                let thisResponse = response[i];

                let fitnessCard = document.createElement('div');
                fitnessCard.classList.add('responseCard');

                let fitnessCardName = document.createElement('h2');
                fitnessCardName.innerText = thisResponse.name;

                let fitnessCardType = document.createElement('span');
                fitnessCardType.innerText = "Type: " + thisResponse.type;

                let fitnessCardMuscle = document.createElement('span');
                fitnessCardMuscle.innerText = "Muscle: " + thisResponse.muscle;

                let fitnessCardDifficulty = document.createElement('span');
                fitnessCardDifficulty.innerText = "Level: " + thisResponse.difficulty;

                let fitnessCardInstructions = document.createElement('p');
                fitnessCardInstructions.innerText = thisResponse.instructions;


                fitnessCard.appendChild(fitnessCardName);
                fitnessCard.appendChild(fitnessCardType);
                var br = document.createElement("br");
                fitnessCard.appendChild(br);
                fitnessCard.appendChild(fitnessCardMuscle);
                var br2 = document.createElement("br");
                fitnessCard.appendChild(br2);
                fitnessCard.appendChild(fitnessCardDifficulty);
                var br3 = document.createElement("br");
                fitnessCard.appendChild(br3);
                let hr = document.createElement('hr');
                fitnessCard.appendChild(hr);
                fitnessCard.appendChild(fitnessCardInstructions);
                fitnessTips.appendChild(fitnessCard);

            }
        }
    }

    //SEND NUTRITION INPUTS TO API

    searchNutritionAPI(event){

        event.preventDefault();

        document.getElementById('nutritionResponses').innerHTML='';
        document.getElementById('loadingIconAPI2').classList.remove('hidden');
        document.getElementById('noResponse2').classList.add('hidden');
    
        var keywords = document.getElementById('nutritionKeywords').value;
    
        const apiKey = '56pDYfLHtfl0UC4SuuhvDw==j44zbk6YGiJ61VXF';
        
        axios.get('https://api.api-ninjas.com/v1/nutrition?query=' + keywords, {
            headers: {
                'X-Api-Key': apiKey
            }
        }).then(response => {
            //console.log(response.data);
            this.createNutritionCards(response.data);
        }).catch(error => {
            console.log(error);
        });
    
    }

    //CREATE ELEMENTS FROM API RESPONSE

    createNutritionCards(response){

        let nutritionTips = document.getElementById('nutritionResponses');
        document.getElementById('loadingIconAPI2').classList.add('hidden');
        
        if(response.length === 0) {

            document.getElementById('noResponse2').classList.remove('hidden');

        } else {

            let nutritionCard = document.createElement('div');
            nutritionCard.classList.add('responseCard');

            let nutritionCardName = document.createElement('h2');
            const header = response[0].serving_size_g + "g of " + response[0].name + " conatains:";
            nutritionCardName.innerText = header;

            const table = document.createElement('table');
            const headerRow = document.createElement('tr');

            for (let i = 0; i < 6; i++) {

                const headerCell = document.createElement('th');
                
                switch(i) {
                    case 0:
                        headerCell.textContent = 'Calories';
                        break;
                    case 1:
                        headerCell.textContent = 'Fat';
                        break;
                    case 2:
                        headerCell.textContent = 'Protien';
                        break;
                    case 3:
                        headerCell.textContent = 'Fiber';
                        break;
                    case 4:
                        headerCell.textContent = 'Sugar';
                        break;
                    case 5:
                        headerCell.textContent = 'Salt';
                        break;  
                    default:
                        console.log("error");
                        break;        
                }
                
                headerRow.appendChild(headerCell);

            }

            const thead = document.createElement('thead');
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            const row = document.createElement('tr');

            console.log(response);

            for (let i = 0; i < 6; i++) {

                const cell = document.createElement('td');
                
                switch(i) {
                    case 0:
                        cell.textContent = response[0].calories;
                        break;
                    case 1:
                        cell.textContent = response[0].fat_total_g + "g";
                        break;
                    case 2:
                        cell.textContent = response[0].protein_g + "g";
                        break;
                    case 3:
                        cell.textContent = response[0].fiber_g + "g";
                        break;
                    case 4:
                        cell.textContent = response[0].sugar_g + "g";
                        break;
                    case 5:
                        cell.textContent = response[0].sodium_mg + "mg";
                        break;  
                    default:
                        console.log("error");
                        break;        
                }
                
                row.appendChild(cell);
                
            }

            tbody.appendChild(row);
            table.appendChild(tbody);


            nutritionCard.appendChild(nutritionCardName);
            nutritionCard.appendChild(table);
           
            nutritionTips.appendChild(nutritionCard);

        }
    }
    

    //CHANGE TYPE OF TIPS
    //spaghetti

    changeTips(tips) {

        switch(tips) {
            case "fitness":
                document.getElementById('healthyTipsNavNutrition').classList.remove('healthyTipsNavActive');
                document.getElementById('healthyTipsNavHealth').classList.remove('healthyTipsNavActive');
                document.getElementById('healthyTipsNavFitness').classList.add('healthyTipsNavActive');
                document.getElementById('fitnessTips').classList.remove('hidden');
                document.getElementById('nutritionTips').classList.add('hidden');
                document.getElementById('healthTips').classList.add('hidden');
                break;
            case "nutrition":
                document.getElementById('healthyTipsNavNutrition').classList.add('healthyTipsNavActive');
                document.getElementById('healthyTipsNavHealth').classList.remove('healthyTipsNavActive');
                document.getElementById('healthyTipsNavFitness').classList.remove('healthyTipsNavActive');
                document.getElementById('fitnessTips').classList.add('hidden');
                document.getElementById('nutritionTips').classList.remove('hidden');
                document.getElementById('healthTips').classList.add('hidden');
                break;
            case "health":
                document.getElementById('healthyTipsNavNutrition').classList.remove('healthyTipsNavActive');
                document.getElementById('healthyTipsNavHealth').classList.add('healthyTipsNavActive');
                document.getElementById('healthyTipsNavFitness').classList.remove('healthyTipsNavActive');
                document.getElementById('fitnessTips').classList.add('hidden');
                document.getElementById('nutritionTips').classList.add('hidden');
                document.getElementById('healthTips').classList.remove('hidden');
                break;
            default:
                document.getElementById('healthyTipsNavNutrition').classList.remove('healthyTipsNavActive');
                document.getElementById('healthyTipsNavHealth').classList.remove('healthyTipsNavActive');
                document.getElementById('healthyTipsNavFitness').classList.add('healthyTipsNavActive');
                document.getElementById('fitnessTips').classList.remove('hidden');
                document.getElementById('nutritionTips').classList.add('hidden');
                document.getElementById('healthTips').classList.add('hidden');
        }

    }

    render(){
        return(
            <>
                <template>
                    <table id='nutritionTable' className="GeneratedTable">
                        <thead>
                            <tr>
                            <th>Calories</th>
                            <th>Fat</th>
                            <th>Fibre</th>
                            <th>Protien</th>
                            <th>Sugar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            </tr>
                        </tbody>
                    </table>
                </template>

            <nav className="healthyTipsNav">
                <ul>
                    <li id="healthyTipsNavFitness" onClick={() => this.changeTips("fitness")} className="healthyTipsNavActive"><i className="fa-solid fa-dumbbell"></i>Fitness Tips</li>
                    <li id="healthyTipsNavNutrition" onClick={() => this.changeTips("nutrition")}><i className="fa-solid fa-utensils"></i>Nutrition Tips</li>
                    <li id="healthyTipsNavHealth" onClick={() => this.changeTips("health")}><i className="fa-solid fa-heart"></i>Lifestyle Tips</li>
                </ul>
            </nav>

            <div className="tipsContainer">

                <section id="fitnessTips">

                    <form onSubmit={this.searchFitnessAPI}>
                        <label htmlFor="fitnessType">Type:</label>
                        <select name="fitnessType" id="fitnessType">
                            <option value="">Any</option>
                            <option value="cardio">Cardio</option>
                            <option value="olympic_weightlifting">Olympic Weightlifting</option>
                            <option value="plyometrics">Plyometrics</option>
                            <option value="powerlifting">Powerlifting</option>
                            <option value="strength">Strength</option>
                            <option value="stretching">Stretching</option>
                            <option value="strongman">Strongman</option>
                        </select>

                        <label htmlFor="fitnessArea">Muscle:</label>

                        <select name="fitnessArea" id="fitnessArea">
                            <option value="">Any</option>
                            <option value="abdominals">Abdominals</option>
                            <option value="abductors">Abductors</option>
                            <option value="adductors">Adductors</option>
                            <option value="Biceps">Biceps</option>
                            <option value="calves">Calves</option>
                            <option value="chest">Chest</option>
                            <option value="forearms">Forearms</option>
                            <option value="glutes">Glutes</option>
                            <option value="hamstrings">Hamstrings</option>
                            <option value="lats">Lats</option>
                            <option value="lower_back">Lower Back</option>
                            <option value="middle_back">Middle Back</option>
                            <option value="neck">Neck</option>
                            <option value="quadriceps">Quadriceps</option>
                            <option value="traps">Traps</option>
                            <option value="triceps">Triceps</option>
                        </select>

                        <label htmlFor="fitnessLevel">Level:</label>

                        <select name="fitnessLevel" id="fitnessLevel">
                            <option value="">Any</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                        </select>

                        <input id="fitnessSubmit" type="submit" value="Search" /><br/>
                        <i id='loadingIconAPI' className="fas fa-sync fa-spin hidden"></i>

                    </form>

                    <h3 id="noResponse" className="hidden">No results...</h3>

                    <section id="fitnessResponses">

                    <i id='loadingIconAPI' className="fas fa-sync fa-spin hidden"></i>
                    </section>

                </section>

                <section id="nutritionTips" className="hidden">
                    <form onSubmit={this.searchNutritionAPI}>
                        <label htmlFor="nutritionKeywords">Keywords</label>
                        <input name="nutritionKeywords" id="nutritionKeywords" type="text"></input>
                        <input id="nutritionSubmit" type="submit" value="Search" /><br/>
                        <i id='loadingIconAPI2' className="fas fa-sync fa-spin hidden"></i>
                    </form>

                    <h3 id="noResponse2" className="hidden">No results...</h3>

                    <section id="nutritionResponses">

                    </section>

                </section>

                <section id="healthTips" className="hidden">
                    
                {lifestyleTips.map((item, index) => (
                <div className="responseCard" key={index}>
                 <h3>{item[0]}</h3>
                </div>
                ))}

                </section>

            </div>

            </>
        )
    }

}

export default HealthyTips;