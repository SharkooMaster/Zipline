import { IoClose } from "react-icons/io5";

export function SimpleNavBar(params)
{
    return(
        <div className="drag w-full h-[30px] flex flex-row items-center justify-between bg-neutral-700 px-4">
            <p className="text-white font-bold">{params.title}</p>

            <div onClick={() => window.winctl?.close()} className='no-drag window-btn w-[20px] h-[20px] bg-red-400 flex items-center justify-center rounded-full'>
                <IoClose size={14} />
            </div>
        </div>
    )
}

