import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {toast} from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authslice'


const Login = () => {
    const [input, setInput] = useState({
      email: '',
      password: ''
    })
    const [loading, setLoading] = useState(false)  
    const {user} = useSelector(store=>store.auth)
    const navigate = useNavigate();
    const dispatch= useDispatch();  

    const changeEventHandler = (e) => {
      setInput({
        ...input,
        [e.target.name]: e.target.value
      })
    }
    const signupHandler =async (e) => {
      e.preventDefault()
     try {
        setLoading(true)
        const res = await axios.post('http://localhost:8000/api/v1/user/login',input, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })  
        if(res.data.success){
          dispatch(setAuthUser(res.data.user));
          navigate('/');
          toast.success(res.data.message)
          setInput({
            email: '',
            password: ''
          })  
        }
     } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
     } finally{ {
        setLoading(false)
     }}
    }
  
  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[])

  return (
    <div className='flex justify-center items-center h-screen w-screen'>
        <form onSubmit={signupHandler} action=""  className='shadow-lg p-8 flex flex-col  gap-5'>
              <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>Logo</h1>
                <p className='text-center text-sm'>Login to see photos & videos from your friends</p>
              </div>
            
              <div>
                <Label className="py-2 font-medium">Email</Label>
                 <Input 
                  type="email" 
                  name="email" 
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder='Email' 
                  className='focus-visible:ring-transparent'
                  />
              </div>
              <div>
                <Label className="py-2 font-medium">Password</Label>
                 <Input 
                  type="password" 
                  name="password" 
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder='Password' 
                  className='focus-visible:ring-transparent'/>  
              </div>
              {
               loading ? (
               <Button>
                    <Loader2 className="animate-spin mr-2 h-4 w-2 " />
                     Please wait...
               </Button>
               ) : (
                <Button type="submit" className="mt-4">Login</Button>
               )
              }
              <span className='text-sm text-center'>Dont have an account? <Link to="/signup" className='text-blue-500'>Signup </Link></span>
        </form>
    </div>
  )
}

export default Login
