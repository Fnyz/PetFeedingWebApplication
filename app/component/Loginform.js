

import React from 'react'
import Router from 'next/router'

function Loginform() {

  

  
  return (
    <div onClick={()=> Router.push({
        pathname:'/device',
        query:'hello world'
    })}>Loginform</div>
  )
}

export default Loginform