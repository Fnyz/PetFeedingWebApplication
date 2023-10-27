import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { BiDotsVertical} from "react-icons/bi";


function ListOfPet() {


    
    
 

  return (
    <div className='z-50 border w-4/5 h-[500px] rounded-md overflow-hidden pt-5 shadow-sm'>
      <div className='flex justify-center items-center  gap-5'>

      <Image
           src="/Image/animals.png"
          width={40}
          height={40}
          alt='profile'
          objectFit='cover'

        />
      <label style={{
        fontSize:30,
        fontWeight:'bold',
      
        color:'#FAB1A0'
       }}>List of Pets
       </label>
      </div>
  

       
       <div class="flex mt-10">
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">Image</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">Petname</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">Weight</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">Age</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] border-r-2 border-[#FAB1A0]">Gender</div>
       <div class="w-1/4 h-12 flex justify-center items-center font-bold opacity-[0.6] ">Options</div>
      </div>

      <div className=' h-[350px] overflow-auto'>

      <div class="flex ">
       <div class="w-1/4 h-20    flex justify-center items-center">
        <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
        <Image
           src="https://imgix.ranker.com/user_node_img/4373/87457608/original/nezuko-kamado-u-1063447507?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&bg=fff&h=300&w=300"
          fill
          alt='profile'
          objectFit='cover'

        />
        </div>
       
       </div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Snowy</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">25</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">5</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Female</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center"><BiDotsVertical /></div>
      </div>

      <div class="flex ">
       <div class="w-1/4 h-20  p-2  flex justify-center items-center">
        <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
        <Image
           src="https://imgix.ranker.com/user_node_img/4373/87457608/original/nezuko-kamado-u-1063447507?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&bg=fff&h=300&w=300"
          fill
          alt='profile'
          objectFit='cover'

        />
        </div>
       
       </div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Snowy</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">25</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">5</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Female</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center"><BiDotsVertical /></div>
      </div>
      <div class="flex ">
       <div class="w-1/4 h-20  p-2  flex justify-center items-center">
        <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
        <Image
           src="https://imgix.ranker.com/user_node_img/4373/87457608/original/nezuko-kamado-u-1063447507?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&bg=fff&h=300&w=300"
          fill
          alt='profile'
          objectFit='cover'

        />
        </div>
       
       </div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Snowy</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">25</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">5</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Female</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center"><BiDotsVertical /></div>
      </div>

      <div class="flex ">
       <div class="w-1/4 h-20  p-2  flex justify-center items-center">
        <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
        <Image
           src="https://imgix.ranker.com/user_node_img/4373/87457608/original/nezuko-kamado-u-1063447507?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&bg=fff&h=300&w=300"
          fill
          alt='profile'
          objectFit='cover'

        />
        </div>
       
       </div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Snowy</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">25</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">5</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Female</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center"><BiDotsVertical /></div>
      </div>

      <div class="flex ">
       <div class="w-1/4 h-20  p-2  flex justify-center items-center">
        <div className='relative w-[100px] h-[60px] rounded-sm overflow-hidden'>
        <Image
           src="https://imgix.ranker.com/user_node_img/4373/87457608/original/nezuko-kamado-u-1063447507?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&bg=fff&h=300&w=300"
          fill
          alt='profile'
          objectFit='cover'

        />
        </div>
       
       </div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Snowy</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">25</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">5</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center">Female</div>
       <div class="w-1/4 h-20 text-center  flex justify-center items-center"><BiDotsVertical /></div>
      </div>
      
        
       </div>
    
       
    </div>
  )
}

export default ListOfPet