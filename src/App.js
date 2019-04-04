import React, { Component } from 'react'
// import SigninForm from './components/SigninForm'
import Header from './components/Header'
// import MessageList from './components/MessageList'
// import MessageBox from './components/MessageBox'
// import LoginForm from './components/LoginForm'
import FileUpload from './components/FileUpload'

import firebase from './firebase'

// import logo from './logo.svg'
import './App.css'

class App extends Component {
    componentDidMount() {
        console.log(firebase.database().ref('messages'))
    }

    render() {
        return (
            <div className="container">
                <Header title="Simple Firebase App" />

                {/* <h1>FirebaseUI-React</h1>
                <h1>with Firebase Authentication</h1>
                <p>Please sign in :</p>
                <SigninForm /> */}

                {/* <div className="columns">
                    <div className="column is-3"></div>
                    <div className="column is-6">
                        <MessageList db={firebase} />
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-3"></div>
                    <div className="column is-6">
                        <MessageBox db={firebase} />
                    </div>
                </div> */}
                <FileUpload db={firebase} />
            </div>
        )
    }
}

export default App
