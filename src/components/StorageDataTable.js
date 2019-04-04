import React, {Component} from 'react'

class StorageDataTable extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        let messageNodes = this.props.rows.map((r) => {
            return (
                <tr key={r.no + r.name}>
                    <td>{r.no}</td>
                    <td>{r.name}</td>
                    <td>{r.contentType}</td>
                    <td>{r.size}</td>
                    <td><a target="_blank" href={r.downloadURLs}>Download</a></td>
                    <td><a target="_blank" onClick={(e) => this.props.deleteData(e, r)}>Delete</a></td>
                </tr>
            )
        })
        return (
            <div>
                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>No.</th>
                            <th>File Name</th>
                            <th>File Type</th>
                            <th>File Size</th>
                            <th style={{ width: '10%' }}>Download</th>
                            <th style={{ width: '10%' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messageNodes}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default StorageDataTable