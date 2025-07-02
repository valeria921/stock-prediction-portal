import React, {useEffect, useState} from 'react'
import axiosInstance from '../../axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


const Dashboard = () => {

    const [ticker, setTicker] = useState('')
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const [plot, setPlot] = useState()
    const [ma100, setMA100] = useState()
    const [ma200, setMA200] = useState()
    const [prediction, setPrediction] = useState()
    const [mse, setMSE] = useState()
    const [rmse, setRMSE] = useState()
    const [r2, setR2] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{
            const response = await axiosInstance.post('/predict/', {
                ticker:ticker
            }
            );
            console.log(response.data);
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT
            const plotUrl = `${backendRoot}${response.data.plot_img}`
            const ma100Url = `${backendRoot}${response.data.plot_100_dma}`
            const ma200Url = `${backendRoot}${response.data.plot_200_dma}`
            const predictionUrl = `${backendRoot}${response.data.plot_prediction}`
            setPlot(plotUrl)
            setMA100(ma100Url)
            setMA200(ma200Url)
            setPrediction(predictionUrl)
            setMSE(response.data.mse)
            setRMSE(response.data.rmse)
            setR2(response.data.r2)
            if (response.data.error){
                setError(response.data.error)
            }
        } catch(error){
            console.error('Error from API request', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstance.get('/protected-view/')
            } catch(error){
                console.error('Error fetching data', error)
            }
        }
        fetchProtectedData();
    }, [])
 
  return (
    <>
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 mx-auto'>
                    <form onSubmit={handleSubmit}>
                        <input type='text' className='form-control' placeholder='Enter stock ticker' 
                        onChange={(e) => setTicker(e.target.value)} required
                        />
                        <small>{error && <div className='text-danger'>{error}</div>}</small>
                        <button type='submit' className='btn btn-info mt-3'>
                            { loading ? <span><FontAwesomeIcon icon={faSpinner} spin/>&nbsp; Please wait...</span>: 'See prediction'}
                            </button>
                    </form>
                    </div>

                    {/* Print pridiction plots */}
                    {prediction && (
                        <div className='prediction mt-3'>
                        <div className='p-3'>
                            {plot && (
                                <img src={plot} style={{ maxWidth:'100%' }}/>
                            )}
                        </div>
                        <div className='p-3'>
                            {ma100 && (
                                <img src={ma100} style={{ maxWidth:'100%' }}/>
                            )}
                        </div>
                        <div className='p-3'>
                            {ma200 && (
                                <img src={ma200} style={{ maxWidth:'100%' }}/>
                            )}
                        </div>
                        <div className='p-3'>
                            {prediction && (
                                <img src={prediction} style={{ maxWidth:'100%' }}/>
                            )}
                        </div>
                        <div className='text-light p-3'>
                            <h4>Model evaluetion</h4>
                            <p>Mean Squared Error (MSE): {mse}</p>
                            <p>Root mean Squared Error (RMSE): {rmse}</p>
                            <p>R - squared: {r2}</p>
                        </div> 
                    </div>
                    )}
            </div>
        </div>
    </>
  )
}

export default Dashboard