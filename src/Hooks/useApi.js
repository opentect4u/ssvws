import React, { useEffect, useState } from "react"
import axios from "axios"
import Loader from "../Components/Loader"
import { Message } from "../Components/Message"
import Democontext, { loaderProvider } from "../Context/Democontext"
const axios_instance = axios.create({
	baseURL: "https://fakestoreapi.com",
	headers: {},
})
let response_count = 0

axios_instance.interceptors.request.use(
	function (config) {
		response_count++
		if (!loaderProvider.loading) {
			// Message('success','Manku KHaichli')
			loaderProvider.setLoading(true)
		}
		// if(!LoaderAccessProvider.loading){
		//     LoaderAccessProvider.setLoader(true)
		// }
		;<Loader hidden={true} />
		console.log(response_count)

		return config
	},
	function (error) {
		return Promise.reject(error)
	}
)

axios_instance.interceptors.response.use(
	function (response) {
		console.log(response_count)
		response_count--
		if (response_count === 0) {
			loaderProvider.setLoading(false)
		}
		return response
	},
	function (error) {
		response_count--
		if (response_count === 0) {
			loaderProvider.setLoading(false)
		}

		return Promise.reject(error)
	}
)

const useApi = (url, flag, dt) => {
	const [data, setData] = useState(null)

	useEffect(() => {
		// fetch(url)
		//   .then((res) => res.json())
		//   .then((data) => setData(data));
		if (flag == 0) {
			axios_instance
				.get(url)
				.then((res) => console.log(res))
				.then((data) => setData(data))
		} else {
			axios_instance
				.post(url, dt)
				.then((res) => console.log(res))
				.then((data) => setData(data))
		}
	}, [url])

	return data
}

export default useApi
