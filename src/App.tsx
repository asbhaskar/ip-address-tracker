import React, {useState, useEffect} from 'react';
import './App.css';
import InfoDisplay from './Components/InfoDisplay/InfoDisplay';
import Map from './Components/Map/Map';
import { CircularProgress } from '@material-ui/core';
import { LatLngExpression } from 'leaflet';
import publicIp from 'public-ip';
import submitArrow from './images/icon-arrow.svg';

const App = () => {
    const [isLoading, setIsLoading] = useState < Boolean > (true)
    const [location, setLocation] = useState('')
    const [infoData, setInfoData] = useState < String[] > ([])
    const infoDescriptions = ["IP ADDRESS", "LOCATION", "TIMEZONE", "ISP"]
    const [coords, setCoords] = useState < LatLngExpression > ([0,0])
	const [errorMessage, setErrorMessage] = useState('') 

	useEffect(() => {
		const getIP = async () => {
			const clientIP: string = await publicIp.v4()
				.catch((err) => {console.log(err)}) || ''
			setLocation(clientIP)
			return clientIP
		}
		getIP().then((clientIP) => updateInfoData(`ipAddress=${clientIP}`))
	},[])

	const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		setIsLoading(true)
		//ipv4 and ipv6 from https://ihateregex.io/expr/ip/
		const domainRegex = new RegExp('^(?!-)[A-Za-z0-9-]+([\\-\\.]{1}[a-z0-9]+)*\\.[A-Za-z]{2,6}$')
		const ipv4Regex = new RegExp('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}')
		const ipv6Regex = new RegExp('(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])) ')
		if(domainRegex.test(location)) return updateInfoData(`domain=${location}`)
		if(ipv4Regex.test(location)) return updateInfoData(`ipAddress=${location}`)
		if(ipv6Regex.test(location)) return updateInfoData(`ipAddress=${location}`)
		setErrorMessage('Error: Invalid IP / Domain')
		setIsLoading(false)
	}

	const onChange = (event: React.FormEvent<HTMLInputElement>) =>{
		const value = event.currentTarget.value;
		setLocation(value);
	}

	const updateInfoData = (route: string) => {
		setErrorMessage('')
		//Please do not steal my api key. I can't hide the api key while hosting this site on Github Pages.
		fetch(`https://geo.ipify.org/api/v1?apiKey=at_zMSdutGCIqJXGOHxSYRDPpstGMweL&${route}`)
			.then(res => res.json())
			.then(data => {
				if(data.isp === '') setErrorMessage('Not a valid IP / Domain, please try again.')
				console.log(data)
				setCoords([data.location.lat, data.location.lng])
				setInfoData([data.ip, `${data.location.city}, ${data.location.region}
				${data.location.postalCode}`, `UTC ${data.location.timezone}`, data.isp])
			}).then(() => setIsLoading(false))
			.catch((err) => setErrorMessage('There was an error contacting the API, please check your input or contact the site admin'))
	}

    return (
        <div className="App">
            <div className="heading-holder">
                <p className="app-title">IP Address Tracker</p>
				<div className="input-holder">
					<input 
						placeholder={'Search for any IP address or domain'}
						onChange={onChange} />
					<button
						type='submit'
						onClick={onButtonClick}> <img src={submitArrow} alt="submit" /></button>
				</div>
				<p className="error">{errorMessage}</p>
            </div>
            <div className="info-absolute">
                <div className="info-holder">
				 	{isLoading && <div className="spinner"><CircularProgress/></div>}
                    {!isLoading && infoData.map((item, index) => (
						<InfoDisplay
							key={index}
							infoDescription={infoDescriptions[index]}
							infoText={item}/>))}
                </div>
            </div>
            <div className="leaflet-map">
                <Map 
					coords= {coords}
				/>
            </div>
        </div>
    );
}

export default App;
