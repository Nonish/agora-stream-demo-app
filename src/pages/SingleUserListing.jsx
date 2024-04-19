import AgoraRTC from "agora-rtc-sdk-ng";
import { useCallback, useEffect, useState } from "react";
import AgoraVideoPlayer from "../components/videoPlayer";

const createMicrophoneAudioTrack = async (options = {
   encoderConfig: "music_standard"
}) => {
   return AgoraRTC.createMicrophoneAudioTrack(options);
};
const createCameraVideoTrack = async (options = {}) => {
   return AgoraRTC.createCameraVideoTrack(options);
};


// eslint-disable-next-line react/prop-types
const SingleUserListing = ({ item }) => {
   const appId = import.meta.env.VITE_AGORA_APP_ID;
   const [remoteUsers, setRemoteUsers] = useState({});
   const [channel, setChannel] = useState("");

   const client = AgoraRTC.createClient({
      mode: "live",
      codec: "vp8"
   });

   const initTracks = async () => {
      const tracks = await Promise.all([createMicrophoneAudioTrack(), createCameraVideoTrack()]);
      return tracks;
   };

   const handleUserPublished = useCallback(async (user, mediaType) => {
      const id = user.uid;
      await client.subscribe(user, mediaType);
      setRemoteUsers(prev => ({ ...prev, [id]: user }));
   }, [client])

   const handleUserUnpublished = (user, mediaType) => {
      if (mediaType === 'video') {
         const id = user.uid;
         setRemoteUsers(pre => { delete pre[id]; return { ...pre }; });
      }
   };

   const join = useCallback(async () => {
      const options = item
      // Add event listeners to the client.
      client.on("user-published", handleUserPublished);
      client.on("user-unpublished", handleUserUnpublished);
      // Join a channel
      options.uid = await client.join(appId, options.channel, options.token || null, options.uid || null);
      setChannel(options.channel);
      // setLocalUid(options.uid);
      console.log("client join channel1 success!");
   }, [appId, client, handleUserPublished, item]);

   useEffect(() => {
      (async () => {
         await join()
         const tracks = await initTracks();
         await client.publish(tracks);
      })()
   }, [client, join])

   return (
      <>
         {
            Object.keys(remoteUsers).length ? <div >
               <h3>channel: {channel}</h3>
               <h3>Remote Users</h3>
               {
                  Object.keys(remoteUsers).map(
                     id => (
                        <AgoraVideoPlayer
                           videoTrack={remoteUsers[id]?.videoTrack}
                           audioTrack={remoteUsers[id]?.audioTrack}
                           text={`uid: ${id}`}
                           key={id}>
                        </AgoraVideoPlayer>
                     )
                  )
               }
            </div> : null
         }
      </>
   )
}

export default SingleUserListing