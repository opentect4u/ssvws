import React, { useState } from "react"

const AttendanceDashboard = () => {
	const [activeDescriptionId, setActiveDescriptionId] = useState(null)

	const toggleDescription = (userId) => {
		setActiveDescriptionId((prevId) => (prevId === userId ? null : userId))
	}

	const users = [
		{
			id: "user1",
			name: "Amanda Smith",
			email: "amanda.smith@example.com",
			status: "Active",
			statusColor: "bg-green-500",
			role: "Marketing Coordinator",
			image:
				"https://images.unsplash.com/photo-1560329072-17f59dcd30a4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW4lMjBmYWNlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60",
			description:
				"Amanda Smith is a young professional in the field of marketing. She has skills in planning and executing creative digital marketing campaigns. In her free time, Amanda enjoys playing the piano and exploring nature.",
		},
		{
			id: "user2",
			name: "Michael Williams",
			email: "michael.williams@example.com",
			status: "Inactive",
			statusColor: "bg-yellow-500",
			role: "Software Engineer",
			image:
				"https://images.pexels.com/photos/1054048/pexels-photo-1054048.jpeg?auto=compress&cs=tinysrgb&w=600",
			description:
				"Michael Williams is a software engineer with an in-depth knowledge of web and application development. He is often involved in creating innovative technological solutions. During his leisure time, Michael enjoys playing video games and participating in local chess tournaments.",
		},
		{
			id: "user3",
			name: "Sophia Brown",
			email: "sophia.brown@example.com",
			status: "Suspend",
			statusColor: "bg-red-500",
			role: "Freelance Writer",
			image:
				"https://images.pexels.com/photos/3756907/pexels-photo-3756907.jpeg?auto=compress&cs=tinysrgb&w=600",
			description:
				"Sophia Brown is a prolific freelance writer, crafting informative articles and creative content for various clients. In her life, she's always seeking new inspiration by attending art exhibitions and literary events.",
		},
	]

	return (
		<div className="bg-gray-100 min-h-screen flex items-center justify-center px-8">
			<div className="items-center w-full mx-auto bg-white rounded-lg shadow-md sm:max-w-4xl">
				<div className="mx-auto overflow-x-auto">
					<div className="flex text-gray-700 justify-between rounded-lg p-4 bg-white w-full items-center space-x-16">
						<div className="flex items-center">
							<p className="font-medium text-sm">Results 1 - 3 of 3</p>
						</div>
						<form>
							<div className="relative">
								<select className="block appearance-none w-full text-sm bg-gray-100 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
									<option selected>5</option>
									<option>10</option>
									<option>20</option>
									<option>50</option>
								</select>
							</div>
						</form>
					</div>
					<table className="w-full table-auto">
						<thead>
							<tr className="text-sm font-normal text-gray-600 border-t border-b text-left bg-gray-50">
								<th className="px-4 py-3">Name</th>
								<th className="px-4 py-3">Email</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3"></th>
							</tr>
						</thead>
						<tbody className="text-sm font-normal text-gray-700">
							{users.map((user) => (
								<React.Fragment key={user.id}>
									<tr
										className="py-10 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
										onClick={() => toggleDescription(user.id)}
									>
										<td className="flex flex-row items-center px-4 py-4">
											<div className="flex w-10 h-10 mr-4">
												<a href="#" className="relative block">
													<img
														alt="profile"
														src={user.image}
														className="object-cover w-10 h-10 mx-auto rounded-md"
													/>
												</a>
											</div>
											<div className="flex-1 pl-1">
												<div className="font-medium dark:text-white">
													{user.name}
												</div>
												<div className="text-sm text-blue-600 dark:text-gray-200">
													{user.role}
												</div>
											</div>
										</td>
										<td className="px-4 py-4">{user.email}</td>
										<td>
											<div className="flex items-center pl-1">
												<div
													className={`w-2 h-2 ${user.statusColor} rounded-full mr-2`}
												></div>
												{user.status}
											</div>
										</td>
										<td className="p-4">
											<div
												className={`text-white bg-gray-100 border rounded-lg px-4 py-4 text-center inline-flex items-center ${
													activeDescriptionId === user.id ? "flipped-icon" : ""
												}`}
											>
												<svg
													className="w-4 h-4"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
												>
													<path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"></path>
												</svg>
											</div>
										</td>
									</tr>
									{activeDescriptionId === user.id && (
										<tr className="py-4 px-4 border-t border-gray-200">
											<td colSpan="4" className="p-8">
												<h4 className="font-medium text-base text-blue-500 underline mb-2">
													Deskripsi
												</h4>
												<p className="text-sm text-gray-600">
													{user.description}
												</p>
											</td>
										</tr>
									)}
								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default AttendanceDashboard
