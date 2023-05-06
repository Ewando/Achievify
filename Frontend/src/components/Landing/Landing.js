//IMPORTS 

import React from 'react';
import './Landing.scss';
import axios from "axios";

class Landing extends React.Component {

    //CONSTRUCTOR

    constructor(props) {

        super(props);
        this.toLogin = this.toLogin.bind(this);
        this.toRegister = this.toRegister.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.handleUserSignUp = this.handleUserSignUp.bind(this);
        this.handleUserLogin = this.handleUserLogin.bind(this);

    }

     //DISPLAYS LOGIN FUNCTIONALITY TO USER

     toLogin(){
        this.clearErrors();
        document.getElementById("userSignUp").classList.add("hidden");
        document.getElementById("userLogin").classList.remove("hidden");
    }

    //DISPLAYS REGISTER FUNCTIONALITY TO USER

    toRegister(){
  
        this.clearErrors();
        document.getElementById("userSignUp").classList.remove("hidden");
        document.getElementById("userLogin").classList.add("hidden");
    }


    clearErrors() {
        document.getElementById("registerErrors").textContent = '';
        document.getElementById("registerSuccess").textContent = '';
    }

    //HANDLE WHEN USER SIGNS UP

    handleUserSignUp(event) {

        event.preventDefault();

        this.clearErrors();

        var name = document.getElementById("createName").value;
        var email = document.getElementById("createEmail").value;
        var password = document.getElementById("createPwd").value;
          
        axios
        .post("https://achievifybackend.onrender.com/register", { name, email, password })
        .then((response) => {
            document.getElementById("registerSuccess").textContent = 'Account created...';
            setTimeout(() => {this.toLogin()}, 1000);
        })
        .catch((error) => {
            console.log(error);
            document.getElementById("registerErrors").textContent = error.response.data;
            document.getElementById("createName").value = '';
            document.getElementById("createEmail").value = '';
            document.getElementById("createPwd").value = '';
        });

    }

    //HANDLE WHEN USER LOGS IN

    handleUserLogin(event) {

        event.preventDefault();

        this.clearErrors();

        var userEmail = document.getElementById("loginEmail").value;
        var userPassword = document.getElementById("loginPwd").value;

        axios
        .post("https://achievifybackend.onrender.com/login", { email: userEmail, password: userPassword })
        .then((response) => {

            document.getElementById('loadingIcon').classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('loadingIcon').classList.remove('fa-spin');
                document.getElementById('loadingIcon').classList.add('fa-check');
            }, 400);

            setTimeout(() => {
                localStorage.setItem('token', response.data.token);
                this.props.setStateOfParent("dashboardScreen");
                localStorage.setItem('userID', response.data.id);
            }, 600);

        })
        .catch((error) => {

            console.log(error);
            document.getElementById("loginErrors").textContent = error.response.data;

        })
      
    }

    //ENABLE BUTTON WHEN FORM IS COMPLETE

    checkFormComplete(){

        const createNameInput = document.getElementById("createName");
        const createEmailInput = document.getElementById("createEmail");
        const createPwdInput = document.getElementById("createPwd");
        const loginEmailInput = document.getElementById("loginEmail");
        const loginPwdInput = document.getElementById("loginPwd");
        const accountNextBtn = document.getElementById("accountNext");
        const loginBtn = document.getElementById("loginBtn");
    
        if(createNameInput.value && createEmailInput.value && createPwdInput.value){
            accountNextBtn.classList.add("submitActive");
        } else {
            accountNextBtn.classList.remove("submitActive");
        }
    
        if(loginEmailInput.value && loginPwdInput.value){
            loginBtn.classList.add("submitActive");
        } else {
            loginBtn.classList.remove("submitActive");
        }
    }

   
    render() {

        return (
         
            <div id='landingContainer' className='screen'>

                <main id='landingCard'>

                    <h1 id='mobileHeader'>Achivify</h1>

                    <form id="userSignUp" className="hidden" onSubmit={this.handleUserSignUp}> 

                        <h2>Create your account</h2>
                        <h3 id='registerErrors'> </h3>
                        <h3 id='registerSuccess'> </h3>

                        <label htmlFor="createName">Name</label><br/>
                        <input onChange={this.checkFormComplete} required type="text" id="createName" name="createName"/><br/>

                        <label htmlFor="email">Email</label><br/>
                        <input onChange={this.checkFormComplete} required type="email" id="createEmail" name="createEmail"/><br/>

                        <label htmlFor="createPwd">Password</label><br/>
                        <input onChange={this.checkFormComplete} required type="password" id="createPwd" name="createPwd"/><br/>

                        <input id="accountNext" type="submit" value="Register" />

                        <p><span onClick={this.toLogin}>Login to account</span></p>

                    </form>

                    <form id="userLogin" onSubmit={this.handleUserLogin}> 

                        <h2>Login</h2>
                        <h3 id='loginErrors'> </h3>

                        <label htmlFor="loginEmail">Email</label><br/>
                        <input onChange={this.checkFormComplete} required type="email" id="loginEmail" name="loginEmail"/><br/>

                        <label htmlFor="loginPwd">Password</label><br/>
                        <input onChange={this.checkFormComplete} required type="password" id="loginPwd" name="loginPwd"/><br/>


                        <input id="loginBtn" type="submit" value="Login"/>
                        <p><span onClick={this.toRegister}><br/>Create a account</span></p>
                        <i id='loadingIcon' className="fas fa-sync fa-spin hidden"></i>

                    </form>

                </main>

                <aside>

                <h1>Achivify</h1>

                <img alt="hospital workers" src={require('../../resources/login.png')}/>

                <p>
                Achievify is a free to use application which promotes healthy well being and happiness for everyone. Through our suggested reccomendations on fitness, nutrition, and lifestyle - you can set, track, and achieve your personal goals. Sign up today!
                </p>
                
                </aside>

            </div>

        );

    }

}

export default Landing;