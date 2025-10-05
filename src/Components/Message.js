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
	const key = `message_${Date.now()}`;
	const handleClose = () => {
    message.destroy(key);
  };

	message.open({
		key,
		type: type,
		content: (
			<span style={{ display: "flex", alignItems: "center", gap: "50px", fontWeight:700 }}>
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


			<Button
			size="small"
			type="text"
			onClick={handleClose}
			style={{ color: "#000", marginLeft: "auto" }}
			>
		✖
			</Button>

			</span>
		),
		duration: 0, // Increased duration to give users more time to click
// style: { width: "1000px",margin: "0 auto" },
className: "message_cus_link" // <-- add this
	})
}
// export default Message
