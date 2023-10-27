import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import { BiDotsVertical} from "react-icons/bi";


function Tables() {
  return (
    <>

    <div className='p-2 flex justify-evenly'>
      <label className='text-center font-bold'>Image</label>
      <label className='text-center font-bold'>Petname</label>
      <label className='text-center font-bold'>Weight</label>
      <label className='text-center font-bold'>Age</label>
      <label className='text-center font-bold'>Gender</label>
      <label className='text-center font-bold'></label>
      
    </div>
  
    <Table>
    <TableHeader>
    </TableHeader>

    <TableBody>


     <TableRow>
        <TableCell className='w-52'>
        <div className="w-[110px] h-[60px] overflow-hidden relative ml-[30px] rounded-md">
        <Image
           src="/Image/anyaCuttie.jpg"
           quality={100}
           fill
          alt='profile'
        />
      </div>
        </TableCell>
        <TableCell className='text-center'>Snowy</TableCell>
        <TableCell className='text-center'>19.25</TableCell>
        <TableCell className='text-center'>05</TableCell>
        <TableCell className='text-center'>Female</TableCell>
        <TableCell className='self-center text-[20px]'><BiDotsVertical /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell className=''>
        <div className="w-[110px] h-[60px] overflow-hidden relative ml-[50px] rounded-md">
        <Image
           src="/Image/anyaCuttie.jpg"
           quality={100}
           fill
          alt='profile'
        />
      </div>
        </TableCell>
        <TableCell className='text-center'>Snowy</TableCell>
        <TableCell className='text-center'>19.25</TableCell>
        <TableCell className='text-center'>05</TableCell>
        <TableCell className='text-center'>Female</TableCell>
        <TableCell className='self-center text-[20px]'><BiDotsVertical /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell className=''>
        <div className="w-[110px] h-[60px] overflow-hidden relative ml-[30px] rounded-md">
        <Image
           src="/Image/anyaCuttie.jpg"
           quality={100}
           fill
          alt='profile'
        />
      </div>
        </TableCell>
        <TableCell className='text-center'>Snowy</TableCell>
        <TableCell className='text-center'>19.25</TableCell>
        <TableCell className='text-center'>05</TableCell>
        <TableCell className='text-center'>Female</TableCell>
        <TableCell className='self-center text-[20px]'><BiDotsVertical /></TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell className=''>
        <div className="w-[110px] h-[60px] overflow-hidden relative ml-[30px] rounded-md">
        <Image
           src="/Image/anyaCuttie.jpg"
           quality={100}
           fill
          alt='profile'
        />
      </div>
        </TableCell>
        <TableCell className='text-center'>Snowy</TableCell>
        <TableCell className='text-center'>19.25</TableCell>
        <TableCell className='text-center'>05</TableCell>
        <TableCell className='text-center'>Female</TableCell>
        <TableCell className='self-center text-[20px]'><BiDotsVertical /></TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell className=''>
        <div className="w-[110px] h-[60px] overflow-hidden relative ml-[30px] rounded-md">
        <Image
           src="/Image/anyaCuttie.jpg"
           quality={100}
           fill
          alt='profile'
        />
      </div>
        </TableCell>
        <TableCell className='text-center'>Snowy</TableCell>
        <TableCell className='text-center'>19.25</TableCell>
        <TableCell className='text-center'>05</TableCell>
        <TableCell className='text-center'>Female</TableCell>
        <TableCell className='self-center text-[20px]'><BiDotsVertical /></TableCell>
      </TableRow>

  
      
    
     
    </TableBody>
   
  
  </Table>

  </>
  
  )
}

export default Tables