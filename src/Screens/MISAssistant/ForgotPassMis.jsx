import React, { useState } from "react"
import LOGO from "../../Assets/Images/signinlogo.png"
import TDInputTemplate from "../../Components/TDInputTemplate"
import { motion } from "framer-motion"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import { Spin } from "antd"
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons"
import VError from "../../Components/VError"

const ForgotPassMis = () => {
	const [loading, setLoading] = useState(false)

	const initialValues = {
		email: "",
	}
	const validationSchema = Yup.object({
		email: Yup.string()
			.required("Email is required")
			.email("Not a correct a email format"),
	})
	const onSubmit = (values) => {
		setLoading(true)
		console.log(values)
		setLoading(false)
		formik.resetForm()
	}
	const formik = useFormik({
		initialValues,
		onSubmit,
		validationSchema,
		validateOnMount: true,
	})

	return (
		<div className="bg-green-900 flex justify-center items-center h-screen w-screen">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring" }}
				className="bg-white h-64 w-96 px-6 rounded-3xl shadow-lg"
			>
				<div className="flex items-center justify-center">
					<img src={LOGO} className="h-20 mt-4" alt="Flowbite Logo" />
				</div>
				<form onSubmit={formik.handleSubmit}>
					<div className="my-3">
						<TDInputTemplate
							placeholder="youremail@gmail.com"
							type="email"
							label="Your email"
							name="email"
							formControlName={formik.values.email}
							handleChange={formik.handleChange}
							handleBlur={formik.handleBlur}
							mode={1}
						/>
						{formik.errors.email && formik.touched.email ? (
							<VError title={formik.errors.email} />
						) : null}
						<Link to={"/"}>
							<a
								className="mt-1 text-xs flex items-center text-gray-500 dark:text-gray-300"
								id="file_input_help"
							>
								<LeftOutlined className="text-xs" />
								Back
							</a>
						</Link>
					</div>

					<div className="block text-sm">
						<div className="flex justify-center">
							<Spin
								indicator={<LoadingOutlined spin />}
								size={5}
								className="text-emerald-600 w-52 dark:text-gray-400"
								spinning={loading}
							>
								<button
									type="submit"
									className="bg-green-900 hover:duration-500 w-full hover:scale-105 hover:bg-green-800  text-white p-3 rounded-full"
								>
									Submit
								</button>
							</Spin>
						</div>
					</div>
				</form>
			</motion.div>
		</div>
	)
}

export default ForgotPassMis
