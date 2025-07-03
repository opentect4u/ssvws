import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HeadingTemplate from "../Components/HeadingTemplate";
import VError from "../Components/VError";
import TDInputTemplate from "../Components/TDInputTemplate";
import axios from "axios";
import { url } from "../Address/BaseUrl";
import {
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  LoadingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DialogBox from "../Components/DialogBox";
import PrintComp from "../Components/PrintComp";
import AuditTrail from "../Components/AuditTrail";
import Viewdetails from "../Components/Viewdetails";
import { Spin, Tag } from "antd";
import { Message } from "./Message";
import moment from 'moment'

function UploadTemplate({ onSubmit, flag, title }) {
  const [visible, setVisible] = useState(false);
  const [loading,setLoading]=useState(false)
  const [count, setCount] = useState(0);
  const [checkLoad, setCheckLoad] = useState(false);
  const [itemList, setItemList] = useState([]);
  const navigate = useNavigate();
  const [flag1, setFlag] = useState(4);
  const [id, setId] = useState();
  const [itemInfo, setItemInfo] = useState();
  const [items, setItems] = useState([]);
  const [qty, setQty] = useState();
  const [po_no, setPoNo] = useState("");
  const [test_dt, setTestDt] = useState("");
  const [test_place, setTestPlace] = useState("");
  const [item_no, setItemNo] = useState("");
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState("");
  const [test_person, setPerson] = useState("");
  const [doc1, setDoc1] = useState();
  const [doc2, setDoc2] = useState();
  const [fileList, setFileList] = useState([]);
  const params = useParams();
  useEffect(() => {
    if (params.id > 0) {
        setLoading(true)
      setCount(1);
      if (flag == "T") {
        axios
          .post(url + "/api/gettc", { id: params.id })
          .then((res) => {
            setLoading(false)
            console.log(res);
            setTestDt(res?.data?.msg?.test_dt);
            setTestPlace(res?.data?.msg?.test_place);
            setPerson(res?.data?.msg?.test_person);
            setPoNo(res?.data?.msg?.po_no);
            setComments(res?.data?.msg?.comments);
            getItemInfo(res?.data?.msg?.po_no);
            setItemNo(res?.data?.msg?.item)
            setQty(res?.data?.msg?.qty)
            setStatus(res?.data?.msg?.status)
            axios
            .post(url + "/api/gettcdoc", { id: params.id, item: res?.data?.msg?.item.toString() })
            .then((res) => {
              console.log(res);
              for (let i of res?.data?.msg) {
                fileList.push(i.doc1);
                console.log(i.doc1);
              }
              setFileList(fileList);
  
              // setQty(res?.data?.msg[0]?.qty)
              // setStatus(res?.data?.msg[0]?.status)
            });
          })
          .catch((err) => {
            console.log(err);
            navigate("/error" + "/" + err.code + "/" + err.message);
          });
      } else {
        axios
          .post(url + "/api/getmdcc", { id: params.id })
          .then((res) => {
            setLoading(false)
            console.log(res);
            setTestDt(res?.data?.msg?.test_dt);
            setPoNo(res?.data?.msg?.po_no);
            setComments(res?.data?.msg?.comments);
            getItemInfo(res?.data?.msg?.po_no);
            setItemNo(res?.data?.msg?.item)
            setQty(res?.data?.msg?.qty)
            setStatus(res?.data?.msg?.status)
            axios
            .post(url + "/api/getmdccdoc", { id: params.id, item: res?.data?.msg?.item.toString()})
            .then((res) => {
              console.log(res);
              for (let i of res?.data?.msg) {
                fileList.push(i.doc1);
                console.log(i.doc1);
              }
              setFileList(fileList);
            });

          })
          .catch((err) => {
            console.log(err);
            navigate("/error" + "/" + err.code + "/" + err.message);
          });
      }

     
    }
  }, []);
  const deleteItem=()=>{
    setLoading(true)
    let u=flag=='M'?'/api/deletemdcc':'/api/deletetc'
        axios.post(url+u,{id:params.id,user:localStorage.getItem('email')}).then(res=>{
            setLoading(false)
            if(res?.data?.suc>0){
                
                Message('success',res?.data?.msg)
                navigate(-1)
            }
            else{
                Message('success',res?.data?.msg)

            }
        })
  }
  const getItemInfo = (po_no) => {
    setLoading(true)
    axios
      .post(url + "/api/getpo", { id: 0 })
      .then((resPO) => {
        setId(resPO?.data?.msg?.filter((e) => e.po_no == po_no)[0]?.sl_no);

        axios
          .post(url + "/api/getpoitemfortc", {
            id: resPO?.data?.msg?.filter((e) => e.po_no == po_no)[0]?.sl_no,
          })
          .then((resItems) => {
            if(flag=='T'){
              axios.post(url+'/api/getitemdoctc',{po_no:po_no}).then(restc=>{
                console.log(restc)
                setLoading(false)
                console.log(resItems);
                setItems(resItems?.data?.msg);
                if(params.id==0){
                for (let i of resItems?.data?.msg) {
                  let f=0
                  for(let j of restc?.data?.msg){
                    if(+j.item_id==+i.sl_no)
                      f=1
                  }
                  if(f==0)
                  itemList.push({ code: i.sl_no, name: i.prod_name });
                }}
                else{
                  for (let i of resItems?.data?.msg) {
                  itemList.push({ code: i.sl_no, name: i.prod_name });

                  }
                }
                setItemList(itemList);
              })
            }
            else{
              axios.post(url+'/api/getitemdocmdcc',{po_no:po_no}).then(resmdcc=>{
                console.log(resmdcc)
                setLoading(false)
            console.log(resItems);
            setItems(resItems?.data?.msg);
            if(params.id==0){
            for (let i of resItems?.data?.msg) {
              let f=0
              for(let j of resmdcc?.data?.msg){
                if(+j.item_id==+i.sl_no)
                  f=1
              }
              if(f==0)
              itemList.push({ code: i.sl_no, name: i.prod_name });
            }}
            else{
              for (let i of resItems?.data?.msg) {
              itemList.push({ code: i.sl_no, name: i.prod_name });

              }
            }
            setItemList(itemList);
              
              })

            }
            
          })
          .catch((err) => {
            console.log(err);
            navigate("/error" + "/" + err.code + "/" + err.message);
          });
      })
      .catch((err) => {
        console.log(err);
        navigate("/error" + "/" + err.code + "/" + err.message);
      });
  };
  const onsubmit = () => {
    onSubmit({
      po_no: po_no,
      test_dt: test_dt,
      test_place: test_place,
      doc1: doc1,
      doc2: doc2,
      test_person: test_person,
      comments: comments,
      item_no: item_no,
      qty: qty,
      status: status,
    });
  };
  const onChangeItem = (value) => {
    setFileList([]);
    fileList.length = 0;
    if (params.id == 0) {
      console.log(value);
      console.log(items.filter((e) => e.sl_no == value)[0]);
      setQty(items.filter((e) => e.sl_no == value)[0].quantity);
      console.log(items);
    } 
  };
  const checkid = () => {
    if (po_no) {
      setCheckLoad(true);
      axios
        .post(url + "/api/check_po_no_for_doc", { po_no: po_no })
        .then((res) => {
          console.log(res.data.msg[0].count);
          setCheckLoad(false);
          setCount(res.data.msg[0].count);
          itemList.length = 0;
          setItemList([]);
          if (res.data.msg[0].count > 0) {
            getItemInfo(po_no);
           
          }
        })
        .catch((err) =>
          navigate("/error" + "/" + err.code + "/" + err.message)
        );
    }
  };
  return (
    <section className="bg-transparent dark:bg-[#001529]">
      <HeadingTemplate
        text={title}
        mode={params.id > 0 ? 1 : 0}
        title={"Category"}
        data={""}
      />
       <Spin
      indicator={<LoadingOutlined spin />}
      size="large"
      className="text-green-900 dark:text-gray-400"
      spinning={loading}
    >
      <div className="grid grid-cols-12 gap-2">
        <div className={"w-full col-span-12 bg-white p-6 rounded-2xl"}>
          <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
            <div className="sm:col-span-12">
              <TDInputTemplate
                placeholder="PO No."
                type="text"
                label="PO No."
                name="po_no"
                formControlName={po_no}
                handleChange={(txt) => setPoNo(txt.target.value)}
                handleBlur={() => checkid()}
                disabled={params.id > 0}
                mode={1}
              />

              {checkLoad && (
                <Tag icon={<SyncOutlined spin />} color="processing">
                  Checking...
                </Tag>
              )}
              {count == 0 && po_no && (
                <VError title={"PO No. either does not exist or has not been approved!"} />
              )}

              {!po_no ? <VError title={"PO No. is required"} /> : null}
              {count > 0 && po_no && (
                <Viewdetails
                  click={() => {
                    setFlag(14);
                    setVisible(true);
                  }}
                />
              )}
            </div>
            <div className={flag == "T" ? "sm:col-span-6" : "sm:col-span-12"}>
              <TDInputTemplate
                placeholder="Test Date"
                type="date"
                label="Test Date"
                disabled={params.id > 0}
                max={moment(new Date()).format('yyyy-MM-DD')}
                name="test_dt"
                formControlName={test_dt}
                handleChange={(txt) => setTestDt(txt.target.value)}
                mode={1}
              />

              {!test_dt ? <VError title={"Date is required"} /> : null}
            </div>
            {flag == "T" && (
              <div className="sm:col-span-6">
                <TDInputTemplate
                  placeholder="Test Place"
                  type="text"
                  label="Test Place"
                  disabled={params.id > 0}
                  name="test_place"
                  formControlName={test_place}
                  handleChange={(txt) => setTestPlace(txt.target.value)}
                  mode={1}
                />

                {!test_place ? <VError title={"Place is required"} /> : null}
              </div>
            )}
            <div className="sm:col-span-4">
              <TDInputTemplate
                placeholder="Items"
                type="text"
                label="Items"
                name="item"
                disabled={params.id>0}
                formControlName={item_no}
                handleChange={(e) => {
                  {
                    setItemNo(e.target.value);
                    onChangeItem(e.target.value);
                  }
                }}
                mode={2}
                data={itemList}
              />
{params.id==0 && po_no && <p id="helper-text-explanation" className="mt-2 text-xs text-gray-500 dark:text-gray-400">Item under this PO not having a certificate appears here. </p>}
              {!item_no && params.id == 0 ? (
                <VError title={"Item is required"} />
              ) : null}
            </div>

            <div className="sm:col-span-4">
              <TDInputTemplate
                placeholder="Quantity"
                type="number"
                label="Quantity"
                disabled={params.id > 0}
                name="qty"
                formControlName={qty}
                handleChange={(txt) => setQty(txt.target.value)}
                mode={1}
              />

              {!qty && params.id == 0 ? (
                <VError title={"Quantity is required"} />
              ) : null}
               {qty<0  ? (
                <VError title={"Quantity should be non-zero positive"} />
              ) : null}
            </div>
            <div className="sm:col-span-4">
              <TDInputTemplate
                placeholder="Status"
                type="text"
                label="Status"
                disabled={params.id > 0}
                name="status"
                formControlName={status}
                handleChange={(txt) => setStatus(txt.target.value)}
                mode={2}
                data={[
                  { code: "O", name: "Tested OK" },
                  { code: "D", name: "Defective" },
                ]}
              />

              {!status && params.id == 0 ? (
                <VError title={"Status is required"} />
              ) : null}
            </div>

            <div className="sm:col-span-6">
              <TDInputTemplate
                placeholder="Comments"
                type="file"
                label="Document 1"
                accept={'application/pdf'}
                disabled={params.id > 0}
                name="doc1"
                handleChange={(txt) =>{ 
                  if(txt.target.files[0].size/1000000<=1){
                  setDoc1(txt.target.files[0])
                  }
                  else{
                    setDoc1(null)
                    Message('warning','File size exceeds 1MB')
                  }
                }}
                mode={1}
              />
<p id="helper-text-explanation" className="mt-2 text-xs text-gray-500 dark:text-gray-400">Accepts PDF only.  (Max 1MB) </p>
              {!doc1 && !doc2 && params.id == 0 ? (
                <VError title={"Must upload a file (max 1MB)"} />
              ) : null}
              {fileList?.map((item) => (
                <a target="_blank" href={url + "/uploads/" + item}>
                  {item.toString().split(".")[1] == "pdf" ? (
                    <FilePdfOutlined className="text-6xl my-7 text-red-600" />
                  ) : item.toString().split(".")[1]?.includes("doc") ? (
                    <FileWordOutlined className="text-6xl my-7 text-blue-900" />
                  ) : item.toString().split(".")[1]?.includes("xls") ||
                    item.toString().split(".")[1]?.includes("csv") ? (
                    <FileExcelOutlined className="text-6xl my-7 text-green-800" />
                  ) : (
                    <FileImageOutlined className="text-6xl my-7 text-yellow-500" />
                  )}
                </a>
              ))}
            </div>
            <div className="sm:col-span-6">
              <TDInputTemplate
                placeholder="Comments"
                type="file"
                label="Document 2"
                disabled={params.id > 0}
                name="doc2"
                accept={'application/pdf'}
                handleChange={(txt) =>{ 
                  if(txt.target.files[0].size/1000000<=1)
                  setDoc2(txt.target.files[0])
                 else{
                  setDoc2(null)
                    Message('warning','File size exceeds 1MB')
                 }
                }}
                mode={1}
              />
              <p id="helper-text-explanation" className="mt-2 text-xs text-gray-500 dark:text-gray-400">Accepts PDF only. (Max 1MB) </p>
            </div>
            {flag == "T" && (
              <div className="sm:col-span-6">
                <TDInputTemplate
                  placeholder="Test Persons"
                  type="text"
                  label="Test Persons"
                  name="test_person"
                  disabled={params.id > 0}
                  
                  formControlName={test_person}
                  handleChange={(txt) => setPerson(txt.target.value)}
                  mode={3}
                />

                {!test_person ? (
                  <VError title={"Please enter the persons involved"} />
                ) : null}
              </div>
            )}
            <div className={flag == "T" ? "sm:col-span-6" : "sm:col-span-12"}>
              <TDInputTemplate
                placeholder="Comments"
                type="text"
                label="Comments"
                name="comments"
                disabled={params.id > 0}
                formControlName={comments}
                handleChange={(txt) => setComments(txt.target.value)}
                mode={3}
              />
            </div>
          </div>
          <div className="flex justify-center">
            {params.id == 0 && (
              <button
                onClick={() => onsubmit()}
                disabled={count==0 || qty<0}
                className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
              >
                Submit
              </button>
            )}
            {params.id > 0 && (
              <button
                onClick={() => setVisible(true)}
                className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-900 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      </Spin>
      <DialogBox
        visible={visible}
        flag={flag1}
        id={id}
        onPress={() => setVisible(false)}
        onDelete={() => deleteItem()}
      />
    </section>
  );
}

export default UploadTemplate;
