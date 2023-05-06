import React from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";

class Goals extends React.Component {

    constructor(props){
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.getGoals = this.getGoals.bind(this)
        this.addNewGoal = this.addNewGoal.bind(this);
        this.completeGoal = this.completeGoal.bind(this);
        this.deleteGoal = this.deleteGoal.bind(this);
    }

    //ON PAGE LOAD, LOAD GOALS FROM DB

    componentDidMount(){
        this.getGoals();
    }

    //LOAD GOALS FROM DB AND POPULATE FRONTEND

    getGoals() {

        let goalList = document.getElementById('goalsList');
        let completedGoalsList = document.getElementById('completedGoalsList');
        goalList.innerHTML = '';
        completedGoalsList.innerHTML = '';

        const userID = localStorage.getItem("userID");
     
        axios
          .get(`/getOneOffGoals/${userID}`)
          .then((response) => {

            const goals = response.data;

            for (let i = 0; i < goals.length; i++) {

                let goal = goals[i];

                let goalCard = document.createElement('div');
                goalCard.className = 'oneOff';
                goalCard.id = goal._id;

                let goalsCardName = document.createElement('h2');
                goalsCardName.innerHTML = goal.category + ' goal : ' + goal.name;

                let goalsCardDue = document.createElement('p');
                goalsCardDue.innerHTML = "One-off goal due: " + goal.date;

                goalCard.appendChild(goalsCardName);
                goalCard.appendChild(goalsCardDue);

                if(goal.isComplete) {

                    completedGoalsList.appendChild(goalCard);

                } else {

                let goalCardComplete = document.createElement('button');
                goalCardComplete.innerHTML = 'Complete';
                goalCardComplete.addEventListener('click', () => {
                    this.completeGoal(goal._id, goalCard.className);
                });

                let goalCardModify = document.createElement('button');
                goalCardModify.innerHTML = 'Edit';
                goalCardModify.addEventListener('click', () => {
                    this.editGoal(goal._id, goalCard.className, goal.name, goal.category, goal.date);
                });

                let goalCardDelete = document.createElement('button');
                goalCardDelete.innerHTML = 'Remove';
                goalCardDelete.addEventListener('click', () => {
                    this.deleteGoal(goal._id, goalCard.className);
                });

                goalCard.appendChild(goalCardDelete);
                goalCard.appendChild(goalCardModify);
                goalCard.appendChild(goalCardComplete);

                goalList.appendChild(goalCard);

                }

            }

          })
          .catch((error) => {
            console.log(error);
          });

          axios
          .get(`/getRecurringGoals/${userID}`)
          .then((response) => {

            const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            const goals = response.data;

            for (let i = 0; i < goals.length; i++) {

                let goal = goals[i];

                let goalCard = document.createElement('div');
                goalCard.className = 'recurring';

                let goalsCardName = document.createElement('h2');
                goalsCardName.innerHTML = goal.category + ' goal : ' + goal.name;

                let goalsCardDue = document.createElement('p');
                goalsCardDue.innerHTML = "Recurring goal for every " + weekDays[goal.day];

                let goalCardComplete = document.createElement('button');
                goalCardComplete.innerHTML = 'Complete';
                goalCardComplete.addEventListener('click', () => {
                    this.completeGoal(goal._id, goalCard.className);
                });
                

                let goalCardModify = document.createElement('button');
                goalCardModify.innerHTML = 'Edit';
                goalCardModify.addEventListener('click', () => {
                    this.editGoal(goal._id, goalCard.className, goal.name, goal.category, goal.day);
                });

                let goalCardDelete = document.createElement('button');
                goalCardDelete.innerHTML = 'Remove';
                goalCardDelete.addEventListener('click', () => {
                    this.deleteGoal(goal._id, goalCard.className);
                });

                goalCard.appendChild(goalsCardName);
                goalCard.appendChild(goalsCardDue);
                goalCard.appendChild(goalCardDelete);
                goalCard.appendChild(goalCardModify);
                goalCard.appendChild(goalCardComplete);

                goalList.appendChild(goalCard);

            }

          })
          .catch((error) => {
            console.log(error);
          });
    }
      

    handleDayClick = (date) => {
        console.log(date);
        // Do something with the date object, such as update state
    };

    //SHOW THE GOAL FORM

    showGoalForm(isEdit){

        if(isEdit){
            document.getElementById('addNewGoal').classList.add('edit');
        } else {
            document.getElementById('addNewGoal').classList.remove('edit');
        }

        document.getElementById('addNewGoal').classList.remove('hidden');
        document.getElementById('calendar-wrapper').classList.add('hidden');
        document.getElementById('myGoalsContainer').classList.add('hidden');
    }

