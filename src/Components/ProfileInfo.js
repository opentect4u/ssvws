import React from "react"
import { Descriptions, Button } from "antd"
import { EditOutlined } from "@ant-design/icons"

const ProfileInfo = () => {
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const items = [
		{
			key: "1",
			label: "Name",
			children: <p>{userDetails?.emp_name}</p>,
		},
		{
			key: "2",
			label: "Phone",
			children: <p>{userDetails?.phone_mobile}</p>,
		},
		{
			key: "3",
			label: "Email",
			children: <p>{userDetails?.email || ""}</p>,
		},
		{
			key: "4",
			label: "Branch",
			children: <p>{userDetails?.branch_name}</p>,
		},
		{
			key: "5",
			label: "User Type",
			children: <p>{userDetails?.user_type}</p>,
		},
		{
			key: "6",
			label: "Gender",
			children: (
				<p>
					{userDetails?.gender === "M"
						? "Male"
						: userDetails?.gender === "F"
						? "Female"
						: userDetails?.gender === "O"
						? "Others"
						: "Error"}
				</p>
			),
		},
	]

	console.log("KKKKKKKKKKKKKKKKKK", localStorage.getItem("emp_name"))
	return (
		<>
			<Descriptions
				title="Your profile"
				labelStyle={{ color: "#1e429f", fontWeight: "bold" }}
				items={items}
			/>
			{/* <Button
				className="rounded-full bg-blue-800 text-white mt-10 float-right"
				onClick={() => onEditPress()}
				icon={<EditOutlined />}
			></Button> */}
		</>
	)
}

export default ProfileInfo
