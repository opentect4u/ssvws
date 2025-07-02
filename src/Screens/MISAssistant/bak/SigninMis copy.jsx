import React, { useState } from "react"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import IMG from "../../Assets/Images/sign_in.png"
import LOGO from "../../Assets/Images/ssvws_logo.jpg"
import { routePaths } from "../../Assets/Data/Routes"
import VError from "../../Components/VError"
import TDInputTemplate from "../../Components/TDInputTemplate"
import axios from "axios"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { motion } from "framer-motion"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"

function SigninMis() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	// const [loginUserDetails, setLoginUserDetails] = useState(() => "")

	const initialValues = {
		user_id: "",
		password: "",
	}

	const onSubmit = async (values) => {
		setLoading(true)
		console.log(values)

		const creds = {
			emp_id: values?.user_id,
			password: values?.password,
		}

		await axios
			.post(`${url}/login_app`, creds)
			.then((res) => {
				if (res?.data?.suc === 1) {
					// Message("success", res?.data?.msg)
					// setLoginUserDetails()

					localStorage.setItem(
						"user_details",
						JSON.stringify(res?.data?.user_dtls)
					)

					if (res?.data?.user_dtls?.id == 2) {
						navigate(routePaths.BM_HOME)
					}

					if (res?.data?.user_dtls?.id == 3) {
						navigate(routePaths.MIS_ASSISTANT_HOME)
					}
				} else if (res?.data?.suc === 0) {
					Message("error", res?.data?.msg)
				} else {
					Message("error", "No user found!")
				}
			})
			.catch((err) => {
				console.log("PPPPPPPPP", err)
				Message("error", "Some error on server while logging in...")
			})

		setLoading(false)
	}
	const validationSchema = Yup.object({
		user_id: Yup.string().required("User ID is required"),
		password: Yup.string().required("Password is required"),
	})

	const formik = useFormik({
		initialValues,
		onSubmit,
		validationSchema,
		validateOnMount: true,
	})

	return (
		<div className="bg-blue-800 p-20 flex justify-center min-h-screen min-w-screen">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring" }}
				className="grid grid-cols-2 gap-0 h-auto shadow-lg w-5/6"
			>
				<div className="hidden bg-white sm:block rounded-l-3xl">
					{/* <img className="ml-7 h-full w-full" src={`${IMG}`} alt="" /> */}
				</div>
				<div
					className={`hidden sm:block sm:p-5 col-span-2 sm:col-span-1 
        bg-white h-auto space-y-5 w-full
         sm:rounded-r-3xl
        `}
				>
					<div
						className={`max-w-screen px-16
                flex-col items-center justify-center mt-7
                `}
					>
						<div className="flex-col items-center justify-center ml-7 2xl:ml-36 2xl:mt-44">
							<motion.h2
								className="text-blue-800 text-4xl mt-14 ml-24 font-bold"
								initial={{ opacity: 1 }}
								animate={{ opacity: 0, y: -20 }}
								transition={{ delay: 4, type: "tween" }}
							>
								Welcome Back!
							</motion.h2>
							<motion.img
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 4, type: "spring" }}
								src={LOGO}
								className="h-20 -mt-16 -ml-4 sm:ml-9 2xl:ml-7 2xl:h-24"
								alt="Flowbite Logo"
							/>
						</div>

						<form
							onSubmit={formik.handleSubmit}
							className="w-full py-6 sm:ml-10 2xl:space-y-2 2xl:px-8"
						>
							<div className="pt-1 block ">
								<TDInputTemplateBr
									placeholder="Type employee id..."
									type="text"
									label="Employee ID"
									name="user_id"
									formControlName={formik.values.user_id}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
								/>

								{formik.errors.user_id && formik.touched.user_id ? (
									<VError title={formik.errors.user_id} />
								) : null}
							</div>
							<div className="pt-6 block">
								<TDInputTemplateBr
									placeholder="*****"
									type="password"
									label="Your password"
									name="password"
									formControlName={formik.values.password}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
								/>

								{formik.errors.password && formik.touched.password ? (
									<VError title={formik.errors.password} />
								) : null}
							</div>
							
							<div className="pt-2 flex gap-5">
								<Link to={routePaths.SIGN_UP}>
									<p className="text-sm text-blue-800 hover:underline py-2 cursor-pointer">
										Sign Up
									</p>
								</Link>
								<Link to={routePaths.FORGOTPASS}>
									<p className="text-sm text-blue-800 hover:underline py-2 cursor-pointer">
										Forgot password?
									</p>
								</Link>
							</div>
							<Spin
								indicator={<LoadingOutlined spin />}
								size={5}
								className="text-blue-800 w-52 dark:text-gray-400"
								spinning={loading}
							>
								<div className="pt-4 pb-4 flex justify-center text-sm">
									<button
										disabled={!formik.isValid}
										type="submit"
										className="bg-blue-800 hover:duration-500 w-full hover:scale-105 text-white p-3 rounded-full"
									>
										Login to your account
									</button>
								</div>
							</Spin>
						</form>
					</div>
				</div>
			</motion.div>
			<div
				className={`block w-80 sm:hidden 
        bg-white h-auto space-y-5
         rounded-3xl
        `}
			>
				<div
					className={`
                flex-col items-center justify-center mt-7 p-10
                `}
				>
					<div className="flex-col items-center justify-center">
						<motion.h2
							className="text-blue-800 text-4xl mt-14 mx-24 font-bold"
							initial={{ opacity: 1 }}
							animate={{ opacity: 0, y: -20 }}
							transition={{ delay: 4, type: "tween" }}
						>
							Welcome
						</motion.h2>
						<motion.img
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 4, type: "spring" }}
							src={LOGO}
							className="h-20 -mt-16 -ml-4 sm:ml-9 2xl:ml-7 2xl:h-24"
							alt="Flowbite Logo"
						/>
					</div>

					<form
						onSubmit={formik.handleSubmit}
						className="w-full py-6 sm:ml-10 2xl:space-y-2 2xl:px-8"
					>
						<div className="pt-1 block ">
							<TDInputTemplate
								placeholder="user id"
								type="text"
								label="Your User ID"
								name="user_id"
								formControlName={formik.values.user_id}
								handleChange={formik.handleChange}
								handleBlur={formik.handleBlur}
								mode={1}
							/>

							{formik.errors.user_id && formik.touched.user_id ? (
								<VError title={formik.errors.user_id} />
							) : null}
						</div>
						<div className="pt-6 block">
							<TDInputTemplate
								placeholder="*****"
								type="password"
								label="Your password"
								name="password"
								formControlName={formik.values.password}
								handleChange={formik.handleChange}
								handleBlur={formik.handleBlur}
								mode={1}
							/>

							{formik.errors.password && formik.touched.password ? (
								<VError title={formik.errors.password} />
							) : null}
						</div>
						<div className="pt-2">
							<Link to={routePaths.FORGOTPASS}>
								<p className="text-xs text-green-900 hover:underline py-2 cursor-pointer">
									Forgot password?
								</p>
							</Link>
						</div>
						<Spin
							indicator={<LoadingOutlined spin />}
							size={5}
							className="text-blue-800 w-52 dark:text-gray-400"
							spinning={loading}
						>
							<div className="pt-4 pb-4 flex justify-center text-sm">
								<button
									disabled={!formik.isValid}
									type="submit"
									className="bg-blue-800 hover:duration-500 w-full hover:scale-105  text-white p-3 rounded-full"
								>
									Login to your account
								</button>
							</div>
						</Spin>
					</form>
				</div>
			</div>
		</div>
	)
}

export default SigninMis
