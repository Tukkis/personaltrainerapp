import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField  } from "@mui/material";

export default function AddTraining({saveTraining,dataaction}) {
  
    const [trainingDate, setTrainingDate] = useState(new Date());
    const [training, setTraining] = useState({activity: '', duration: ''})
    const [showDialog, setShowDialog] = useState(false)

    const handleCloseDialog = (event, reason) => {
        if(reason != 'backdropClick'){
            setShowDialog(false);
        }
    }

    const handleShowDialog = () => {
        setShowDialog(true);
    }

    const handleInputChange = (event) => {
		setTraining({...training, [event.target.name]: event.target.value })
    }

	const handleSave = () => {
		saveTraining({...training, date: trainingDate.toISOString()});
		setShowDialog(false);
	}
  
    return (
    <>
     <Button data-action={dataaction} style={{margin: "5px"}} variant="outlined" onClick={handleShowDialog}>New Training</Button>
            <Dialog
            PaperProps={{
                sx: {
                  minHeight: 500
                }
            }}
            open={showDialog}
            onClose={handleCloseDialog}
            >
                <DialogTitle>New Training</DialogTitle>
                <DialogContent>
					<TextField 
                    label="Activity"
					name="activity"
                    value={training.activity}
                    onChange={handleInputChange}
                    />
                    <TextField 
                    label="Duration"
					name="duration"
                    value={training.duration}
                    onChange={handleInputChange}
                    />
                    <DatePicker showTimeSelect timeFormat="HH:mm" dateFormat="Pp" selected={trainingDate} onChange={(date) => setTrainingDate(date)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
					<Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
    </>
  );
}