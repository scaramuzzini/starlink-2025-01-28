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
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
  

    useEffect(() => {
        if (isPrimeiraRequisicao.current) {
            console.log('primeira requisicao');
            fetchStarlink(page);
            isPrimeiraRequisicao.current = false;
          }
    },[]);

    const fetchStarlink = async (page) => {
        const response = await axios.post('https://api.spacexdata.com/v4/starlink/query'
            , {
                "query": {},
                "options": {
                    limit: 100,
                    page: page
                }
            }
        );
        console.log(response.data.docs);
        setSatelites((prevSat) => [...prevSat, ...response.data.docs]);
        setTotal(response.data.totalDocs);
        setHasMore(response.data.hasNextPage);
    };

    const carregarMais = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStarlink(nextPage);
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
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <button onClick={carregarMais}>
            Carregar mais
          </button>
          <p>
            Total carregado: {satelites.length} Pagina Atual: {page}
          </p>
        </div>
    </>
}

export default Starlink;    