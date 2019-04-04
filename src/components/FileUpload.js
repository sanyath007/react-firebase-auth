import React, {Component} from 'react'
import {FilePond, File, registerPlugin} from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import StorageDataTable from './StorageDataTable'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

class FileUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [
                {
                    source: "index.html",
                    options: {
                        type: "local"
                    }
                }
            ],
            uploadValue: 0,
            fileMetadata: [],
            rows: [],
        }
    }

    componentWillMount() {
        this.getMetadataFromDatabase()
    }

    getMetadataFromDatabase() {
        const databaseRef = this.props.db.database().ref('/filepond')

        databaseRef.on('value', snapshot => {
            this.setState({
                fileMetadata: snapshot.val()
            }, () => this.addMetadataToList())
        })
    }

    addMetadataToList() {
        let i = 1
        let rows = []

        for(let key in this.state.fileMetadata) {
            let fileData = this.state.fileMetadata[key]
            let objRows = {
                no: i++,
                key: key,
                name: fileData.metadataFile.name,
                downloadURLs: fileData.metadataFile.downloadURLs,
                fullPath: fileData.metadataFile.fullPath,
                size: (fileData.metadataFile.size),
                contentType: fileData.metadataFile.contentType
            }

            rows.push(objRows)
        }

        this.setState({
            rows: rows
        }, () => {
            console.log('Set rows')
        })
    }

    deleteMetadataFromDatabase(e, rowData) {
        console.log(e, rowData)
    }

    handleInit() {
        console.log('now initialised', this.pond)
    }

    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        console.log('handle file upload here')
        console.log(file)
        
        const fileUpload = file
        const storageRef = this.props.db.storage().ref(`filepond/${file.name}`)
        console.log(storageRef)
        const task = storageRef.put(fileUpload)
        console.log(task)

        task.on(`state_changed`, (snapshot) => {
            console.log(snapshot.bytesTransferred, snapshot.totalBytes)
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            /** Process */
            this.setState({
                uploadValue: percentage
            })
        }, (error) => {
            /** Error */
            this.setState({
                message: `Upload error : ${error.message}`
            })
        }, () => {
            /** Success */
            this.setState({
                message: `Upload success`,
                picture: task.snapshot.downloadURL /** เผื่อนำไปใช้ต่อในการแสดงรูปที่ upload ไป */
            })

            let downloadURL = '';
            storageRef.getDownloadURL().then(url => {
                console.log(url)
                downloadURL = url
            }).catch(error => {
                console.log(error)
            })

            /** Get metadata */
            storageRef.getMetadata().then((metadata) => {
                console.log(metadata)
                let metadataFile = {
                    name: metadata.name,
                    size: metadata.size,
                    contentType: metadata.contentType,
                    fullPath: metadata.fullPath,
                    downloadURLs: downloadURL
                }
                console.log(metadataFile)

                /** Save metadata */
                const databaseRef = this.props.db.database().ref('/filepond')
                console.log(databaseRef)
                databaseRef.push({ metadataFile })
            }).catch((error) => {
                this.setState({
                    message: `Upload error : ${error.message}`
                })
            })
        })
    }

    render() {
        const { rows, fileMetadata } = this.state

        return (
            <div className="App">
                <div className="Margin-25">
                    {/* Pass FilePond properties as attributes */}
                    <FilePond allowMultiple={true}
                            maxFile={3}
                            ref={ref => (this.pond = ref)}
                            server={{ process: this.handleProcessing.bind(this) }}
                            oninit={() => this.handleInit()}>
                        {/* Set current file using the <File/> component */}
                        {this.state.files.map(file => (
                            <File key={file} source={file} />
                        ))}
                    </FilePond>

                    <StorageDataTable
                        rows={rows}
                        fileMetadata={fileMetadata}
                        deleteData={this.deleteMetadataFromDatabase}
                    />
                </div>
            </div>
        )
    }
}

export default FileUpload