import { useState, useEffect } from 'react'

// const baseURL = 'http://localhost:3005/api/campground'

export default function Test() {
  // const [jsons, setJsons] = useState([])

  // const getJsons = async () => {
  //   const baseURL = 'http://localhost:3005/api/campground'
  //   // 'http://localhost:3005/api/group-event'
  //   // 'https://my-json-server.typicode.com/eyesofkids/json-fake-data/products'

  //   const res = await fetch(baseURL)
  //   const { data } = await res.json()

  //   console.log(data)
  //   console.log(data.campgrounds)

  //   setJsons(data.campgrounds)
  // }
  // useEffect(() => {
  //   getJsons()
  // }, [])

  // 單一活動
  // const [event, setEvent] = useState([])

  // const getEvent = async () => {
  //   const baseURL = 'http://localhost:3005/api/group-event/1'
  //   const res = await fetch(baseURL)
  //   const data = await res.json()

  //   console.log(data)
  //   // console.log(data.event)

  //   // setEvent(data.event)
  //   setEvent(data)
  // }
  // useEffect(() => {
  //   getEvent()
  // }, [])

  // 會員資料
  const [member, setMember] = useState([])

  const getMember = async () => {
    const baseURL = 'http://localhost:3005/api/members/1'
    const res = await fetch(baseURL)
    const data = await res.json()

    console.log(data)
    console.log(data.data)
    console.log([data.data.member])

    // setMember(data.member)
    setMember([data.data.member])
  }
  useEffect(() => {
    getMember()
  }, [])

  return (
    <>
      <h1>test</h1>
      {member.length > 0 ? ( // 檢查是否有資料
        <ul>
          <li>{member[0].id}</li>
          <li>{member[0].account}</li>
          <li>{member[0].username}</li>
          <li>{member[0].birthdate}</li>
          <li>{member[0].phonenumber}</li>
          <li>{member[0].idnumber}</li>
          <li>{member[0].email}</li>
          <li>{member[0].address}</li>
          <li>{member[0].created_at}</li>
          <li>{member[0].updated_at}</li>
          {/* <li>{member[0].max_member}</li>
          <li>{member[0].ground_order_number}</li>
          <li>{member[0].ground_city}</li>
          <li>{member[0].address}</li>
          <li>{member[0].ground_geolocation}</li>
          <li>{member[0].ground_altitude}</li>
          <li>{member[0].ground_phone}</li>
          <li>{member[0].images}</li>
          <li>{member[0].status}</li>
          <li>{member[0].created_at}</li>
          <li>{member[0].updated_at}</li>
          <li>{member[0].start_date.slice(5, 7)}月</li>
          <li>{member[0].start_date.slice(8, 10)}日</li>
          <li>{member[0].end_date.slice(5, 7)}月</li>
          <li>{member[0].end_date.slice(8, 10)}日</li>
          <li>{member[0].join_deadline.slice(5, 7)}月</li>
          <li>{member[0].join_deadline.slice(8, 10)}日</li> */}
        </ul>
      ) : (
        <p>Loading...</p> // 資料尚未加載時顯示
      )}
    </>
    // <>
    //   <h1>test</h1>
    //   {event.length > 0 ? ( // 檢查是否有資料
    //     <ul>
    //       <li>{event[0].event_id}</li>
    //       <li>{event[0].organizer_id}</li>
    //       <li>{event[0].event_name}</li>
    //       <li>{event[0].start_date}</li>
    //       <li>{event[0].end_date}</li>
    //       <li>{event[0].join_deadline}</li>
    //       <li>{event[0].event_description}</li>
    //       <li>{event[0].max_member}</li>
    //       <li>{event[0].ground_order_number}</li>
    //       <li>{event[0].ground_city}</li>
    //       <li>{event[0].address}</li>
    //       <li>{event[0].ground_geolocation}</li>
    //       <li>{event[0].ground_altitude}</li>
    //       <li>{event[0].ground_phone}</li>
    //       <li>{event[0].images}</li>
    //       <li>{event[0].status}</li>
    //       <li>{event[0].created_at}</li>
    //       <li>{event[0].updated_at}</li>
    //       <li>{event[0].start_date.slice(5, 7)}月</li>
    //       <li>{event[0].start_date.slice(8, 10)}日</li>
    //       <li>{event[0].end_date.slice(5, 7)}月</li>
    //       <li>{event[0].end_date.slice(8, 10)}日</li>
    //       <li>{event[0].join_deadline.slice(5, 7)}月</li>
    //       <li>{event[0].join_deadline.slice(8, 10)}日</li>
    //     </ul>
    //   ) : (
    //     <p>Loading...</p> // 資料尚未加載時顯示
    //   )}
    //   {/* <h1>test</h1>
    //   {jsons.map((json, index) => {
    //     return (
    //       <ul key={json.id}>
    //         <li>{json.campground_name}</li>
    //         <li>{json.email}</li>
    //         <li>{json.address}</li>
    //         <li>{json.phone}</li>
    //         <li>{json.title_img_path}</li>
    //         <li>{json.campground_introduction}</li>
    //         <li>{json.altitude}</li>
    //         <li>{json.city}</li>
    //         <li>{json.geolocation}</li>
    //       </ul>
    //     )
    //   })} */}
    // </>
    // <>
    //   <h1>test</h1>
    //   {jsons.map((event, index) => {
    //     return (
    //       <ul key={event.id}>
    //         {event.event_name}
    //         <li>{event.images}</li>
    //         <li>{event.ground_city}</li>
    //         <li>{event.start_date}</li>
    //         <li>{event.end_date}</li>
    //         <li>{event.max_member}</li>
    //       </ul>
    //     )
    //   })}
    // </>
  )
}
