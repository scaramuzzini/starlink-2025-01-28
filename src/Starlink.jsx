import axios from 'axios';
import { useState, useEffect,useRef } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import 'leaflet/dist/leaflet.css';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const satelliteIcon = new L.Icon({
    iconUrl: 'satellite.png', 
    iconSize: [25, 25], 
    iconAnchor: [12, 12], 
    popupAnchor: [0, -12] 
  });
  
function Starlink() {

    const [satelites, setSatelites] = useState([]);
    const isPrimeiraRequisicao = useRef(true);

    useEffect(() => {
        if (isPrimeiraRequisicao.current) {
            console.log('primeira requisicao');
            fetchStarlink();
            isPrimeiraRequisicao.current = false;
          }
    },[]);

    const fetchStarlink = async () => {
        const response = await axios.post('https://api.spacexdata.com/v4/starlink/query'
            , {
                "query": {},
                "options": {
                    limit: 100
                }
            }
        );
        console.log(response.data.docs);
        setSatelites(response.data.docs);
    };

    return <>
        <h1>Lista de satélites Starlink</h1>
        <MapContainer center={[51,0]} zoom={2} style={{height: '80vh'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />  
            {
                satelites
                    .filter((sat) => sat.longitude && sat.latitude)
                    .map((sat) => (
                        <Marker position={[sat.latitude, sat.longitude ]}
                            icon={satelliteIcon}
                            key={sat.id}>
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
        Total carregado: {satelites.length}
    </>
}

export default Starlink;    