import axios from 'axios';
import { useEffect } from 'react';

function Starlink() {
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
        }

        fetchStarlink();
    });

    return <h1>Lista de satélites Starlink</h1>
}

export default Starlink;    