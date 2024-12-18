import React from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const ResetPw = () => {

  const navigate = useNavigate()

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
    
      <form action=""></form>
    </div>
  )
}

export default ResetPw