import { Alert } from 'antd'
import React from 'react'

const AlertComp = ({msg,msgType,title="ALERT"}) => {
  return (
        <Alert
            message={title}
            description={msg}
            type={msgType ? msgType : "warning"}
            showIcon
            closable
        />
  )
}

export default AlertComp
