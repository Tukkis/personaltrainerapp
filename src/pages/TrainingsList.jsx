import { useState, useEffect, useMemo, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Button, Snackbar } from "@mui/material";
import CustomCellRenderer from '../components/CustomCellRenderer';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";


export default function TrainingList() {

  const gridRef = useRef();
  const [trainings, setTrainings] = useState([])
  const [msg, setMsg] = useState("");
	const [open, setOpen] = useState(false);

  const getTrainings = () => {
    fetch("https://traineeapp.azurewebsites.net/gettrainings")
      .then(response => response.json())
      .then(data => {
        const processedData = data.map(training => {
          const customerName = training.customer ? `${training.customer.firstname} ${training.customer.lastname}` : '';
          return {
            ...training,
            fullname: customerName,
          };
        });
        console.log(processedData)
        setTrainings(processedData);
      })
      .catch(error => {
        console.error("Error fetching trainings:", error);
      });
  }

  useEffect(()=>{
    getTrainings()
  },[])
  
  const deleteTraining = (training) => {
    if (window.confirm("Are you sure?")) {
      fetch("https://traineeapp.azurewebsites.net/api/trainings/"+training.data.id, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            getTrainings();
              setMsg(training.data.activity + " has been deleted successfully!");
            setOpen(true);  
          } else {
            alert("Error:" + res.status)
          }
        })
      .catch(err => console.log(err));
    }
  }

  const saveTraining = (training) => {
      fetch("https://traineeapp.azurewebsites.net/api/trainings", {
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

  const columns = [
    {
      headerName: "Action",
      minWidth: 150,
      cellRenderer: row => <Button onClick={() => deleteTraining(row)}>Delete</Button>,
      editable: false,
      colId: "action",
      autoHeight: true
    },
    { headerName: 'Activity', field: 'activity', cellRenderer: 'customCellRenderer' },
    { headerName: 'Date', field: 'date', cellRenderer: 'customCellRenderer' },
    { headerName: 'Duration', field: 'duration', cellRenderer: 'customCellRenderer' },
    { headerName: 'Customer', field: 'fullname', cellRenderer: 'customCellRenderer' }
  ]

  return (
    <div>
      <div>TrainingList</div>
      <div style={{ width: "100%", margin: "auto"}} className="ag-theme-material">
        <AgGridReact
          ref={gridRef}
          style={{ width: '100%', height: '100%' }}
          rowData={trainings}
          columnDefs={columns}
          domLayout= 'autoHeight'
          editType="none"
          //minimises bundle size
          modules={[ClientSideRowModelModule]}
          pagination={true}
          //fill the contained horizontally
          onGridSizeChanged= {(gridOptions  ) => {gridOptions.api.sizeColumnsToFit()}}   
          components={{
            //aligns ag-grid cell content to the start of the cell
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