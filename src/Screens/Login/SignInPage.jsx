import React, { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import LOGO from "../../Assets/Images/ssvws_crop-round.png"
import axios from "axios"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import DialogBox from "../../Components/DialogBox"
import { generateRandomAlphanumeric } from "../../Utils/generateRandomAlphanumeric"
import { routePaths } from "../../Assets/Data/Routes"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import coverPhoto from "../../Assets/Images/ssvws_cover_1.jpg"

const SignInPage = () => {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [userTypeId, setUserTypeId] = useState(0)
	const [branches, setBranches] = useState([])
	const [sessionId, setSessionId] = useState("")
	const [visible, setVisible] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	useEffect(() => {
		setSessionId(generateRandomAlphanumeric(15))
	}, [])

	useEffect(() => {
		if (userTypeId !== 0) {
			setLoading(true)
			axios
				.get(`${url}/admin/fetch_branch`)
				.then((res) => {
					setBranches(
						res.data.msg.map((item) => ({
							code: item.branch_code,
							name: `${item.branch_name} (${item.branch_code})`,
						}))
					)
				})
				.catch(console.error)
				.finally(() => setLoading(false))
		}
	}, [userTypeId])

	const formik = useFormik({
		initialValues: { user_id: "", password: "", brnch: "" },
		validationSchema: Yup.object({
			user_id: Yup.string().required("User ID is required"),
			password: Yup.string().required("Password is required"),
			brnch: Yup.string().test(
				"branch-required",
				"Branch is required",
				(value) => {
					if ([4, 10, 11].includes(userTypeId)) return Boolean(value)
					return true
				}
			),
		}),
		validateOnMount: true,
		onSubmit: async (values) => {
			setLoading(true)
			console.log(values)
			console.log(userTypeId == 4, formik.values.brnch != "")
			const creds = {
				emp_id: values?.user_id,
				password: values?.password,
				app_version: "0",
				flag: "W",
				session_id: sessionId,
			}
			if (
				(userTypeId == 4 || userTypeId == 10 || userTypeId == 11) &&
				formik.values.brnch != ""
			) {
				await axios
					.post(`${url}/login_web`, creds)
					.then((res) => {
						if (res?.data?.suc === 0) {
							Message("error", res?.data?.msg)
							setVisible(true)

							return
						}
						var userDtls = res?.data?.user_dtls
						userDtls["brn_code"] =
							userTypeId == 4 || userTypeId == 11 || userTypeId == 10
								? formik.values.brnch
								: res?.data?.user_dtls?.brn_code
						userDtls["branch_name"] =
							userTypeId == 4 || userTypeId == 11 || userTypeId == 10
								? branches.filter((item) => item.code == formik.values.brnch)[0]
										?.name
								: res?.data?.user_dtls?.branch_name
						if (res?.data?.suc === 1) {
							localStorage.setItem("session_id", sessionId)
							localStorage.setItem("server_token", res?.data?.token)
							localStorage.setItem("refresh_token", res?.data?.refresh_token)

							localStorage.setItem("user_details", JSON.stringify(userDtls))
							navigate(routePaths.BM_HOME)
						} else {
							Message("error", "No user found!")
						}
					})
					.catch((err) => {
						console.log("PPPPPPPPP", err)
						Message("error", "Some error on server while logging in...")
					})
			} else if (userTypeId != 4 && userTypeId != 10 && userTypeId != 11) {
				await axios
					.post(`${url}/login_web`, creds)
					.then((res) => {
						if (res?.data?.suc === 0) {
							Message("error", res?.data?.msg)
							setVisible(true)
							return
						}

						var userDtls = res?.data?.user_dtls
						userDtls["brn_code"] =
							userTypeId == 4 || userTypeId == 11 || userTypeId == 10
								? formik.values.brnch
								: res?.data?.user_dtls?.brn_code
						userDtls["branch_name"] =
							userTypeId == 4 || userTypeId == 11 || userTypeId == 10
								? branches.filter((item) => item.code == formik.values.brnch)[0]
										?.name
								: res?.data?.user_dtls?.branch_name
						if (res?.data?.suc === 1) {
							localStorage.setItem("session_id", sessionId)
							localStorage.setItem("server_token", res?.data?.token)
							localStorage.setItem("refresh_token", res?.data?.refresh_token)

							localStorage.setItem("user_details", JSON.stringify(userDtls))

							navigate(routePaths.BM_HOME)
						} else {
							Message("error", "No user found!")
						}
					})
					.catch((err) => {
						console.log("PPPPPPPPP", err)
						Message("error", "Some error on server while logging in...")
					})
			}
			setLoading(false)
		},
	})

	const forceClearSession = async () => {
		const creds = {
			emp_id: formik.values.user_id,
			modified_by: formik.values.password,
		}
		try {
			const res = await axios.post(`${url}/clear_session`, creds)
			if (res.data.suc === 1) {
				Message("success", "Active sessions cleared successfully!")
				formik.handleSubmit()
			} else console.error("Session clearing failed", res.data.msg)
		} catch (err) {
			console.error(err)
		}
	}

	const handleUserBlur = async (e) => {
		formik.handleBlur(e)
		setLoading(true)
		try {
			const res = await axios.post(`${url}/fetch_emp_type`, {
				emp_id: e.target.value,
			})
			const id = res.data.msg[0]?.id || 0
			setUserTypeId(id)
			if ([10, 11].includes(id)) {
				const brnRes = await axios.post(`${url}/fetch_brn_assign`, {
					emp_id: e.target.value,
				})
				if (brnRes.data.suc === 1)
					setBranches(
						brnRes.data.msg.map((item) => ({
							code: item.code,
							name: `${item.name} (${item.code})`,
						}))
					)
				else {
					setBranches([])
					Message("error", "No branch assigned to this user!")
				}
			}
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-800 p-4">
			<div className="relative bg-white rounded-3xl shadow-xl overflow-hidden max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2">
				<div className="p-8 md:p-12 lg:p-16 z-10">
					<div className="flex justify-between items-center mb-10">
						<div className="flex items-center">
							<div className="w-12 h-12 bg-white border border-sky-100 rounded-full mr-2">
								<img
									src={LOGO}
									alt="Logo"
									className="w-full h-full rounded-full"
								/>
							</div>
							<span className="font-semibold text-slate-600 text-2xl">
								SSVWS
							</span>
						</div>
						<nav className="hidden md:flex space-x-6">
							<a
								href="/"
								rel="noreferrer"
								className="text-gray-600 hover:text-blue-600"
							>
								<ArrowBackIcon />
							</a>
							<a
								href={`https://ssvws.opentech4u.co.in/payroll`}
								target="_blank"
								rel="noreferrer"
								className="text-gray-600 hover:text-blue-600"
							>
								Payroll
							</a>
							<a
								href="https://ssvws.opentech4u.co.in/ssvws_fin"
								target="_blank"
								rel="noreferrer"
								className="text-gray-600 hover:text-blue-600"
							>
								Finance
							</a>
						</nav>
					</div>

					<div className="mb-8">
						<h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
							Start from here
						</h3>
						<h1 className="text-3xl md:text-4xl font-bold text-slate-800">
							Sign into loan.
						</h1>
					</div>

					<form onSubmit={formik.handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="user_id"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									User ID
								</label>
								<input
									id="user_id"
									name="user_id"
									type="text"
									onChange={formik.handleChange}
									onBlur={handleUserBlur}
									value={formik.values.user_id}
									className="w-full px-4 py-2 bg-slate-100 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
									placeholder="9999"
								/>
								{formik.touched.user_id && formik.errors.user_id && (
									<div className="text-red-500 text-sm">
										{formik.errors.user_id}
									</div>
								)}
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Password
								</label>
								<div className="relative">
									<input
										id="password"
										name="password"
										type={showPassword ? "text" : "password"}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.password}
										className="w-full px-4 py-2 pr-10 bg-slate-100 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
										placeholder="••••••••"
									/>
									<div
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? (
											<VisibilityOff className="text-slate-700" />
										) : (
											<Visibility className="text-slate-700" />
										)}
									</div>
								</div>
								{formik.touched.password && formik.errors.password && (
									<div className="text-red-500 text-sm">
										{formik.errors.password}
									</div>
								)}
							</div>
						</div>

						{[4, 10, 11].includes(userTypeId) && (
							<div>
								<label
									htmlFor="brnch"
									className="block text-sm font-medium text-slate-700 mb-1"
								>
									Branches / Choose branch
								</label>
								<select
									id="brnch"
									name="brnch"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.brnch}
									className="w-full px-4 py-2 bg-slate-100 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
								>
									<option value="" disabled>
										Select a branch
									</option>
									{branches.map((opt) => (
										<option key={opt.code} value={opt.code}>
											{opt.name}
										</option>
									))}
								</select>
								{formik.touched.brnch && formik.errors.brnch && (
									<div className="text-red-500 text-sm">
										{formik.errors.brnch}
									</div>
								)}
							</div>
						)}

						<Spin indicator={<LoadingOutlined spin />} spinning={loading}>
							<button
								type="submit"
								disabled={!formik.isValid || loading}
								className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
							>
								Sign In
							</button>
						</Spin>
					</form>
				</div>

				<DialogBox
					flag={6}
					visible={visible}
					onPress={() => setVisible(false)}
					onPressYes={forceClearSession}
					onPressNo={() => setVisible(false)}
				/>

				{/* <div className="absolute top-0 bottom-0 lg:left-auto lg:right-0 w-full lg:w-1/2 h-full lg:flex hidden items-center justify-center pointer-events-none z-30 rotate-180">
					<svg
						className="absolute inset-y-0 left-0 h-full w-full wavy-pattern text-white"
						viewBox="0 0 200 400"
						preserveAspectRatio="none"
						fill="currentColor"
					>
						<path d="M150,0 C100,250 200,500 150,750 S100,1000 150,1000 L300,1000 L300,0 Z" />
					</svg>
				</div> */}

				<div className="relative hidden lg:block">
					<img
						src={coverPhoto}
						alt="Scenic view"
						className="absolute inset-y-0 right-0 h-full w-auto object-cover rounded-r-3xl"
					/>
					{/* <div className="absolute inset-0 bg-white opacity-10 rounded-r-3xl" /> */}
				</div>
			</div>
		</div>
	)
}

export default SignInPage
