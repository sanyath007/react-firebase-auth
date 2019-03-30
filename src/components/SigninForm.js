import React, { Component } from 'react'

/** Firebase */
import firebase from '../firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
/** Css */
import '../App.css'

class SigninForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isSignedIn: false
        }
    }

    /** Confif firebaseUI */
    uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccess: () => false
        }
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        )
    }

    componentWillMount() {
        this.unregisterAuthObserver()
    }

    unregisterAuthObserver() {
        
    }

    render() {
        if(!this.state.isSignedIn) {
            return (
                <div className="container">
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                </div>
            )
        }

        return (
            <div className="container">
                <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed in!</p>
        
                <figure className="image is-128x128">
                    <img id="photo" className="is-rounded" src={firebase.auth().currentUser.photoURL} />
                </figure>
                <button onClick={() => firebase.auth().signOut()} className="button is-primary">Sign out</button>
            </div>
        )
    }
}

export default SigninForm
