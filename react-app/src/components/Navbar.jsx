import { useEffect, useState } from "react";

import { IoClose } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
import { FiMinimize2 } from "react-icons/fi";

export function NavBar()
{
    const [isMax, setIsMax] = useState(false);
    const [isFull, setIsFull] = useState(false);

    useEffect(()=>{
        if(!window.winctl) return;
        window.winctl.onState(({isMaximized, isFullScreen}) => {
            setIsMax(isMaximized);
            setIsFull(isFullScreen);
        });
    }, []);

    return(
        <div className='drag w-full h-[30px] bg-neutral-700 flex flex-row items-center justify-between rounded-t-lg px-4'>
            <div className="flex flex-row gap-2 items-center h-full">
                <p className='text-white text-[16px] font-bold no-drag cursor-pointer hover:text-gray-300' onClick={()=>window.electronAPI?.openWindow('settings')}>Zipline</p>
                <div className="w-[1px] h-[80%] rounded-full bg-neutral-500" />
                <p className='text-white text-[14px] font-light'>/Home/Techpology/Documents/Projects/misc/Zipline</p>
            </div>

            <div className='flex flex-row gap-4 no-drag'>
                <div onClick={() => {window.winctl?.minimize(); console.log("mini");}} className='window-btn w-[20px] h-[20px] bg-yellow-400 flex items-center justify-center rounded-full'>
                    <BsDash size={14} />
                </div>
                <div onClick={() => window.winctl?.maxToggle()} className='window-btn w-[20px] h-[20px] bg-green-400 flex items-center justify-center rounded-full'>
                    <FiMinimize2 size={14} />
                </div>
                <div onClick={() => window.winctl?.close()} className='window-btn w-[20px] h-[20px] bg-red-400 flex items-center justify-center rounded-full'>
                    <IoClose size={14} />
                </div>
            </div>
        </div>
    );
}
