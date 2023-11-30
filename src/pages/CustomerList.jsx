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
  
  const deleteCustomer = (training) => {
    if (window.confirm("Are you sure?")) {
      fetch(training.data._links.training.href, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            getCustomers();
                        setMsg(" has been deleted successfully!");
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
    { headerName: 'Address', field: 'address', cellRenderer: 'customCellRenderer' },
    { headerName: 'Postcode', field: 'postcode', cellRenderer: 'customCellRenderer' },
    { headerName: 'City', field: 'city', cellRenderer: 'customCellRenderer' }
  ]

  const defaultColDef = useMemo(() => {
		return {
			flex: 1,
      editable: true,
			cellDataType: false,
		};
	}, []);

  
  function ActionButtons({ onEdit, onDelete, onUpdate, onCancel, isCurrentRowEditing}) {

    if(isCurrentRowEditing){
      return (
      <div>
        <Button className="action-button update" onClick={onUpdate} style={{height:'100%'}}>
          Update
        </Button>
        <Button className="action-button cancel" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      )
    } else {
      return(
      <div>
        <Button className="action-button edit" onClick={onEdit}>
          Edit
        </Button>
        <Button className="action-button delete" onClick={onDelete}>
          Delete
        </Button>
      </div>
      )
    }
  }
  
  function actionCellRenderer(params) {
    const { node, api } = params;
    const isCurrentRowEditing = api.getEditingCells().some((cell) => cell.rowIndex === node.rowIndex);
  
    const handleEdit = () => {
      api.startEditingCell({
        rowIndex: node.rowIndex,
        colKey: api.getDisplayedCenterColumns()[0].colId,
      });
    };
  
    const handleDelete = () => {
      api.applyTransaction({ remove: [node.data] });
    };
  
    const handleUpdate = () => {
      api.stopEditing(false);
    };
  
    const handleCancel = () => {
      api.stopEditing(true);
    };
  
    return <ActionButtons isCurrentRowEditing={isCurrentRowEditing} onEdit={handleEdit} onDelete={handleDelete} onUpdate={handleUpdate} onCancel={handleCancel} />;
  }

  const onCellClicked = (params) => {
    // Handle click event for action cells
    console.log(params.column.colId)
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
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

  const onCellDoubleClicked = (params) => {
    // Prevent double-click editing
    params.api.stopEditing();
  };

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
          onCellDoubleClicked={onCellDoubleClicked}
          editType="fullRow"
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
  