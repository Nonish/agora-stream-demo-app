import AgoraRTC from "agora-rtc-sdk-ng";
import { useCallback, useEffect, useState } from "react";
import constant from '../utils/constant'
import AgoraVideoPlayer from "../components/videoPlayer";

const appId = import.meta.env.AGORA_APP_ID

const createMicrophoneAudioTrack = async (options = {
   encoderConfig: "music_standard"
}) => {
   return AgoraRTC.createMicrophoneAudioTrack(options);
};
const createCameraVideoTrack = async (options = {}) => {
   return AgoraRTC.createCameraVideoTrack(options);
};

const client1 = AgoraRTC.createClient({
   mode: "live",
   codec: "vp8"
});
const client2 = AgoraRTC.createClient({
   mode: "live",
   codec: "vp8"
});
const client3 = AgoraRTC.createClient({
   mode: "live",
   codec: "vp8"
});

const JoinMultipleChannel = () => {

   // const [joined, setJoined] = useState(false);
   // const [videoTrack, setVideoTrack] = useState(null);
   // const [audioTrack, setAudioTrack] = useState(null);
   const [remoteUsers1, setRemoteUsers1] = useState({});
   const [remoteUsers2, setRemoteUsers2] = useState({});
   const [remoteUsers3, setRemoteUsers3] = useState({});
   const [channel1, setChannel1] = useState("");
   const [channel2, setChannel2] = useState("");
   const [channel3, setChannel3] = useState("");
   // const [localUid, setLocalUid] = useState("");

   const initTracks = async () => {
      const tracks = await Promise.all([createMicrophoneAudioTrack(), createCameraVideoTrack()]);
      // setAudioTrack(tracks[0]);
      // setVideoTrack(tracks[1]);
      return tracks;
   };

   const handleUserPublished1 = async (user, mediaType) => {
      const id = user.uid;
      await client1.subscribe(user, mediaType);
      setRemoteUsers1(prev => ({ ...prev, [id]: user }));
   };
   const handleUserUnpublished1 = (user, mediaType) => {
      if (mediaType === 'video') {
         const id = user.uid;
         setRemoteUsers1(pre => { delete pre[id]; return { ...pre }; });
      }
   };

   const handleUserPublished2 = async (user, mediaType) => {
      const id = user.uid;
      await client2.subscribe(user, mediaType);
      setRemoteUsers2(prev => ({
         ...prev,
         [id]: user
      }));
   };
   const handleUserUnpublished2 = (user, mediaType) => {
      if (mediaType === 'video') {
         const id = user.uid;
         setRemoteUsers2(pre => {
            delete pre[id];
            return {
               ...pre
            };
         });
      }
   };

   const handleUserPublished3 = async (user, mediaType) => {
      const id = user.uid;
      await client3.subscribe(user, mediaType);
      setRemoteUsers3(prev => ({
         ...prev,
         [id]: user
      }));
   };
   const handleUserUnpublished3 = (user, mediaType) => {
      if (mediaType === 'video') {
         const id = user.uid;
         setRemoteUsers3(pre => {
            delete pre[id];
            return {
               ...pre
            };
         });
      }
   };

   const join1 = useCallback(async () => {
      const options = constant[0]
      // Add event listeners to the client1.
      client1.on("user-published", handleUserPublished1);
      client1.on("user-unpublished", handleUserUnpublished1);
      // Join a channel
      options.uid = await client1.join(appId, options.channel, options.token || null, options.uid || null);
      setChannel1(options.channel);
      // setLocalUid(options.uid);
      console.log("client1 join channel1 success!");
   }, []);

   const join2 = useCallback(async () => {
      const options = constant[1]
      setChannel2(options.channel2);
      // Add event listeners to the client1.
      client2.on("user-published", handleUserPublished2);
      client2.on("user-unpublished", handleUserUnpublished2);
      await client2.join(appId, options.channel2, options.token2 || null, options.uid2 || null);
      console.log("client2 join channel2 success!");
   }, []);

   const join3 = useCallback(async () => {
      const options = constant[2]
      setChannel3(options.channel3);
      // Add event listeners to the client1.
      client3.on("user-published", handleUserPublished3);
      client3.on("user-unpublished", handleUserUnpublished3);
      await client3.join(appId, options.channel3, options.token3 || null, options.uid3 || null);
      console.log("client3 join channel3 success!");
   }, []);

   const join = useCallback(async () => {
      try {
         await Promise.all([join1(), join2(), join3()]);
         const tracks = await initTracks();
         await client1.publish(tracks);
         await client2.publish(tracks);
         await client3.publish(tracks);
         // setJoined(true);
      } catch (error) {
         console.error(error);
      }
   }, [join1, join2, join3]);


   useEffect(() => { join() }, [join])

   // const leave = async () => {
   //    audioTrack?.close();
   //    setAudioTrack(null);
   //    videoTrack?.close();
   //    setVideoTrack(null);
   //    setRemoteUsers1({});
   //    setRemoteUsers2({});
   //    await client1?.leave();
   //    await client2?.leave();
   //    setJoined(false);
   //    console.log("client1 leaves channel success");
   // };

   return (
      <div >
         {/* <div style={{ marginTop: "10px" }}>
            <button type="primary" onClick={join} disabled={joined}>Join</button>
            <button onClick={leave} disabled={!joined}>Leave</button>
         </div> */}

         {/* {
            joined ? <div>
               <h3>Local User</h3>
               <div >uid: {localUid}</div>
               <AgoraVideoPlayer videoTrack={videoTrack} ></AgoraVideoPlayer>
            </div> : null
         } */}

         {
            Object.keys(remoteUsers1).length ? <div >
               <h3>channel: {channel1}</h3>
               <h3>Remote Users</h3>
               {
                  Object.keys(remoteUsers1).map(
                     id =>
                        <AgoraVideoPlayer
                           videoTrack={remoteUsers1[id]?.videoTrack}
                           audioTrack={remoteUsers1[id]?.audioTrack}
                           text={`uid: ${id}`}
                           key={id}>
                        </AgoraVideoPlayer>
                  )
               }
            </div> : null
         }
         {
            Object.keys(remoteUsers2).length ? <div >
               <h3>channel: {channel2}</h3>
               <h3 >Remote Users</h3>
               {
                  Object.keys(remoteUsers2).map(id =>
                     <AgoraVideoPlayer
                        videoTrack={remoteUsers2[id]?.videoTrack}
                        audioTrack={remoteUsers2[id]?.audioTrack}
                        text={`uid: ${id}`}
                        key={id}>
                     </AgoraVideoPlayer>
                  )
               }
            </div> : null
         }
         {
            Object.keys(remoteUsers3).length ? <div >
               <h3>channel: {channel3}</h3>
               <h3 >Remote Users</h3>
               {
                  Object.keys(remoteUsers3).map(
                     id =>
                        <AgoraVideoPlayer
                           videoTrack={remoteUsers3[id]?.videoTrack}
                           audioTrack={remoteUsers3[id]?.audioTrack}
                           text={`uid: ${id}`}
                           key={id}>
                        </AgoraVideoPlayer>
                  )
               }
            </div> : null
         }
      </div >
   )
}

export default JoinMultipleChannel;