import React from "react"
import { Button, message, Space } from "antd"
export const Message = (type, msg) => {
	message.open({
		type: type,
		content: msg,
		duration: 2.3,
	})
}

export const MessageWithLink = (type, msg, url, linkText) => {
	message.open({
		type: type,
		content: (
			<span>
				{msg}{" "}
				<a
					href="#"
					onClick={(e) => {
						e.preventDefault()
						window.location.href = url
					}}
					style={{
						color: '#1890ff',
						textDecoration: 'underline'
					}}
				>
					{linkText || "Click here"}
				</a>
			</span>
		),
		duration: 4, // Increased duration to give users more time to click
	})
}
// export default Message
