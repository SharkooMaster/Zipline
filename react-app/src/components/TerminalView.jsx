import SyntaxHighlighter from 'react-syntax-highlighter';
import * as STYLES from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { useApp } from '../context/app-state';

export function TerminalView(params)
{
    const {state} = useApp();
    
    // Ensure the theme exists, fallback to default if not
    const syntaxStyle = STYLES[state.theme] || STYLES.tomorrowNightBright;

    return(
        <div className="flex flex-col text-wrap h-full w-full">
            <div className='flex flex-row gap-2 items-center'>
                <SyntaxHighlighter 
                    key={state.theme}
                    language='bash' 
                    className=""
                    style={syntaxStyle}
                    customStyle={{
                        background: 'none',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        overflowX: 'visible',
                        textShadow: 'none',
                        padding: 0
                    }}
                    codeTagProps={{
                        style: { textShadow: 'none' },
                    }}
                >
                    $sharku@sharku-unix:~$
                </SyntaxHighlighter>

                <input className='bg-none outline-none px-1 text-white' />
            </div>
        </div>
    )
}

