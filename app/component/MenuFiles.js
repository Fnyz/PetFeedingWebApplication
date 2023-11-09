import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { BiDotsVerticalRounded} from "react-icons/bi";


export default function MenuPopupState() {

    const [openProfile, setOpenProfile] = React.useState(false);

   const handleOpenAccount = (popupState) => {
    setOpenProfile(true);
    popupState.close();
   }
  return (
    <>
     <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant='ghost' {...bindTrigger(popupState)} className='w-[10px]'>
          <BiDotsVerticalRounded size={20}/>
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={()=> handleOpenAccount(popupState)}>My Account</MenuItem>
            <MenuItem onClick={popupState.close}>Logout</MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>

    </>
   
  );
}