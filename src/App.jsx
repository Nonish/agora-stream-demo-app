
import {
  Route, Routes,
  //  useNavigate 
} from 'react-router-dom'
// import { ConnectForm } from './components/ConnectForm'
// import { LiveVideo } from './components/LiveVideo'

// import AgoraRTC, {
//   AgoraRTCProvider,
//   // useRTCClient,
// } from "agora-rtc-react";
import './App.css'
import UserListing from './pages/UserListing';

function App() {
  // const navigate = useNavigate();
  // const handleConnect = (channelName) => {
  //   navigate(`/via/${channelName}`) // on form submit, navigate to new route
  // }

  return (
    <Routes>
      {/* <Route path='/form' element={<ConnectForm connectToVideo={handleConnect} />} />
      <Route path='/via/:channelName' element={
        <AgoraRTCProvider client={AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })}>
          <LiveVideo />
        </AgoraRTCProvider>
      } /> */}
      <Route path='/' element={<UserListing />} />
    </Routes>
  )
}

export default App