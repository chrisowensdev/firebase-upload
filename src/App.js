import { useState } from 'react';

import './App.css';
import { storage } from './firebase';

function App() {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    console.log('image: ', image);

    const handleUpload = () => {
        (async () => {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref('images')
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            setUrl(url);
                        });
                }
            );

            let data = {
                avatarUrl: url,
            };
            console.log(data.avatarUrl);

            const response = await fetch(
                `http://localhost:3333/user/update/5fab384fed94157b25971397`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );
            console.log(await response.json());
        })();
    };

    return (
        <div className='App'>
            <progress value={progress} max='100' />
            <input type='file' onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default App;
