import axios from 'axios';
import React, { Suspense, useState } from 'react'
import { useEffect } from 'react';
import { url } from '../../../../Address/BaseUrl';
import { apiName } from '../../../../Address/Api';
import { Drawer, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Sidebar from '../../../../Components/Sidebar';
import FundTable from '../../../../Components/Master/FundTable';
import { Message } from '../../../../Components/Message';
const AddOrUpdateFunds = React.lazy(() => import('./AddOrUpdateFunds'));
const FundsList = () => {

  // State to hold funds data
  const [md_funds, setMdFunds] = useState([]);
  const [loading,setLoading] = useState(true);
  const [copyfunds, setCopyFunds] = useState(() => [])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData,setFormData] = useState(null);
  useEffect(()=>{
    fetchFunds();
  },[])

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const onClose = () => {
    setIsDrawerOpen(false);
  };

  const fetchFunds = async () =>{
        try{
            const payLoad = {
                fund_id: 0,
            }
            const response = await axios.post(`${url}${apiName.getFunds}`,payLoad);
            if(response.request.status === 200){
                // if(response.data){
                //     console.log("Funds Data: ", response.data);
                // }
                if (response?.data?.suc === 1) {
                    setMdFunds(response?.data?.msg)
                    setCopyFunds(response?.data?.msg)
                } else {
                    Message("error", "No data found.")
                }
            }
            else{
                console.error("Failed to fetch funds data");
                // Handle error case
            }
            setLoading(false);
            
        }
        catch(err){
            setLoading(false);

        }
  }
    const setSearch = (word) => {
		setMdFunds(
			copyfunds?.filter((e) =>
				e?.fund_name?.toString()?.toLowerCase().includes(word?.toLowerCase())
			)
		)
	}

    useEffect(()=>{
        if(!isDrawerOpen){
            setFormData(null);
        }
    },[isDrawerOpen])
 
  return (
    <div>
   	    <Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}>
			<main className="px-4 h-auto my-20 mx-32">
                    <FundTable
						flag="BM"
						fundsAppData={md_funds}
						title="Funds Master"
						setSearch={(data) => setSearch(data)}
                        onOpenDrawer={() => {
                                showDrawer();
                        }}
                        onEditFund={(fundDtls) =>{
                            setFormData(fundDtls);
                            showDrawer();
                        }}
					/>
            </main>
        </Spin>
        <Drawer
        title="Funds "
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={isDrawerOpen}
        fundDtls={formData}
      >
        <Suspense fallback={<div>Loading...</div>}>
            <AddOrUpdateFunds
                fundDtls={formData}
                saveFunds={(formDtls)=>{
                        console.log(formData);
                        console.log(formDtls);

                        if(!formData){
                            setMdFunds(prev => [...prev,formDtls]);
                            setCopyFunds(prev => [...prev,formDtls]);
                        }
                        else{
                            const dt = md_funds.map(el => {
                                if(el.fund_id == formDtls?.fund_id){
                                    el.fund_name=formDtls?.fund_name;
                                }
                                return el;
                            })
                            setMdFunds(dt);
                            setCopyFunds(dt);
                        }
                        setFormData(null);
                        console.log(formDtls);
                        onClose();
                }}
            />
        </Suspense>

      </Drawer>
    </div>
  )
}

export default FundsList
