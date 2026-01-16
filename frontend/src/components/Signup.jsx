import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth)
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      {
        setLoading(false);
      }
    }
  };
  
    useEffect(()=>{
      if(user){
        navigate('/')
      }
    },[])

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form
        onSubmit={signupHandler}
        action=""
        className="shadow-lg p-8 flex flex-col  gap-5"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">Logo</h1>
          <p className="text-center text-sm">
            Signup to see photos & videos from your friends
          </p>
        </div>
        <div>
          <Label className="py-2 font-medium">Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            placeholder="Username"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="py-2 font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Email"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="py-2 font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Password"
            className="focus-visible:ring-transparent"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="animate-spin mr-2 h-4 w-2 " />
            Please wait...
          </Button>
        ) : (
          <Button type="submit" className="mt-4">
            Sign Up
          </Button>
        )}
   
        <span className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
