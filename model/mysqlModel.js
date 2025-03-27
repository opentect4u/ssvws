const db = require("../db/db");
// const dateFormat = require("dateformat");

const db_Select = (select, table_name = null, whr = null, order = null, is_full_query = false, full_query = '') => {
  var tb_whr = whr ? `WHERE ${whr}` : "";
  var tb_order = order ? order : "";
  let sql = is_full_query ? full_query : `SELECT ${select} ${table_name ? `FROM ${table_name}` : ''} ${tb_whr} ${tb_order}`;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result, sql };
      }
      resolve(data);
    });
  });
};

const db_Insert = (table_name, fields, values, whr, flag) => {
  var sql = "",
    msg = "",
    tb_whr = whr ? `WHERE ${whr}` : "";
  // 0 -> INSERT; 1 -> UPDATE
  // IN INSERT flieds ARE TABLE COLOUMN NAME ONLY || IN UPDATE fields ARE TABLE NAME = VALUES
  if (flag > 0) {
    sql = `UPDATE ${table_name} SET ${fields} ${tb_whr}`;
    msg = "Updated Successfully !!";
  } else {
    sql = `INSERT INTO ${table_name} ${fields} VALUES ${values}`;
    msg = "Inserted Successfully !!";
  }
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, lastId) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: msg, lastId };
      }
      resolve(data);
    });
  });
};

const db_Delete = (table_name, whr) => {
  whr = whr ? `WHERE ${whr}` : "";
  var sql = `DELETE FROM ${table_name} ${whr}`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, lastId) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: "Deleted Successfully !!" };
      }
      resolve(data);
    });
  });
};

const db_Check = async (fields, table_name, whr) => {
  var sql = `SELECT ${fields} FROM ${table_name} WHERE ${whr}`;
  // console.log(sql);
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
      } else {
        data = { suc: 1, msg: result.length };
      }
      resolve(data);
    });
  });
};

const db_RunProcedureAndFetchData = async (proc_name, dataKey = null, dataArr = [], selFields, selTableName, selWhereField, selWhereArr = [], selOrder = null) => {
  var data = {};
  return new Promise((resolve, reject) => {
    const procedureCall = `CALL ${proc_name}(${dataKey ? dataKey : ''});`;
    var tb_whr = selWhereField ? `WHERE ${selWhereField}` : "";
    var tb_order = selOrder ? selOrder : "";
    const fetchQuery = `SELECT ${selFields} ${selTableName ? `FROM ${selTableName}` : ''} ${tb_whr} ${tb_order}`;

    // console.log(procedureCall, fetchQuery, '--------------');

    db.query(procedureCall, dataArr, (err, result) => {
      if (err) {
        console.log(err);
        data = { suc: 0, msg: JSON.stringify(err) };
        resolve(data);
      } else {
        db.query(fetchQuery, selWhereArr, (err, results) => {
          if (err) {
            console.log(err);
            data = { suc: 0, msg: JSON.stringify(err) };
          } else {
            data = { suc: 1, msg: results };
          }
          resolve(data);
        })
      }
    });
    
  
    // Get a connection from the pool
    // db.getConnection((err, connection) => {
    //   if (err) {
    //     console.error('Error getting database connection:', err);
    //     data = { suc: 0, msg: 'Error getting database connection:' };
    //     resolve(data)
    //     return;
    //   }
  
    //   // Start a transaction
    //   connection.beginTransaction((err) => {
    //     if (err) {
    //       console.error('Error starting transaction:', err);
    //       connection.release();
    //       data = { suc: 0, msg: 'Error starting transaction:' };
    //       resolve(data)
    //       return;
    //     }
  
    //     // Call the stored procedure
    //     connection.query(procedureCall, dataArr, (err) => {
    //       if (err) {
    //         console.error('Error calling the procedure:', err);
    //         return connection.rollback(() => {
    //           connection.release();
    //           data = { suc: 0, msg: 'Error calling the procedure:' };
    //           resolve(data)
    //         });
    //       }

    //       console.log('Procedure called successfully:', '++++++++++++++++++++++++++');
  
    //       // Fetch data from the temporary table
    //       connection.query(fetchQuery, selWhereArr, (err, results) => {
    //         if (err) {
    //           console.error('Error fetching data from temporary table:', err);
    //           return connection.rollback(() => {
    //             connection.release();
    //             data = { suc: 0, msg: 'Error fetching data from temporary table:' };
    //             resolve(data)
    //           });
    //         }
  
    //         data = { suc: 1, msg: results };
    //         console.log('Data fetched from temporary table:');
  
    //         // Commit the transaction
    //         connection.commit((err) => {
    //           if (err) {
    //             console.error('Error committing transaction:', err);
    //             return connection.rollback(() => {
    //               connection.release();
    //               data = { suc: 0, msg: 'Error committing transaction:' };
    //               resolve(data)
    //             });
    //           }
  
    //           connection.release();
    //           resolve(data);
    //         });
    //       });
    //     });
    //   });
    // });
  });
};

module.exports = { db_Select, db_Insert, db_Delete, db_Check, db_RunProcedureAndFetchData };