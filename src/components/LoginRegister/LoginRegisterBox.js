import React from "react"
import SignInForm from "./Login"
import SignUpPage from "./Register"
import '../../css/LoginRegister.css'
class LoginRegisterBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isLoginOpen: true,
          isRegisterOpen: false
        };
    }

     showLoginBox() {
        this.setState({isLoginOpen: true, isRegisterOpen: false});
        }
        
     showRegisterBox() {
        this.setState({isRegisterOpen: true, isLoginOpen: false});
        }

        render() {
            return (
                <div className="root-container">
                  <div className="box-controller">
                      <div
                          className={"controller " + (this.state.isLoginOpen
                          ? "selected-controller"
                          : "")}
                          onClick={this
                          .showLoginBox
                          .bind(this)}>
                          Zaloguj się
                      </div>
                      <div
                          className={"controller " + (this.state.isRegisterOpen
                          ? "selected-controller"
                          : "")}
                          onClick={this
                          .showRegisterBox
                          .bind(this)}>
                          Zarejestruj się
                      </div>
                  </div>
                  <div className="box-container">
                  {this.state.isLoginOpen && <SignInForm />}
                  {this.state.isRegisterOpen && <SignUpPage />}
                  </div>
              </div>
            );
        }
      
}

export default LoginRegisterBox  