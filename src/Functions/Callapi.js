import axios from "axios"
import { url } from "../Address/BaseUrl"
import { Message } from "../Components/Message"

export const callapi = (apiUrl, flag, data) => {
	var result
	if (flag == 1) {
		axios
			.post(url + apiUrl, data)
			.then((res) => {
				console.log(res)
				result = res
				if (res.data.suc > 0) {
					Message("success", res.data.msg)
				} else Message("error", res.data.msg)
			})
			.catch((err) => Message("error", err))
	}
	// else{
	// axios.post(url+'/api/addcategory',{catnm:values.catnm,user:localStorage.getItem('email')}).then(res=>
	//     {
	//       console.log(res)
	//     if(res.data.suc>0)
	//       {Message('success',res.data.msg);formik.handleReset()}
	//     else
	//       Message('error',res.data.msg)

	//     }
	//     ).catch(err=>Message('error',err))
	// }
	return result
}
