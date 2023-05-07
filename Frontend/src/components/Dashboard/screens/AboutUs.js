import React from "react";

class AboutUs extends React.Component {
    render(){
        return(
            <section className="aboutUsContainer">
            <p>Achievify is a free to use application which promotes healthy well being and happiness for everyone. Through our suggested reccomendations on fitness, nutrition, and lifestyle - you can set, track, and achieve your personal goals.</p>
            <img id="aboutUsImg" alt="woman and man exercising" src={require('../../../resources/aboutUs.png')}/>
            <p>Created by Ewan Allison of Glasgow Caledonian University</p>
            </section>
        )
    }
}

export default AboutUs;