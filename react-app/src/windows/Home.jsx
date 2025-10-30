import { BottomBar } from "../components/BottomBar";
import { TerminalView } from "../components/TerminalView";

export function Home()
{
    return(
      <div className="text-white flex flex-col w-full h-full">
        <div className="w-full flex-1 p-2">
            <TerminalView />
        </div>
        <BottomBar />
      </div>
    )
}

