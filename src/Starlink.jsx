import axios from 'axios';
import { useState, useEffect } from 'react';

function Starlink() {

    const [satelites, setSatelites] = useState([]);

    useEffect(() => {
        const fetchStarlink = async () => {
            const response = await axios.post('https://api.spacexdata.com/v4/starlink/query'
                , {
                    "query": {},
                    "options": {
                        limit: 10
                    }
                }
            );
            console.log(response.data.docs);
            setSatelites(response.data.docs);
        }
        fetchStarlink();
    },[]);

    return <>
        <h1>Lista de satélites Starlink</h1>
        <ul>
            {
                satelites.map((sat) => (
                        <li key={sat.id}> {sat.spaceTrack.OBJECT_NAME}</li>
                    )
                )
            }
        </ul>
    </>
}

export default Starlink;    