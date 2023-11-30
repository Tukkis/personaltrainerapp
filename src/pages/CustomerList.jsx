import { useState, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Button, Snackbar } from "@mui/material";
import CustomCellRenderer from '../components/CustomCellRenderer';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

export default function CustomerList() {

  const gridRef = useRef();
  const [customers, setCustomers] = useState([])
  const [msg, setMsg] = useState("");
	const [open, setOpen] = useState(false);
  const [actionButtons, setActionButtons] = useState()

  const getCustomers = () => {
    fetch("https://traineeapp.azurewebsites.net/api/customers")
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCustomers(data.content);
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

  const saveCustomer = (training) => {
      fetch("https://traineeapp.azurewebsites.net/api/customers", {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(training)
  })
    .then(res => {
      if (res.ok) {
        getTrainings();
      } else {
        alert("Error:" + res.status)
      }
    })
  .catch(err => console.error(err));
  }

  const updateCustomer = (training, link) => {
  if(window.confirm("Are you sure?")){
    fetch(link, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(training)
    })
    .then(res => {
      if (res.ok) {
        getCustomers();
        setMsg(" has been edited successfully!");
        setOpen(true);
      } else {
        alert("Error!" + res.status)
      }
    })
    .catch(err => console.error(err))
    }
  }

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
          </div>
    }
  }

  const columns = [
    {
      headerName: "Action",
      minWidth: 150,
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
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
        });
      }

      if (action === 'delete') {
        deleteCustomer(params.node)
      }

      if (action === 'update') {
        params.api.stopEditing(false);
      }

      if (action === 'cancel') {
        params.api.stopEditing(true);
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
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  return (
    <div>
      <div>TrainingList</div>
      <div style={{ width: 1400, margin: "auto"}} className="ag-theme-material">
        <AgGridReact
          ref={gridRef}
          rowData={customers}
          columnDefs={columns}
          domLayout= 'autoHeight'
          defaultColDef={defaultColDef}
          onRowEditingStopped={onRowEditingStopped}
          onRowEditingStarted={onRowEditingStarted}
          onCellClicked={onCellClicked}
          editType="fullRow"
          suppressClickEdit={true}
          //minimizes bundle size
          modules={[ClientSideRowModelModule]}
          pagination={true}
          components={{
            customCellRenderer: CustomCellRenderer
          }}
        />
      </div>
      <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message={msg}
      /> 
    </div>
  );
}
  