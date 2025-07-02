import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin, Button, Transfer, AutoComplete } from "antd"
import {
	LoadingOutlined,
	SaveOutlined,
	SearchOutlined,
} from "@ant-design/icons"
import GroupsTableViewBr from "../../Components/GroupsTableViewBr"
import FormHeader from "../../Components/FormHeader"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { useNavigate } from "react-router-dom"

function AssignMemberToGroup() {
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [groupSearchKeywords, setGroupSearchKeywords] = useState(() => "")
	const [groups, setGroups] = useState(() => [])
	const [group, setGroup] = useState(() => "")

	const [memberNameOrCode, setMemberNameOrCode] = useState(() => "")

	const [approvalStatus, setApprovalStatus] = useState("S")

	const fetchSearchedGroups = async () => {
		setLoading(true)
		const creds = {
			group_name: groupSearchKeywords,
		}
		await axios
			.post(`${url}/admin/search_group_web`, creds)
			.then((res) => {
				console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJj", res?.data)
				setGroups(res?.data?.msg)
			})
			.catch((err) => {
				Message("error", "Some error occurred while searching...")
			})
		setLoading(false)
	}

	// const mockData = Array.from({
	// 	length: 20,
	// }).map((_, i) => ({
	// 	key: i.toString(),
	// 	title: `content${i + 1}`,
	// 	description: `description of content${i + 1}`,
	// }))

	// const initialTargetKeys = mockData
	// 	.filter((item) => Number(item.key) > 10)
	// 	.map((item) => item.key)

	const [initialDataSource, setInitialDataSource] = useState([])

	const [targetKeys, setTargetKeys] = useState([])
	const [selectedKeys, setSelectedKeys] = useState([])
	const onChange = (nextTargetKeys, direction, moveKeys) => {
		console.log("targetKeys:", nextTargetKeys)
		console.log("direction:", direction)
		console.log("moveKeys:", moveKeys)
		setTargetKeys(nextTargetKeys)
	}

	const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
		console.log("sourceSelectedKeys:", sourceSelectedKeys)
		console.log("targetSelectedKeys:", targetSelectedKeys)
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
	}
	// const onScroll = (direction, e) => {
	// 	console.log("direction:", direction)
	// 	console.log("target:", e.target)
	// }

	// const mockVal = (str, repeat = 1) => ({
	// 	value: str.repeat(repeat),
	// })

	const fetchMembers = async () => {
		setLoading(true)
		const creds = {
			search_name: memberNameOrCode,
		}
		await axios
			.post(`${url}/admin/grp_ass_member`, creds)
			.then((res) => {
				console.log("LLlLLlllLLllllLLl", res?.data)

				setInitialDataSource((prevData) => [
					...res?.data?.msg?.map((item, i) => ({
						key: item?.member_code?.toString(),
						title: `${item?.client_name}`,
						description: `${item?.member_code}`,
					})),
					...prevData,
				])
			})
			.catch((err) => {
				console.log(err)
			})
		setLoading(false)
	}

	const onSubmit = async () => {
		setLoading(true)
		const creds = {
			group_code: group?.split(",")[0],
			member_code: targetKeys,
			added_by: userDetails?.emp_name,
		}
		await axios
			.post(`${url}/admin/assign_group_to_mem`, creds)
			.then((res) => {
				Message("success", "Members assigned!")
				// navigate(`/homemis/searchgroup`)
				setMemberNameOrCode(() => "")
				setInitialDataSource(() => [])
				setGroups(() => [])
				setGroup(() => "")
			})
			.catch((err) => {
				Message("error", "Some error occurred while assigning.")
				console.log(err)
			})
		setLoading(false)
	}

	return (
		<div>
			<Sidebar mode={1} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-10 py-10 h-auto my-10 mx-32 bg-white rounded-xl">
					<FormHeader text={`Assign Member to Group`} mode={1} />

					<div className="flex flex-col justify-center items-center">
						<div className="grid grid-cols-2 gap-5 mt-1 w-full">
							<div className="flex flex-row gap-2 justify-between items-center sm:col-span-2">
								<div className="w-full">
									<TDInputTemplateBr
										placeholder="Type Member Name / Code..."
										type="text"
										label="Member Name / Code"
										name="mem_name"
										formControlName={memberNameOrCode}
										handleChange={(e) => setMemberNameOrCode(e.target.value)}
										mode={1}
									/>
								</div>
								<button
									icon={<SearchOutlined />}
									iconPosition="end"
									className="bg-blue-700 text-white hover:bg-blue-800 p-5 text-center text-sm border-none rounded-xl w-36 h-10 flex justify-center items-center align-middle gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed active:ring-2 active:ring-blue-400 mt-6"
									onClick={fetchMembers}
									// disabled={!searchKeywords}
								>
									<SearchOutlined />
									Search
								</button>
							</div>

							{initialDataSource.length > 0 && (
								<div className="flex flex-row gap-2 justify-between items-center">
									<div className="w-full">
										<TDInputTemplateBr
											placeholder="Type Group Name / Code..."
											type="text"
											label="Group Name / Code"
											name="grp_name"
											formControlName={groupSearchKeywords}
											handleChange={(e) =>
												setGroupSearchKeywords(e.target.value)
											}
											mode={1}
										/>
									</div>
									<button
										icon={<SearchOutlined />}
										iconPosition="end"
										className="bg-blue-700 text-white hover:bg-blue-800 p-5 text-center text-sm border-none rounded-xl w-36 h-10 flex justify-center items-center align-middle gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed active:ring-2 active:ring-blue-400 mt-6"
										onClick={fetchSearchedGroups}
									>
										<SearchOutlined />
										Search
									</button>
								</div>
							)}

							{groups.length > 0 && (
								<div>
									<TDInputTemplateBr
										placeholder="Choose Group..."
										type="text"
										label="Choose Group"
										name="grp"
										formControlName={group}
										handleChange={(e) => setGroup(e.target.value)}
										// handleBlur={formik.handleBlur}
										data={groups?.map((item, i) => ({
											code: item?.group_code + "," + item?.group_name,
											name: item?.group_name,
										}))}
										// data={[
										// 	{ code: "M", name: "Male" },
										// 	{ code: "F", name: "Female" },
										// 	{ code: "O", name: "Others" },
										// ]}
										mode={2}
									/>
								</div>
							)}
						</div>

						<div className="sm:col-span-2 mt-10">
							<Transfer
								className="align-middle justify-center"
								dataSource={initialDataSource}
								titles={[
									"Members",
									!group.split(",")[1]
										? "Assigned in Group"
										: group.split(",")[1],
								]}
								listStyle={{
									width: 250,
									height: 300,
								}}
								operations={["Assign", "Remove"]}
								targetKeys={targetKeys}
								selectedKeys={selectedKeys}
								onChange={onChange}
								onSelectChange={onSelectChange}
								// onScroll={onScroll}
								render={(item) => item.title}
								disabled={!group}
							/>
						</div>

						<div>
							<button
								type="button"
								className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-[#6457A6] transition ease-in-out hover:bg-[#4e4480] duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#92140C] dark:hover:bg-gray-600"
								onClick={onSubmit}
								disabled={targetKeys.length === 0 && !group.split(",")[0]}
							>
								<SaveOutlined className="mr-2 self-center" />
								SUBMIT
							</button>
						</div>
					</div>
				</main>
			</Spin>
		</div>
	)
}

export default AssignMemberToGroup
