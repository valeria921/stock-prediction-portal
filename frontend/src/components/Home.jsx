import React from 'react'
import Button from './Button'
import Header from './Header'
import Footer from './Footer'

const Home = () => {
  return (
    <>

        <div className='container'>
            <div className='p-5 text-center bg-light-dark rounded'>
                <h1 className='text-light'>Stock prediction portal</h1>
                <p className='text-light lead'>Welcome to the Stock Prediction Portal — a powerful platform that uses deep learning to forecast stock prices based on real historical data. 
                  Explore charts, track predicted vs. actual performance and see how machine learning model interpret market behavior.
                  Try data-driven trend analysis today.</p>
                <Button text='Expore now' class='btn-outline-info' url='/dashboard'/>
            </div>
        </div>
    </>
  )
}

export default Home