    //HIDE GOAL FORM

    cancelGoal(event){

        event.preventDefault();
        document.getElementById('addGoalHeader').innerText = 'Add goal';
        document.getElementById('addNewGoal').classList.add('hidden');
        document.getElementById('calendar-wrapper').classList.remove('hidden');
        document.getElementById('myGoalsContainer').classList.remove('hidden');

    }

    //CHANGE FORM BASED ON TYPE INPUT

    changeFormType(){

        let type = document.getElementById('goalType').value;
      
        switch(type) {

            case 'oneOff':
                document.getElementById('goalDateLabel').classList.remove('hidden');
                document.getElementById('goalDate').classList.remove('hidden');
                document.getElementById('goalDate').disabled = false;
                document.getElementById('goalDayLabel').classList.add('hidden');
                document.getElementById('goalDay').classList.add('hidden');
                break;
            case 'recurring':
                document.getElementById('goalDateLabel').classList.add('hidden');
                document.getElementById('goalDate').classList.add('hidden');
                document.getElementById('goalDate').disabled = true;
                document.getElementById('goalDayLabel').classList.remove('hidden');
                document.getElementById('goalDay').classList.remove('hidden');
                break;
            default:
                document.getElementById('goalDateLabel').classList.remove('hidden');
                document.getElementById('goalDate').classList.remove('hidden');
                document.getElementById('goalDayLabel').classList.add('hidden');
                document.getElementById('goalDay').classList.add('hidden');

        }
    }

    //TOGGLE ACHIEVEMENTS TAB

    viewAchievements() {
        document.getElementById('goalsList').classList.toggle('hidden');
        document.getElementById('completedGoalsList').classList.toggle('hidden');
        document.getElementById('calendar-wrapper').classList.toggle('hidden');
        document.getElementById('addNewGoalBtn').classList.toggle('hidden');

        var x = document.getElementById("viewAchievementTxt");
        if (x.innerHTML === "View Achievements") {
            x.innerHTML = "View Current Goals";
        } else {
            x.innerHTML = "View Achievements";
        }

    }

    //FILTER GOALS BY TYPE OF GOAL

    filterGoals(){

       let goalChoice = document.getElementById('goalsNavSelect').value;

       switch (goalChoice) {
        case 'all':
          document.querySelectorAll(".recurring").forEach((el) => el.classList.remove('hidden'));
          document.querySelectorAll(".oneOff").forEach((el) => el.classList.remove('hidden'));
          break;
        case 'oneOff':
          document.querySelectorAll(".recurring").forEach((el) => el.classList.add('hidden'));
          document.querySelectorAll(".oneOff").forEach((el) => el.classList.remove('hidden'));
          break;
        case 'recurring':
          document.querySelectorAll(".recurring").forEach((el) => el.classList.remove('hidden'));
          document.querySelectorAll(".oneOff").forEach((el) => el.classList.add('hidden'));
          break;
        default:
          document.querySelectorAll(".recurring").forEach((el) => el.classList.remove('hidden'));
          document.querySelectorAll(".oneOff").forEach((el) => el.classList.remove('hidden'));
       }

    }

    //COMPLETE A GOAL

    completeGoal(goalID, goalType){

        switch(goalType) {
            case 'oneOff':
                axios
                .post(`/completeOneOffGoal/${goalID}`)
                .then((response) => {
                console.log('worked');
                })
                .catch((error) => {
                console.log(error);
                });
                break;
            case 'recurring':
                axios
                .post(`/completeRecurringGoal/${goalID}`)
                .then((response) => {
                console.log('worked');
                })
                .catch((error) => {
                console.log(error);
                });
                break;
            default:
                console.log("error completing goal"); 
        }

        this.getGoals();

    }

    //DELETE A GOAL

    deleteGoal(goalID, goalType){

        switch(goalType) {
            case 'oneOff':
                axios
                .post(`/deleteOneOffGoal/${goalID}`)
                .then((response) => {
                console.log('worked');
                })
                .catch((error) => {
                console.log(error);
                });
                break;
            case 'recurring':
                axios
                .post(`/deleteRecurringGoal/${goalID}`)
                .then((response) => {
                console.log('worked');
                })
                .catch((error) => {
                console.log(error);
                });
                break;
            default:
                console.log("error completing goal"); 
        }

        this.getGoals();

    }

    //EDIT A GOAL

