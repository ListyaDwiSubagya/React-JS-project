import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Login = () => {

    const [state, setState] = useState('Sign up')

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-tr from-blue-200 to-purple-400'>
        <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
        <div>
            <h2>{state === 'Sign up' ? 'Create Account' : 'Login '}</h2>
            <p>{state === 'Sign up' ? 'Create your account' : 'Login to your account!'}</p>

            <form action="">
                <div>
                    <img src={assets.person_icon} alt="" />
                    <input type="text" placeholder='Full Name' required/>
                </div>
            </form>
      
        </div>
    </div>
  )
}

export default Login