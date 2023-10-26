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
    <Table>
   
    <TableHeader>
      <TableRow>
        <TableHead className=' w-52 text-center font-bold'>Image</TableHead>
        <TableHead className=' text-center font-bold'>Petname</TableHead>
        <TableHead className=' text-center font-bold'>Weight</TableHead>
        <TableHead className='  text-center font-bold'>Age</TableHead>
        <TableHead className=' text-center font-bold'>Gender</TableHead>
        <TableHead className=' text-center font-bold'></TableHead>
      </TableRow>
    </TableHeader>
 
    <TableBody>
   
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
  
  )
}

export default Tables