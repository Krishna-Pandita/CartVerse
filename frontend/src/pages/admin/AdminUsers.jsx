import { Input } from '@/components/ui/input'
import { Edit2, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Profile from '../../assets/Profile.png'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate()
  
  const getAllUsers = async() =>{
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/user/all-users`, {
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        setUsers(res.data.users)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const filteredUsers = users.filter(user=>
    `${user.firstName} ${user.lastName}` .toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(()=>{
    getAllUsers()
  },[])

  return (
    <div className='pl-[350px] py-26 pr-23 mx-auto px-4'>
      <h1 className='font-bold text-2xl'>User Management</h1>
        <p>View and manage registered users</p>
        <div className='relative flex w-[300px] mt-6'>
                 <Search className="absolute left-2 top-1 text-gray-600 w-5" />
                 <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10" placeholder="Search Users"/>
        </div>

        <div className='grid grid-cols-3 gap-7 mt-7'>
                {
                  filteredUsers.map((user, index)=>{
                    return <div key={index} className='bg-pink-100 p-5 rounded-lg'>
                          <div className='flex items-center gap-2'>
                              <img src={user?.profilePic  || Profile} alt='' className='rounded-full w-16 aspect-square object-cover border border-pink-600' />
                              <div>
                                 <h1 className='font-semibold'>{user?.firstName} {user?.lastName}</h1>
                                 <h3>{user?.email}</h3>
                              </div>
                          </div>


                          <div className='flex gap-3 mt-4'>
                              <Button onClick={()=>navigate(`/dashboard/users/${user?._id}`)} variant='outline' className="cursor-pointer"><Edit2/>Edit</Button>
                              <Button onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)} variant='outline' className="cursor-pointer"><Eye/>Show Order</Button>
                          </div>

                    </div>
                  })
                }
        </div>
    </div>
  )
}

export default AdminUsers