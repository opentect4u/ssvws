import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { url } from "../../Address/BaseUrl";
import { Message } from "../../Components/Message";
import { Spin } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import EmployeeMasterTable from "../../Components/Master/EmployeeMasterTable";
import MemberTransferTable from "../../Components/Master/MemberTransferTable";

function MemberTransfer() {
  const userDetails = JSON.parse(localStorage.getItem("user_details")) || "";
  const [loading, setLoading] = useState(false);
  const [masterData, setMasterData] = useState(() => []);
  const [copyLoanApplications, setCopyLoanApplications] = useState(() => []);

  const [approvalStatus, setApprovalStatus] = useState("U");
  // const [value2, setValue2] = useState("S")

  const fetchLoanApplications = async (approvalStat) => {
    setLoading(true);

    // const creds = {
    // 	prov_grp_code: 0,
    // 	user_type: userDetails?.id,
    // 	branch_code: userDetails?.brn_code,
    // }

    await axios
      .get(`${url}/show_all_emp`)
      .then((res) => {
        console.log("PPPPPPPPPPPPPPPPPPPP", res?.data);
        if (res?.data?.suc === 1) {
          setMasterData(res?.data?.msg);
          setCopyLoanApplications(res?.data?.msg);

          console.log("PPPPPPPPPPPPPPPPPPPP", res?.data);
        } else {
          Message("error", "No banks found.");
        }
      })
      .catch((err) => {
        Message("error", "Some error occurred while fetching employees!");
        console.log("ERRR", err);
      });
    setLoading(false);
  };

  useEffect(() => {
    fetchLoanApplications("U");
  }, []);

  const setSearch = (word) => {
    setMasterData(
      copyLoanApplications?.filter(
        (e) =>
          e?.emp_name
            ?.toString()
            ?.toLowerCase()
            .includes(word?.toLowerCase()) ||
          e?.branch_name
            ?.toString()
            ?.toLowerCase()
            ?.includes(word?.toLowerCase()) ||
          e?.emp_id?.toString()?.toLowerCase()?.includes(word?.toLowerCase()) ||
          e?.branch_id?.toString()?.toLowerCase()?.includes(word?.toLowerCase())
      )
    );
  };

  // const onChange = (e) => {
  // 	console.log("radio1 checked", e)
  // 	setApprovalStatus(e)
  // }

  useEffect(() => {
    fetchLoanApplications(approvalStatus);
  }, [approvalStatus]);

  return (
    <div>
      <Sidebar mode={2} />
      <Spin
        indicator={<LoadingOutlined spin />}
        size="large"
        className="text-blue-800 dark:text-gray-400"
        spinning={loading}
      >
        <main className="px-4 h-auto my-20 mx-32">
          {/* <Radiobtn data={options} val={"U"} onChangeVal={onChange1} /> */}

          {/* <Radiobtn
						data={options}
						val={approvalStatus}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/> */}
          <div class="relative mt-10">
            <div class="absolute inset-y-0  start-0 flex items-center ps-3 pointer-events-none">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              class="block mt-10 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
              placeholder="Search by Member Name"

              // onChange={(e) => setSearchKeywords(e.target.value)}
            />
            <button
              type="submit"
              class="text-white absolute end-2.5 disabled:bg-[#ee7c98] bottom-2.5 bg-[#DA4167] hover:bg-[#DA4167] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              // onClick={fetchSearchedMembers}
              // 					disabled={!searchKeywords}
            >
              Search
            </button>
          </div>
          <MemberTransferTable
            flag="BM"
            loanAppData={[]}
            title="Member Transfer"
            setSearch={(data) => setSearch(data)}
          />
          {/* <DialogBox
					visible={visible}
					flag={flag}
					onPress={() => setVisible(false)}
				/> */}
        </main>
      </Spin>
    </div>
  );
}

export default MemberTransfer;
