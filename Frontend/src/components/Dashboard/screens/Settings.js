import React from "react";

class Settings extends React.Component {
    render(){
        return(
            <section className="settingsContainer">

                <div className="settingsCard"><h3>Customization</h3></div>
                <div className="settingsCard"><h3>My Profile</h3></div>
                <div className="settingsCard"><h3>Accessability</h3></div>
                <div className="settingsCard"><h3>Terms and Conditions</h3></div>

            </section>
        )
    }
}

export default Settings;