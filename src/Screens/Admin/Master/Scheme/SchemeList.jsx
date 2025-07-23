import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React, { useEffect } from 'react'
import Sidebar from '../../../../Components/Sidebar'
import Radiobtn from '../../../../Components/Radiobtn'
import axios from 'axios'
import { Message } from '../../../../Components/Message'
import SchemeTable from '../../../../Components/Master/SchemeTable'
import { useState } from 'react'
import { url } from '../../../../Address/BaseUrl'
import { apiName } from '../../../../Address/Api'
const options = [
	{
		label: "Active Funds",
		value: "A",
	},
	{
		label: "De-Active Funds",
		value: "D",
	}
]
const SchemeList = () => {
  const [statusType, setStatusType] = useState("A");
  const [md_schemes, setMdSchemes] = useState([]);
  const [md_copy_schemes, setMdCopySchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const onChange = (e) => {
		console.log("radio1 checked", e)
		setStatusType(e)
	}
  useEffect(() => {
      fetchSchemeByStatus(statusType)
  },[statusType])
 
  const fetchSchemeByStatus = async (status) => {
    try{
        setLoading(true);
        const response = await axios.get(`${url}${apiName.getSchemeByStatus}`, {
            params: {
              scheme_id:0,
              status: status
            }
        });
        if(response.request.status === 200) {
          if(response?.data?.suc === 1){
              setMdSchemes(response.data.msg);
              setMdCopySchemes(response.data.msg);
          } else {
              Message("error", "No data found.")
          }
          setLoading(false);
        }
        else{
          setLoading(false);
          Message("error", "Failed to fetch schemes data.");
        }
    }
    catch(err){
      console.error("Error fetching schemes by status:", err);
      setLoading(false);
      Message("error", "Failed to fetch schemes data.");
    }
  }

    const setSearch = (word) => {
      setMdSchemes(
        md_copy_schemes?.filter((e) =>
          e?.scheme_name?.toString()?.toLowerCase().includes(word?.toLowerCase())
        )
      )
	}

  return (
    <div>
			
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-16 mx-32">
					<Radiobtn
						data={options}
						val={statusType}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>
          <SchemeTable
						flag="BM"
						schemesAppData={md_schemes}
						title="Scheme Master"
						setSearch={(data) => setSearch(data)}
					/>
          </main>
      </Spin>
    </div>
  )
}

export default SchemeList
