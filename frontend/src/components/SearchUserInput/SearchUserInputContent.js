import React from 'react';
import '../../css/SearchUserInput.css'
import loupe from './loupe.svg'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'


class SearchUserInputContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            error: null
        };

    };

    onSubmit = event => {
        const { nickname } = this.state;
        const { history } = this.props;
        history.push("/eune/" + nickname.toLowerCase())

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ nickname: event.target.value });
    };


    render() {
        const { nickname, error } = this.state;

        const isInvalid = nickname === '' || nickname.length < 3

        return (
            <div id="SearchUserInputContent">
                <div>
                    <img id='loupe' src={loupe} alt="loupe" />
                    <div id="inputTitle">
                        <span>Paste League of Legends nickname you want to stalk!</span>
                    </div>
                </div>
                <div id="SearchInput">
                    <form className="SearchInputform" onSubmit={this.onSubmit}>
                        <div id="SearchInputNickname">
                            <TextField className="outlined-basic" label="Nickname" variant="outlined"
                                name="nickname"
                                value={nickname}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Nickname"
                            />
                        </div>
                        <div id="submitSearch">
                            <Button id="findButton" disabled={isInvalid} type="submit" variant="outlined" color="primary">
                                Stalk!
                            </Button>
                        </div>
                        {error && <div className="errorLoginRegister">{error.message}</div>}
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchUserInputContent);

