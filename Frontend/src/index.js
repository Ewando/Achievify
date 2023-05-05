//IMPORTS

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing'

class Main extends React.Component {

    //CONSTUCTOR

    constructor(props) {

        super(props);
        this.state = { currentPage: "landingScreen"};
        this.setStateOfParent = this.setStateOfParent.bind(this);

      }

      //ON LOAD CHECK FOR JWT

      componentDidMount() {

        const token = localStorage.getItem('token');
      
        if (token) {
          this.setState({currentPage: "dashboardScreen"});
        }
      }

      //SET THE CURRENT PAGE
    
      setStateOfParent(page) {
        this.setState({ currentPage: page });
      }

      //LIST OF PAGES
    
      pageComponents = {
        landingScreen: Landing,
        dashboardScreen: Dashboard,
      };
    
      //RENDER THE CURRENT PAGE

      render() {
        const CurrentPage = this.pageComponents[this.state.currentPage];
        return <CurrentPage setStateOfParent={this.setStateOfParent}/>;
      }

}


class App extends React.Component {
    render(){return(<Main/>);}
  }
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);