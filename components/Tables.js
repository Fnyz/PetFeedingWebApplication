'use client'

import React from 'react'
import DataTable from 'react-data-table-component'
import Image from 'next/image';


function Tables() {


  
  const columns = [
    {
        name: 'Image',
        selector: row => 
            <Image src ={row.image} width={100} height={100} alt='pet img'/>
        
       
    },
    {
      name: 'Pet name',
      selector: row => row.pet,
  },
  {
    name: 'Weight',
    selector: row => row.weigth,
},
{
  name: 'Age',
  selector: row => row.age,
},
{
  name: 'Gender',
  selector: row => row.gender,
},
    
];

const data = [
    {
        id: 1,
        pet: 'Beetlejuice',
        image: 'https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548_640.jpg',
        weigth:20, 
        age:5,
        gender:'male',
    },
   
]



  return (
    <div>
      <DataTable
       columns={columns}
       data={data}
       direction="auto"
       fixedHeaderScrollHeight='300px'
       pagination={true}
       responsive={true}
    
      />
    </div>
  )
}

export default Tables