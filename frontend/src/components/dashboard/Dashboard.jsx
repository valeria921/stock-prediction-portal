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
                    <div className='text-light p-5'>
                        <h4>📈 Closing Price of {ticker}</h4>
                        <p>Chart shows the actual daily closing prices of the selected stock over the past 10 years.
                            It provides a historical view of how the stock’s price has changed over time, helping you analyze long-term trends and price movements.</p>
                        {plot && (
                            <img src={plot} style={{ maxWidth:'100%' }}/>
                        )}
                    </div>
                    <div className='text-light p-5'>
                        <h4>📊 100-Day Moving Average of {ticker}</h4>
                        <p>This chart displays two lines:
                            <ul>
                                <li>The daily closing price of the stock</li>
                                <li>The 100-day moving average, which smooths out short-term fluctuations and highlights long-term trends</li>
                            </ul>
                            It's useful for identifying the general direction the stock has been moving over the full 10-year period.</p>
                        {ma100 && (
                            <img src={ma100} style={{ maxWidth:'100%' }}/>
                        )}
                    </div>
                    <div className='text-light p-5'>
                        <h4>📊 200-Day Moving Average of {ticker}</h4>
                        <p>This chart includes:
                            <ul>
                                <li>The daily closing price of the stock</li>
                                <li>The 100-day moving average</li>
                                <li>The 200-day moving average, which provides an even broader view of long-term trends</li>
                            </ul>
                            Together, these lines help you better understand both medium- and long-term momentum in the stock’s price.</p>
                        {ma200 && (
                            <img src={ma200} style={{ maxWidth:'100%' }}/>
                        )}
                    </div>
                    <div className='text-light p-5'>
                        <h4>🤖 Final Prediction for {ticker}</h4>
                        <p>This graph compares two lines for the last 30% of the data (approximately 3 years):
                            <ul>
                                <li>The real historical prices</li>
                                <li>The predicted prices generated by our machine learning model</li>
                            </ul>
                            By comparing the two, users can see how closely the model’s predictions match actual past prices—giving insight into the model’s accuracy and performance.</p>
                        {prediction && (
                            <img src={prediction} style={{ maxWidth:'100%' }}/>
                        )}
                    </div>
                    <div className='text-light mx-5'>
                        <h4>Model evaluetion</h4>
                        <p>Mean Squared Error (MSE): {mse}</p>
                        <p>Root mean Squared Error (RMSE): {rmse}</p>
                        <p>R - squared: {r2}</p>
                    </div> 
                </div>
                )}

            <div className='row justify-content-center'>
                <div className="col-lg-10 col-xl-8">
                    <p className="text-light mt-5" style={{ fontSize: '0.75rem' }}>
                        ⚠️ <strong className="text-warning">Disclaimer:</strong> This project is for educational purposes only and should not be used for real financial trading. Relying on this model for investment decisions may lead to significant financial loss.
                        <br />
                        <strong className="text-warning">Please note:</strong> the model does <strong>not predict future prices</strong>. It is trained on the first 70% of a real 10-year dataset (e.g., 2015–2021) and generates predictions for the remaining 30% (e.g., 2022–2025), which are then compared with actual historical prices to evaluate model accuracy.
                    </p>
                </div>
                </div>

            </div>
        </div>
    </>
  )
}

export default Dashboard