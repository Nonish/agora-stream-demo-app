import SingleUserListing from "./SingleUserListing"

const UserListing = () => {
   const options = [
      {
         channel: "618a48d8b986",
         uid: "",
         token: "007eJxTVQSmvZV8bCyMDIwALEIMAEJpnBJAuYlGAwM7RINDM2NU5LNE2ySE0yNLFIsUiytDBjYAAAT5MgbQ=="
      },
      // {
      //    channel: "64a682c943fc24",
      //    uid: "",
      //    token: "007eJ8lNL0fT6xMDIwMrAAMQgwgUlmMMkCJiUYzEwSzSySDcwtLBKTDC0sjZItTYzTko1MGBgAynoijg=="
      // },
   ]

   return (
      <div>
         <h3>Users</h3>
         {
            options.map((item, i) => {
               return (
                  <SingleUserListing item={item} key={i} />
               )
            })

         }
      </div>
   )
}

export default UserListing;