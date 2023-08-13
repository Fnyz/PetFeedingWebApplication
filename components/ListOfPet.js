'use client'
import React from 'react'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Tables from './Tables';
import DataTable from 'react-data-table-component'
import Image from 'next/image';
import { useEffect, useState } from 'react';


function ListOfPet() {


    const [loading, setLoading] = useState(false);

    useEffect(() => {
     setLoading(true);
     let out = setTimeout(() => {
      setLoading(false);
     }, 2000);
  
     () => {
      return clearTimeout(out);
     }
    },[loading])
  
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
  


    
    
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  return (
    <div className='border w-4/5 h-[400px] rounded-md shadow-md'>
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className='bg-[#FAB1A0]'>
        <Toolbar>
        <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            List of Pets
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <DataTable
       columns={columns}
       data={data}
       direction="auto"
       fixedheaderscrollheight='300px'
       pagination
       responsive
       progresspending={loading}
      />
    </Box>
    </div>
  )
}

export default ListOfPet