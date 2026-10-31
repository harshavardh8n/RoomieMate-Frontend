import React from 'react'
import AddSticker from '../components/AddSticker'
import Attachment from '../components/Attachment'
import FeatureBox from '../components/FeatureBox'
import { NavLink } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { roomIdAtom } from '../state/atoms/roomIdAtom';
import Roommates from '../components/Roommates'

const Home = () => {

  const roomId = useRecoilValue(roomIdAtom);

  return (
    <>
    <div className='bg-gray-100'>

    <div className='lg:w-full flex lg:flex-row flex-col h-screen'>

    <div className="lg:w-1/2 pt-2 bg-gray-100 flex flex-col">
      <div>

        <h1 class="text-xl font-semibold ml-24 text-[#809539]">RoomieMate</h1>
        <div className="w-3/4 m-auto">
          {/* {roomId} */}
            <FeatureBox fname="Group Chat (In progress)"/>
           <NavLink to={"/expenses"}>
             <FeatureBox fname="Expense tracking"/>
            </NavLink>
            <FeatureBox fname="Find a roommate (In progress)"/>
            <FeatureBox fname="Exchange Items (In progress)"/>
        </div>
      </div>
      <div>
        <Roommates/>
      </div>
    </div>
    <div className="lg:w-1/2 bg-[#D9DFC6] rounded-l-3xl ... flex flex-col">
        <div className="h-fit">
            <div className="m-4">
            <AddSticker/>
            </div>
            
        </div>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 m-3">
        <Attachment/>
        <Attachment/>
        <Attachment/>
        <Attachment/>
        <Attachment/>
        </div>
    </div>
    </div>
    </div>
    </>
  )
}

export default Home
