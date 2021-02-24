import React from "react"
import SignInForm from "./Login"
import SignUpPage from "./Register"
import "../../css/LoginRegister.css"
import { connect } from 'react-redux';
import { compose } from 'recompose';

class LoginRegisterBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginBox: true,
        };
    }
    componentWillUnmount(){
        this.props.applyUnloggedErrorr(false)
    }

    render() {
        let loginBox = this.state.loginBox
        return (
            <div className="root_container">
                <div className="errorCauseUnlogged">
                    {this.props.unloggedError && "You must log in to use the function"}
                </div>
                <div className="inside_root_container">
                    <div className="box_controller">
                        <div className={"activeForm"}>
                            <div
                                onClick={() => {
                                    if (loginBox === true) {
                                        this.setState({
                                            loginBox: false
                                        })
                                    }
                                    else {
                                        this.setState({
                                            loginBox: true
                                        })
                                    }
                                }}
                            >
                                {loginBox ? "Sign Up" : "Sign In"}
                            </div>
                        </div>
                        <div className={"inactiveForm"}>
                            {loginBox ? "Sign In" : "Sign Up"}
                        </div>
                    </div>
                    <div className="box_container">
                        {loginBox ? <SignInForm /> : <SignUpPage />}
                        {/* {this.state.isRegisterOpen && <SignUpPage />} */}
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    unloggedError: state.otherState.unloggedError,
})
const mapDispatchToProps = dispatch => ({
    applyUnloggedErrorr: unloggedError =>
        dispatch({ type: 'UNLOGGED_ERROR_SET', unloggedError }),
});

export default compose(
    connect(mapStateToProps,
        mapDispatchToProps),
)(LoginRegisterBox)
