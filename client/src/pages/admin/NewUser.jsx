import React, { useState } from 'react'
import { User, Mail } from 'lucide-react'
import { createUser } from '../../services/organisation.services';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NewUser = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [role,setRole] = useState('member');
    const navigate = useNavigate();

    const submitHandler = async(e) =>{
        e.preventDefault();
        try {
            const res = await createUser({name,email,role});
            toast.success("Created!")
            navigate('/admin/users',{
                replace:true
            })

        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="bg-linear-to-br flex">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  onChange={(e)=>setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div> 

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select 
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="member">Team Member</option>
                <option value="manager">Project Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>


            <div className="space-y-3">
                <button 
                  className={`w-full text-white py-3 rounded-xl font-medium bg-purple-600 cursor-pointer hover:bg-purple-700 transition-colors`}>
                    Create User
                </button>
            </div>         

          </form>

        </div>
      </div>
    </div>
  );
}

export default NewUser