import React, {useContext, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import AuthProvider, { AuthContext } from '../AuthProvider'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
    
    const navigate = useNavigate()

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);

      const userData = {username, password}
      console.log (userData)

      try{
        const response = await axios.post('http://127.0.0.1:8000/api/token/', userData)
        localStorage.setItem('accessToken', response.data.access)
        localStorage.setItem('refresh', response.data.refresh)
        setIsLoggedIn(true)
        navigate('/')
      } catch(error) {
        console.error('Invalid credentials')
        setError('Invalid credentials')
      }finally {
        setLoading(false)
      }
    }

  return (
<>
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-6 bg-light-dark p-5 rounded'>
                    <h3 className='text-light text-center mb-4'>Login to portal</h3>
                    <form onSubmit={handleLogin}>

                        <div className=' mb-3 '>
                            <input type='text' className='form-control'placeholder='Enter username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className=' mb-3 '>
                            <input type='password' className='form-control'placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                            {error && <div className='text-danger'>{error}</div>}
                        </div>

                        { loading ? (
                            <button type='submit' className='btn btn-info d-block mx-auto' disabled> <FontAwesomeIcon icon={faSpinner} spin/>&nbsp; Logging in...</button>
                        ) : (
                            <button type='submit' className='btn btn-info d-block mx-auto'>Log in</button>
                        )}
                    </form>
                </div>
            </div>

        </div>
    </>
  )
}

export default Login