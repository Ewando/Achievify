import React from 'react';
import './Dashboard.scss';
import HealthyTips from './screens/HealthyTips';
import Goals from './screens/Goals';
import AboutUs from './screens/AboutUs';
import Settings from './screens/Settings';

class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleNavMenu = this.toggleNavMenu.bind(this);
        this.state = { currentScreen: "healthyTips"};
        this.child = React.createRef();
    }

    screenComponents = {
        healthyTips: HealthyTips,
        goals: Goals,
        aboutUs: AboutUs,
        settings: Settings
    }

    handleLogout(){
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        window.location.href = "/"; 
    }

    toggleNavMenu() {

        document.getElementById("mobileNavInner").classList.toggle("hidden");
        document.getElementById("navHamburger").classList.toggle("fa-heart-pulse");
        document.getElementById("navHamburger").classList.toggle("fa-xmark");

    }

    hideMobileNav() {
        document.getElementById("mobileNavInner").classList.add("hidden");
    }

    render() {

        const currentScreen = this.state.currentScreen;
        const CurrentScreen = this.screenComponents[currentScreen];

        return (

            <div id='dashboardContainer' className='screen'>

                
        
                <nav id='desktopNav'>
                 <h1>Achivify</h1>
                    <ul>
                        <li onClick={() => this.setState({currentScreen: "healthyTips"})} className={this.state.currentScreen === "healthyTips" ? "navActive": ""}>Healthy Tips<i id='navHamburger' className="fa-solid fa-heart-pulse"></i></li>
                        <li onClick={() => this.setState({currentScreen: "goals"})} className={this.state.currentScreen === "goals" ? "navActive": ""}>My Goals<i className="fa-solid fa-bullseye"></i></li>
                        <hr></hr>
                        <li onClick={() => this.setState({currentScreen: "aboutUs"})} className={this.state.currentScreen === "aboutUs" ? "navActive": ""}>About Us<i className="fa-solid fa-circle-info"></i></li>
                        <li onClick={() => this.setState({currentScreen: "settings"})} className={this.state.currentScreen === "settings" ? "navActive": ""}>Settings<i className="fa-solid fa-gear"></i></li>
                        <li onClick={this.handleLogout} id='logoutBtn'>Logout<i className="fa-solid fa-arrow-right-from-bracket"></i></li>
                    </ul>
                </nav>

                <nav className="mobileNav" id='mobileNav'>
                    <i onClick={this.toggleNavMenu} className="fa-solid fa-bars"></i>
                    <h1>Achivify</h1>
                    <ul id='mobileNavInner' className='hidden'>
                        <li onClick={() => this.setState({currentScreen: "healthyTips"}, this.hideMobileNav)} className={this.state.currentScreen === "healthyTips" ? "navActive": ""}>Healthy Tips<i className="fa-solid fa-heart-pulse"></i></li>
                        <li onClick={() => this.setState({currentScreen: "goals"}, this.hideMobileNav)} className={this.state.currentScreen === "goals" ? "navActive": ""}>My Goals<i className="fa-solid fa-bullseye"></i></li>
                        <hr></hr>
                        <li onClick={() => this.setState({currentScreen: "aboutUs"}, this.hideMobileNav)} className={this.state.currentScreen === "aboutUs" ? "navActive": ""}>About Us<i className="fa-solid fa-circle-info"></i></li>
                        <li onClick={() => this.setState({currentScreen: "settings"}, this.hideMobileNav)} className={this.state.currentScreen === "settings" ? "navActive": ""}>Settings<i className="fa-solid fa-gear"></i></li>
                        <li onClick={this.handleLogout} id='logoutBtn'>Logout<i className="fa-solid fa-arrow-right-from-bracket"></i></li>
                    </ul>
                </nav>

                <main>

                    <CurrentScreen ref={this.child}/>

                </main>

            </div>
        )
    }

}

export default Dashboard;
