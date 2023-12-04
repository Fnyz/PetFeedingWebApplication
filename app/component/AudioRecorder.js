import React, { Component } from 'react'
import MicRecorder from 'mic-recorder-to-mp3';
import { BiMicrophone, BiStop, BiPause } from "react-icons/bi";
import { collection, addDoc} from 'firebase/firestore';
import { db } from '../firebase';



const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default class AudioRecorder extends Component {

     state = {
        isRecording: false,
        blobURL: '',
        isBlocked: false,
        recordedFileBase64:'',
        credential: {},
        click:false,
        isAddPet: false,
      }


    


       handleShowCredData = () => {
        const user = localStorage.getItem("credentials")
        if(user){
            const datas = JSON.parse(user);
            this.setState({credential:datas});
        }
      }

      componentDidMount(){
        this.handleShowCredData();
        this.setState({isAddPet : this.props.isAddPet})
      }

      start = () => {
        if (this.state.isBlocked) {
         
        } else {
          Mp3Recorder
            .start()
            .then(() => {
              this.setState({ isRecording: true, click:true  })
            }).catch((e) => console.error(e));
        }
      };

      stop = () => {
        Mp3Recorder
          .stop()
          .getMp3()
          .then(async([buffer, blob]) => {
            const blobURL = URL.createObjectURL(blob)
            this.setState({ blobURL, isRecording: false, click:false });



            const file = new File(buffer, `audio.mp3`, {
                type: blob.type,
                lastModified: Date.now()
              });

            

             const Base64 = await this.audioToBase64(file)

             if(this.state.isAddPet){
              const player = new Audio(URL.createObjectURL(file));
              this.props.setAudioRecord(player);
              this.props.setBase64(Base64);
              return;
             }
             if(Base64){
                const request = {
                    DeviceName:this.state.credential.DeviceName.trim(),
                    RecordingFile:Base64,
                    response: false,
                  }
                  
                  
                  const docRef = await addDoc(collection(db, "Speak_To_Device"),request);
                  if(docRef.id) {
                    await addDoc(collection(db, "Task"),{
                      type:'Speak_to_pet',
                      deviceName:this.state.credential.DeviceName.trim(),
                      document_id: docRef.id,
                      request:null,
                    });
                  }
    
                  console.log('Successfully send voice file.');
             }
            
          }).catch((e) => console.log(e));
      };

    audioToBase64 = async (audioFile) => {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onerror = reject;
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(audioFile);
        });
      }


      

      
  render() {
    return (
      <div className='flex gap-2 justify-center items-center max-md:flex-col w-full'>
        <div onClick={this.start} disabled={this.state.isRecording} className={`rounded-md transition-all ease-in ${this.state.isRecording ? "opacity-50 ": "opacity-100 cursor-pointer hover:shadow-md flex items-center justify-center"} hover:bg-[coral]  w-[100%] p-2 gap-2 cursor-pointer bg-[#FAB1A0]`}>
            {this.state.click ? <BiPause size={25} color='white'/> : <BiMicrophone size={20} color='white'/>}
            <span className='text-white font-bold'>{this.state.click ? 'RECORDING....': 'START RECORDING'}</span>
        </div>
      
        <div onClick={this.stop} disabled={!this.state.isRecording} className={`  rounded-md transition-all ease-in  flex border justify-center items-center w-[100%] p-2 gap-2  border-[#FAB1A0] ${!this.state.isRecording ? "opacity-50 pointer-events-none": "opacity-100 cursor-pointer hover:shadow-md"}`}>
            <BiStop size={25} color='#FAB1A0'/>
            <span className='text-[#FAB1A0] font-bold'>STOP RECORDING</span>
        </div>
    
      </div>
    )
  }
}
