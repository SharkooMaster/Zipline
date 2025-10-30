import { NavBar } from "../components/Navbar"
import { Outlet } from "react-router-dom"
import { useApp } from "../context/app-state"

export function HomeLayout()
{
    const {state} = useApp();

    return(
      <div className='w-full h-screen rounded-lg flex flex-col overflow-hidden' style={{backgroundColor: state.bgColor}}>
        <NavBar />
        <div className='flex-1 overflow-auto'>
          <Outlet />
        </div>
      </div>
    )
}

