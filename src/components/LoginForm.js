import React from 'react'
import auth from '../firebase'

class LoginForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            currentUser: null,
            message:''
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if(user) {
                this.setState({
                    currentUser: user
                })
            }
        })
    }

    logout = e => {
        e.preventDefault()
        auth.signOut().then(response => {
            this.setState({
                currentUser: null
            })
        })
    }

    onChange = e => {
        const { name, value } = e.target

        this.setState({
            [name]: value
        })
    }

    onSubmit = e => {
        e.preventDefault()

        const { email, password } = this.state

        auth
            .signInWithEmailAndPassword(email, password)
            .then(response => {
                this.setState({
                    currentUser: response.user
                })
            })
            .catch(error => {
                this.setState({
                    message: error.message
                })
            })
    }

    render() {
        const { message, currentUser } = this.state

        if(currentUser) {
            return (
                <div>
                    <p>Hello {currentUser.email}</p>
                    <button onClick={this.logout}>Logout</button>
                </div>
            )
        }

        return (
            <section className="section container">

                {message ? <p className="help is-danger">{message}</p> : null}

                <div className="columns is-centered">
                    <div className="column is-half">
                        <form onSubmit={this.onSubmit}>
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control has-icons-left has-icons-right">
                                    <input className="input" type="email" name="email" onChange={this.onChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>
                            
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control has-icons-left has-icons-right">
                                    <input className="input" type="password" name="password" onChange={this.onChange} />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-envelope"></i>
                                    </span>
                                </div>
                            </div>
                            
                            <div className="field is-grouped">
                                <div className="control">
                                    <button className="button is-link">Submit</button>
                                </div>
                                <div className="control">
                                    <button className="button is-text">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        )
    }
}

export default LoginForm