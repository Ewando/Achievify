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
    }

    //ON PAGE LOAD, LOAD GOALS FROM DB

    componentDidMount(){
        this.getGoals();
    }

    //LOAD GOALS FROM DB AND POPULATE FRONTEND

    getGoals() {

        let goalList = document.getElementById('goalsList');
        goalList.innerHTML = '';

        const userID = localStorage.getItem("userID");
     
        axios
          .get(`/getOneOffGoals/${userID}`)
          .then((response) => {

            const goals = response.data;

            for (let i = 0; i < goals.length; i++) {

                let goal = goals[i];

                let goalCard = document.createElement('div');
                goalCard.className = 'oneOff';

                let goalsCardType = document.createElement('p');
                goalsCardType.innerHTML = "One-off Goal";

                let goalsCardName = document.createElement('h2');
                goalsCardName.innerHTML = goal.category + ' | ' + goal.name;

                let goalsCardDue = document.createElement('p');
                goalsCardDue.innerHTML = "Due: " + goal.date;

                goalCard.appendChild(goalsCardName);
                goalCard.appendChild(goalsCardType);
                goalCard.appendChild(goalsCardDue);

                goalList.appendChild(goalCard);

            }

            console.log(goals);
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

                let goalsCardType = document.createElement('p');
                goalsCardType.innerHTML = "Recurring Goal";

                let goalsCardName = document.createElement('h2');
                goalsCardName.innerHTML = goal.category + ' | ' + goal.name;

                let goalsCardDue = document.createElement('p');
                goalsCardDue.innerHTML = "Every " + weekDays[goal.day];

                goalCard.appendChild(goalsCardName);
                goalCard.appendChild(goalsCardType);
                goalCard.appendChild(goalsCardDue);

                goalList.appendChild(goalCard);

            }

            console.log(goals);
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

    showGoalForm(){
        document.getElementById('addNewGoal').classList.remove('hidden');
        document.getElementById('calendar-wrapper').classList.add('hidden');
        document.getElementById('myGoalsContainer').classList.add('hidden');
    }

    //HIDE GOAL FORM

    cancelGoal(event){

        event.preventDefault();
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
                            <li><i className="fa-solid fa-clock-rotate-left"></i>View Achievements</li>
                            <li>
                                View
                                <select onChange={this.filterGoals} name="goalsNavSelect" id="goalsNavSelect">
                                <option value="all">All Goals</option>
                                <option value="oneOff">One-off Goals</option>
                                <option value="recurring">Recurring Goals</option>
                                </select>
                            </li>
                            <li><i onClick={this.showGoalForm} className="fa-solid fa-circle-plus"></i>Add Goal</li>
                        </ul>
                    </nav>

                    <div id="goalsList">
                    
                    </div>

                   

                </section>

                <section id="addNewGoal" className="hidden">

                    <h3><i className="fa-solid fa-bullseye"></i> Add new goal</h3>

                    <form onSubmit={this.addNewGoal}>

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
                        <input type="date" id="goalDate" name="goalDate" required></input>

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