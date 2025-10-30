import { Routes, Route } from 'react-router-dom'

import { HomeLayout } from "./layouts/HomeLayout"
import { Home } from "./windows/Home"
import { Settings } from "./windows/Settings"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<Home />} />
                </Route>
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </>
    )
}

export default App
