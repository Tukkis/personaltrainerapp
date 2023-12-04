import { useState, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Button, Snackbar } from "@mui/material";
import CustomCellRenderer from '../components/CustomCellRenderer';
import AddCustomer from '../components/AddCustomer'
import AddTraining from '../components/AddTraining'
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CSVLink } from "react-csv";

export default function CustomerList() {

  const gridRef = useRef();
  const [customers, setCustomers] = useState([])
  const [msg, setMsg] = useState("");
	const [open, setOpen] = useState(false);
  const [csvData,setCsvData] = useState([])

   // customer link for adding a new training
  let customerTrainingLink = '';

  const getCustomers = () => {
    fetch("https://traineeapp.azurewebsites.net/api/customers")
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCustomers(data.content);
        // map data and omit objects
        const csv = data.content.map(customer => {
          const customerCopy = {...customer}
          // remove all objects from customers key value pairs
          Object.entries(customerCopy).map(([key,value]) => {
            typeof value === 'object' ?  delete customerCopy[key] : ''
          })
          return customerCopy
          
        })
        setCsvData(csv)
      })
      .catch(error => {
        console.error("Error fetching trainings:", error);
      });
  }

  useEffect(()=>{
    getCustomers()
  },[])
  
  const deleteCustomer = (customer) => {
    console.log(customer.data.links[0].href)
    if (window.confirm("Are you sure?")) {
      fetch(customer.data.links[0].href, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            getCustomers();
              setMsg(customer.data.firstname+ " "+ customer.data.lastname + " has been deleted successfully!");
            setOpen(true);  
          } else {
            alert("Error:" + res.status)
          }
        })
      .catch(err => console.log(err));
    }
  }

  const saveCustomer = (customer) => {
    fetch("https://traineeapp.azurewebsites.net/api/customers", {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(customer)
    })
      .then(res => {
        if (res.ok) {
          getCustomers();
        } else {
          alert("Error:" + res.status)
        }
      })
    .catch(err => console.error(err));
  }

  const saveTraining = (training) => {
    fetch('https://traineeapp.azurewebsites.net/api/trainings', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({...training, customer:customerTrainingLink})
    })
    .then(res => {
      if (res.ok) {
        getCustomers();
      } else {
        alert("Error:" + res.status)
      }
    })
    .catch(err => console.error(err));
  }

  const updateCustomer = (customer,link) => {
    console.log("update")
    if (window.confirm("Are you sure?")) {
      fetch(link, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(customer)
      })
      .then(res => {
        if (res.ok) {
          getCustomers();
          setMsg("Customer has been edited successfully!");
          setOpen(true);
        } else {
          alert("Error!" + res.status);
        }
      })
      .catch(err => console.error(err));
    }
  }

  let updateButtonClicked = false;

  const actionCellRenderer = (params) => {

    let editingCells = params.api.getEditingCells();
    // checks if the rowIndex matches in at least one of the editing cells
    let isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex;
    });

    if (isCurrentRowEditing) {
      return <div>
          <Button  
            className="action-button update"
            data-action="update">
                update  
          </Button>
          <Button  
            className="action-button cancel"
            data-action="cancel">
                cancel
          </Button>
          <AddTraining saveTraining={saveTraining} dataaction={"add"} />
          </div>
    } else {
      return <div>
          <Button 
            className="action-button edit"  
            data-action="edit">
              edit 
          </Button>
          <Button 
            className="action-button delete"
            data-action="delete">
              delete
          </Button>
          <AddTraining saveTraining={saveTraining} dataaction={"add"} />
          </div>
    }
  }

  const columns = [
    {
      headerName: "Action",
      minWidth: 310,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: "action",
      autoHeight: true
    },
    { headerName: 'First name', field: 'firstname', cellRenderer: 'customCellRenderer' },
    { headerName: 'Last name', field: 'lastname', cellRenderer: 'customCellRenderer' },
    { headerName: 'Email', field: 'email', cellRenderer: 'customCellRenderer' },
    { headerName: 'Phone', field: 'phone', cellRenderer: 'customCellRenderer' },
    { headerName: 'Address', field: 'streetaddress', cellRenderer: 'customCellRenderer' },
    { headerName: 'Postcode', field: 'postcode', cellRenderer: 'customCellRenderer' },
    { headerName: 'City', field: 'city', cellRenderer: 'customCellRenderer' }
  ]

  const defaultColDef = useMemo(() => {
		return {
      editable: true
		};
	}, []);

  const onCellClicked = (params) => {
    // Handle click event for action cells
    if (
      params.column.colId === 'action' &&
      params.event.target.dataset.action
    ) {
      let action = params.event.target.dataset.action;

      if (action === 'edit') {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.api.getDisplayedCenterColumns()[0].colId,
        });
      }

      if (action === 'delete') {
        deleteCustomer(params.node)
      }

      if (action === 'update') {
        updateButtonClicked = true;
        params.api.stopEditing(false);
      }

      if (action === 'cancel') {
        params.api.stopEditing(true);
      }

      if (action === 'add') {
        //get link
        console.log(params.node.data.links[0].href)
        customerTrainingLink = params.node.data.links[0].href;
      }
    }
  }

  const onRowEditingStarted = (params) => {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  const onRowEditingStopped = (params) => {
    // Check the flag to determine whether editing was canceled or confirmed
    if (updateButtonClicked) {
        updateCustomer(params.node.data,params.node.data.links[0].href)
     } 

    // Reset the flag for the next edit
    updateButtonClicked = false;

    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
  

  return (
    <div style={{width:"100%"}}>
      <div>CustomerList</div>
      <div style={{ width: "100%"}} className="ag-theme-material">
        <AgGridReact
          ref={gridRef}
          rowData={customers}
          columnDefs={columns}
          domLayout= 'autoHeight'
          defaultColDef={defaultColDef}
          onRowEditingStopped={onRowEditingStopped}
          onRowEditingStarted={onRowEditingStarted}
          onCellClicked={onCellClicked}
          //fill the contained horizontally
          onGridSizeChanged= {(gridOptions  ) => {gridOptions.api.sizeColumnsToFit()}}   
          editType="fullRow"
          suppressClickEdit={true}
          //minimizes bundle size
          modules={[ClientSideRowModelModule]}
          pagination={true}
          paginationPageSize={10}
          components={{
            //aligns ag-grid cell content to the start of the cell
            customCellRenderer: CustomCellRenderer
          }}
        />
      </div>
      <AddCustomer saveCustomer={saveCustomer} />
      <CSVLink data={csvData}>Download me</CSVLink>
      <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message={msg}
      /> 
    </div>
  );
}
  