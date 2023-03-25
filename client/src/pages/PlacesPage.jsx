import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from 'axios'
export default function PlacesPage(){
    const {action}=useParams()
    const [title, setTitle]=useState('')
    const [address, setAddress]=useState('')
    const [addedPhotos, setAddedPhotos]=useState([])
    const [photoLink, setPhotoLink]=useState('')
    const [description,setDescription]=useState('')
    const [perks,setPerks]=useState([])
    const [extraInfo,setExtraInfo]=useState('')
    const [checkIn, setCheckIn]=useState('')
    const [checkOut,setCheckOut]=useState('')
    const [maxGuests, setMaxGuests]=useState(1)
    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }
    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header,description){
return(
    <>
    {inputHeader(header)}
    {inputDescription(description)}
    </>
)
    }


    async function addPhotoByLink(ev){
        ev.preventDefault()
   const {data:filename}=   await  axios.post('/upload-by-link',{link:photoLink})
   setAddedPhotos(prev=>{
    return [...prev, filename]
   })
   setPhotoLink('');
    }
    // console.log(action)

function uploadPhoto(ev){
    const files=ev.target.files;
    const data=new FormData()
    for(let i=0;i<files.length;i++){
        data.append("photos", files[i])
    }
    
    axios.post("/upload",data,{
        headers:{"Content-type":"multipart/form-data"}
      }).then(response=>{
        const {data:filenames}= response;
        setAddedPhotos(prev=>{
            return [...prev, ...filenames]
           })
      }).catch((er)=>{
        console.log(er)
      })

     }


    return (
        <div>
            {action !== 'new' && (
                <div className="text-center">
               <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full " to={'/account/places/new'}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

                Add new place
                </Link>
            </div>
            )}
            {action === 'new' &&(
                <div>
              <form>
                {preInput('Title','title for your place')}
                   <input value={title} onChange={ev => setTitle(ev.target.value)} type="text" placeholder="title" />
                   {preInput('Address','Address to this place')}
                   <input value={address} onChange={ev => setAddress(ev.target.value)} type="text" placeholder="address" />
                   {preInput('Photos','upload multiple images....')}
                    <div className="flex gap-2">
                        <input value={photoLink} onChange={ev => setPhotoLink(ev.target.value)} type="text" placeholder={'Add using a link ...jpg'} />
                        <button onClick={addPhotoByLink} className="bg-gray-200 grow px-4 rounded-2xl">Add&nbsp;photo</button>
                    </div>
                   
                    <div  className="mt-2 grid gap-2 grid-col-3 md:grid-cols-4 lg:grid-cols-6">
                        {addedPhotos.length>0 && addedPhotos.map(link=>(
                            <div>
                                <img className="rounded-2xl" src={"http://localhost:4000/uploads/"+link } alt="" />
                            </div>
                        ))}
                    <label className="cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                    <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
</svg>

                        Upload
                    </label>
                    </div>
                    {preInput('Description','description of the place')}
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
                    {preInput('Perks','select the perks of your choice')}
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                       <Perks selected={perks} onChange={setPerks}/>
                    </div>
                    <div>
                        {preInput('Extra Information','house rules, etc.....')}
                    <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
                    </div>
                    {preInput('Check In & Out','add check in and check out, remember to have some time window for cleaning the room between guests')}
                    <div className="grid sm:grid-cols-3 gap-2">
                        <div>
                            <h3 className="mt02 -mb-2">check in time</h3>
                        <input value={checkIn} onChange={ev => setCheckIn(ev.target.value)} type="text" placeholder="14:00" />
                        </div>
                        <div>
                            <h3 className="mt02 -mb-2">Check out time</h3>
                        <input value={checkOut} onChange={ev => setCheckOut(ev.target.value)} type="text" placeholder="" />
                        </div>
                        <div>
                            <h3 className="mt02 -mb-2">Max number of guests</h3>
                        <input type="number" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}/>
                        </div>
                        <div >
                            <button className="primary my-4">Save</button>
                        </div>
                    </div>
                  
               </form>
                </div>
               
            )}
        </div>
    )
}