    editGoal(goalID, goalType, goalName, goalCategory, goalDate){

        switch(goalType){
            case 'oneOff':
                document.getElementById('goalType').value = 'oneOff';
                document.getElementById('goalDate').value = goalDate;
                break;
            case 'recurring':
                document.getElementById('goalType').value = 'recurring';
                document.getElementById('goalDay').value = goalDate;
                break;
            default:
                console.log("error editting goal");

        }

       
        document.getElementById('goalName').value = goalName;
        document.getElementById('goalCatergory').value = goalCategory;

        this.showGoalForm(true);
        this.changeFormType();
        document.getElementById('addGoalHeader').innerText = 'Edit existing goal';

        var goalForm = document.getElementById('addGoalForm');

        goalForm.addEventListener("submit", (ev) => {
            ev.preventDefault();
            this.deleteGoal(goalID, goalType);
        });

        this.getGoals();

    }
    
    //GATHER GOAL INPUTS AND SEND TO DB

    addNewGoal(event){

        event.preventDefault();

        let type = document.getElementById('goalType').value;

        let userID = localStorage.getItem("userID");
        let goalName = document.getElementById('goalName').value;
        let goalCatergory = document.getElementById('goalCatergory').value;
        let goalDate = document.getElementById('goalDate').value;
        let goalDay = document.getElementById('goalDay').value;

        switch(type){
            case 'oneOff':
                axios
                .post("/addNewOneOffGoal", {
                    user_id: userID,
                    name: goalName,
                    category: goalCatergory,
                    date: goalDate,
                    isComplete: false
                  })
                .then((response) => {
                    this.getGoals();
                    this.cancelGoal(event);
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
                break;
            case 'recurring':
                axios
                .post("/addRecurringGoal", {
                    user_id: userID,
                    name: goalName,
                    category: goalCatergory,
                    day: goalDay,
                    isComplete: false
                  })
                .then((response) => {
                    this.getGoals();
                    this.cancelGoal(event);
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
                break;
            default:
                console.log("error");
        }
    }

    render() {
        return (
            <>
                <section id="calendar-wrapper" >
                    <Calendar className="my-calendar" onClickDay={this.handleDayClick} />
                </section>


                <section id="myGoalsContainer">

                    <nav className="goalsNav">
                        <ul>
                            <li id="viewAchievements" onClick={this.viewAchievements}><i className="fa-solid fa-clock-rotate-left"></i><span id="viewAchievementTxt">View Achievements</span></li>
                            <li>
                                View
                                <select onChange={this.filterGoals} name="goalsNavSelect" id="goalsNavSelect">
                                <option value="all">All Goals</option>
                                <option value="oneOff">One-off Goals</option>
                                <option value="recurring">Recurring Goals</option>
                                </select>
                            </li>
                            <li id='addNewGoalBtn' onClick={() => this.showGoalForm(false)}><i className="fa-solid fa-circle-plus"></i>Add Goal</li>
                        </ul>
                    </nav>

                    <div id="goalsList">
                    
                    </div>

                    <div id="completedGoalsList" className="hidden">

                    </div>   

                </section>

                <section id="addNewGoal" className="hidden">

                    <h3><i className="fa-solid fa-bullseye"></i> <span id="addGoalHeader">Add new goal</span></h3>

                    <form id="addGoalForm" onSubmit={this.addNewGoal}>

                    <label htmlFor="goalType">Type</label>
                    <select onChange={this.changeFormType} name="goalType" id="goalType">
                        <option value="oneOff">One-Off</option>
                        <option value="recurring">Recurring</option>     
                    </select>

                        <label htmlFor="goalCatergory">Catergory</label>
                        <select name="goalCatergory" id="goalCatergory">
                            <option value="Fitness">Fitness</option>
                            <option value="Nutrition">Nutrition</option>
                            <option value="Health">Health</option>     
                        </select>

                        <label htmlFor="goalName">Goal</label>
                        <input type="text" id="goalName" name="goalName" required></input>

                        <label id='goalDateLabel' htmlFor="goalDate">Date to complete</label>
                        <input type="date" id="goalDate" name="goalDate" min={new Date().toISOString().split('T')[0]} required></input>

                        <label id='goalDayLabel' htmlFor="goalDay" className="hidden">Day</label>
                        <select name="goalDay" id="goalDay" className="hidden">
                            <option value="0">Monday</option>  
                            <option value="1">Tuesday</option>  
                            <option value="2">Wednesday</option>  
                            <option value="3">Thursday</option>  
                            <option value="4">Friday</option>  
                            <option value="5">Saturday</option>  
                            <option value="6">Sunday</option>   
                        </select>

                        <button onClick={this.cancelGoal}>Cancel</button>
                        <input type="submit" value="Create Goal"></input>

                    </form>

                </section>
            </>
        )
    }
}

export default Goals;