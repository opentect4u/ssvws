import { Alert } from 'antd'
import React from 'react'

const AlertComp = ({msg,msgType}) => {
  return (
        <Alert
            // style={{
            // 	fontSize: "2.2rem",
            // 	fontWeight: "500",
            // 	// color:'hsl(var())'
            // }}
            
            message={msgType ? msgType : "Warning"}
            description={msg}
            type="warning"
            showIcon
            closable
        />
  )
}

export default AlertComp
