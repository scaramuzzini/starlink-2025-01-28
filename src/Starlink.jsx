import axios from 'axios';
import { useState, useEffect } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css';
import { Marker, Popup } from 'react-leaflet';

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
        satelites
        <MapContainer center={[51,0]} zoom={2} style={{height: '80vh'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />  
            <Marker position={[51,0]}>

            </Marker>
            {
                satelites
                    .filter((sat) => sat.longitude && sat.latitude)
                    .map((sat) => (
                        <Marker position={[sat.latitude, sat.longitude ]}>
                            <Popup>
                                <h2>
                                    {sat.spaceTrack.OBJECT_NAME}
                                </h2>
                                <p>{sat.velocity_kms}</p>
                            </Popup>
                        </Marker>
                    )
                )
            }
        </MapContainer>
    </>
}

export default Starlink;    