import React from 'react'
import Button from './Button'

const Home = () => {
  return (
    <>
        <div className='container'>
            <div className='p-5 text-center bg-light-dark rounded'>
                <h1 className='text-light'>Stock prediction portal</h1>
                <p className='text-light lead'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac cursus est, ut mollis velit. Fusce a arcu nisl. Praesent sed pulvinar nisi. Fusce in ultrices lacus. Vivamus nulla nulla, luctus ut aliquam pharetra, rhoncus sit amet libero. Duis pretium tempor erat eget tristique. Mauris eget libero interdum, commodo lacus eu, elementum mi.</p>
                <Button text='Login' class='btn-outline-info'/>
            </div>
        </div>
    </>
  )
}

export default Home