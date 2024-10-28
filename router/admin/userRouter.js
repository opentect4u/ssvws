const userRouter = require('express').Router();
dateFormat = require('dateformat');
const bcrypt = require("bcrypt");
const { db_Select, db_Insert } = require('../../model/mysqlModel');

// userRouter.post("/sign_up", async (req, res) => {
//     var data = req.body, result;
//     console.log(data,'yyy');
//      const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

//     var select = "emp_id,branch_id,emp_name",
//     table_name = "md_employee",
//     whr = `emp_id = '${data.emp_id}'`;
//     var emp_dt = await db_Select(select,table_name,whr,null)

//     if(emp_dt.suc > 0) {
//         if(emp_dt.msg.length > 0){
//                 var pass = bcrypt.hashSync(data.pwd.toString(), 10);
//                 var table_name = "md_user",
//                 fields = `(emp_id, brn_code, password, user_status, created_by, created_at)`,
//                 values = `('${data.emp_id}', '${data.brn_code}', '${pass}', 'A', '${data.created_by}', '${datetime}')`,
//                 whr = null,
//                 flag = 0;
//                 var sign_data = await db_Insert(table_name,fields,values,whr,flag);
//                 res.send({ suc: 1, msg: "Employee registered successfully",  dtls: sign_data.msg[0] });
//     }else {
//         result = { suc: 2, msg: "No data found", dt: emp_dt };
//         res.send(result)
//     }
//     }else {
//         result = { suc: 0, msg: emp_dt.msg, dt: emp_dt };
//         res.send(result)
//     }
// });

userRouter.post("/fetch_sign_up_dt", async (req, res) => {
    var data = req.body,result;
    console.log(data,'kkk');
    const datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

    var select = "emp_id,branch_id,emp_name",
    table_name = "md_employee",
    whr = `emp_id = '${data.emp_id}'`;
    var emp_dt = await db_Select(select,table_name,whr,null)
    
    if(emp_dt.suc > 0 && emp_dt.msg.length > 0) { 
            var select = "emp_id,brn_code",
            table_name = "md_user",
            whr = `emp_id = '${data.emp_id}'`;
            var sign_data = await db_Select(select,table_name,whr,null)
           
           if (sign_data.suc > 0){
            if(sign_data.msg.length > 0){
                res.send({ suc: 1, msg: "Already registered",  dtls: sign_data.msg[0] }); 
            }else{
                result = { suc: 1, msg: emp_dt.msg, dt: emp_dt };
                res.send(result)
            }
           }else{
             result = { suc: 2, msg: "error to fetch data", dt: emp_dt };
             res.send(result)
           }
    }else{
        result = { suc: 0, msg: emp_dt.msg, dt: emp_dt };
        res.send(result)
    }    
           
});

module.exports = {userRouter}