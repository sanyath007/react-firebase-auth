import React, {Component} from 'react'
import Message from './Message'
import _ from 'lodash'

class MessageList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: []
        }

        let app = this.props.db.database().ref('messages')
        app.on('value', snapshot => {
            this.getData(snapshot.val())
        })
    }

    getData(values) {
        console.log(values)
        console.log(_(values).keys())
        
        let messagesVal = values
        let messages = _(messagesVal)
                        .keys()
                        .map(messageKey => {
                            let cloned = _.clone(messagesVal[messageKey])
                            cloned.key = messageKey
                            return cloned
                        }).value()

        console.log(messages)
        this.setState({
            messages: messages
        })
    }

    render() {
        let messageNodes = this.state.messages.map(message => {
            console.log(message.message)
            return (
                <div className="card" key={message.key}>
                    <div className="card-content">
                        <Message
                            msgKey={message.key} 
                            message={message.message}
                            db={this.props.db}
                        />
                    </div>
                </div>
            )
        })
        return (
            <div>
                {messageNodes}
            </div>
        )
    }
}
export default MessageList