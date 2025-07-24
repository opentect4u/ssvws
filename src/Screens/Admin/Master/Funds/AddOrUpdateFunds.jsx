import React from 'react'
import { FieldArray, Formik, useFormik } from "formik"
import * as Yup from "yup"
import VError from '../../../../Components/VError'
import TDInputTemplateBr from '../../../../Components/TDInputTemplateBr'
import BtnComp from '../../../../Components/BtnComp'
import { SaveOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { url } from '../../../../Address/BaseUrl'
import { apiName } from '../../../../Address/Api'
import axios from 'axios'
import { Message } from '../../../../Components/Message'
const formSchema = Yup.object({
    fund_id:Yup.number().required('Fund id missing').default(0),
    fund_name:Yup.string().required('Fund name missing'),
    created_by:Yup.number().required('Error')
})
const AddOrUpdateFunds = (
    {
        fundDtls,
        saveFunds
    }
) => {
        console.log(fundDtls);
        const userDetails = JSON.parse(localStorage.getItem("user_details"))
      const onSubmit = async (values) =>{
            console.log(values);
            try{
                    const response = await axios.post(`${url}${apiName.addorupdate}`,values);
                    // if()
                    if(response?.request?.status == 200){
                        Message(
                            response?.data?.suc == 0 ? 'error' : 'success',
                            response?.data?.msg
                        )
                        console.log(response?.data)
                        saveFunds({
                            ...values,
                            fund_id:response?.data?.fund_id
                        })
                    }
            }
            catch(err){
                console.log(err);
                console.log('asasdasd')
            }

   }  
    const formik = useFormik({
        initialValues: {
            fund_id: fundDtls?.fund_id || 0 ,
            fund_name: fundDtls?.fund_name || '',
            modified_by: fundDtls?.fund_id > 0 ? userDetails?.emp_id : 0,
			created_by: userDetails?.emp_id, 
        },
        // formValues : initialValues,
        onSubmit,
        validationSchema:formSchema,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        validateOnMount: true,
        
    })

 

  return (
    <div  className='min-h-[calc(100vh_-_106px)]'>
     <form onSubmit={formik.handleSubmit} id="fund_form" className='min-h-[calc(100vh_-_106px)] relative'>
        <div>
            <TDInputTemplateBr
                // placeholder="From CO"
                type="text"
                name={'fund_name'}
                id={'fund_name'}
                label="Fund Name"
                placeholder={'Enter Fund Name'}
                formControlName={formik.values.fund_name}
                value={formik.values.fund_name}
                handleChange={formik.handleChange}
                mode={1}
            />
                {formik.errors.fund_name && formik.touched.fund_name ? (
                    <VError title={formik.errors.fund_name} />
                ) : null}

             
        </div>
                <Button  type="primary" block loading={formik.isSubmitting} htmlType="submit" disabled={!formik.isValid} size='middle' className='float-end mt-2'>Submit</Button>

     </form>
    </div>
  )
}

export default AddOrUpdateFunds
