
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { ProductService } from '../service/ProductService';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
// import './DataTableDemo.css';

const TestPage = () => {
    // const [products, setProducts] = useState([]);
    const [expandedRows, setExpandedRows] = useState(null);
    const toast = useRef(null);
    const isMounted = useRef(false);
	const [rowClick, setRowClick] = useState(true);
    // const productService = new ProductService();
	const [selectedProducts, setSelectedProducts] = useState(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [useData, setSetData] = useState([{
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 1202364549,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 1,
	  }, 
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 12023649,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 2,
	  },
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 1202374649,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 3,
	  },
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 120236498,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 11,
	  }, 
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 120236494,
		"tot_emi": "5300.00",
		"created_code": "1022886",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 22,
	  },
	  {
		"transaction_date": "2024-12-03T18:30:00.000Z",
		"credit_amt": 5300,
		"group_code": 120236497,
		"tot_emi": "5300.00",
		"created_code": "10228",
		"group_name": "MONDAY",
		"created_by": "BABAI DAS",
		"outstanding": 98050,
		"id": 33,
	  }])

    useEffect(() => {
        // if (isMounted.current) {
        //     const summary = expandedRows !== null ? 'All Rows Expanded' : 'All Rows Collapsed';
        //     toast.current.show({severity: 'success', summary: `${summary}`, life: 3000});
        // }
		// setProducts(useData)
    }, [expandedRows]);


    const onRowExpand = (event) => {
        // console.log(event.data, 'event.data');
        // toast.current.show({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
    }

    const onRowCollapse = (event) => {
        // toast.current.show({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
    }

    const expandAll = () => {
        // setExpandedRows(null);
        // let _expandedRows = {};
        // useData.forEach(p => _expandedRows[`${p.id}`] = true);
        // setExpandedRows(_expandedRows);
    }

    const collapseAll = () => {
        // setExpandedRows(null);
    }

    const allowExpansion = (rowData) => {
        console.log(rowData, 'rowData');
        
        return useData.length > 0;
    };

	const onPageChange = (event) => {
        setCurrentPage(event.first);
        setRowsPerPage(event.rows);
    };

    const handleRowToggle = (e) => {
        const rowData = e.data;
        // console.log(rowData.group_code, 'xxxxxxxxx', expandedRows.group_code);
        
        if (expandedRows && expandedRows.group_code === rowData.group_code) {
            // Collapse the currently expanded row if clicked again
            setExpandedRows(null);
        } else {
            // Expand the clicked row and close others
            console.log('ddddddddddddd', expandedRows);
            
            setExpandedRows(rowData);
        }
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Orders for </h5>
                <DataTable value={useData} responsiveLayout="scroll">
                    <Column field="group_name" header="Group Name" sortable></Column>
                    <Column field="created_code" header="created_code" sortable></Column>
                    <Column field="created_by" header="created_by" sortable></Column>
                    <Column field="outstanding" header="outstanding" sortable></Column>
                    <Column field="group_code" header="group_code" sortable></Column>
                    <Column headerStyle={{ width: '4rem'}}></Column>
                </DataTable>
            </div>
        );
    }

    const header = (
        <div className="table-header-container">
            <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2" />
            <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
        </div>
    );

    return (
        <div className="datatable-rowexpansion-demo" style={{marginTop: 150}}>
            <Toast ref={toast} />

            <div className="card">
			<DataTable
    value={useData}
    expandedRows={expandedRows}
    onRowToggle={(e) => handleRowToggle(e)}
    onRowExpand={onRowExpand}
    onRowCollapse={onRowCollapse}
    selectionMode="checkbox"
    selection={selectedProducts}
    onSelectionChange={(e) => setSelectedProducts(e.value)}
    tableStyle={{ minWidth: "50rem" }}
    rowExpansionTemplate={rowExpansionTemplate}
    dataKey="group_code"
    paginator
    rows={rowsPerPage}
    first={currentPage}
    onPage={onPageChange}
    header={header}
    rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
>
    <Column expander={allowExpansion} style={{ width: '3em' }} />
    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
    <Column field="group_name" header="Group Name" sortable></Column>
    <Column field="created_code" header="created_code" sortable></Column>
    <Column field="created_by" header="created_by" sortable></Column>
    <Column field="outstanding" header="outstanding"></Column>
    <Column field="group_code" header="group_code" sortable></Column>
    <Column headerStyle={{ width: '4rem' }}></Column>
</DataTable>
            </div>
        </div>
    );
}
  
export default TestPage