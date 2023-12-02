import { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, TextField  } from "@mui/material";

export default function AddCustomer({saveCustomer}) {
  
    const [customer, setCustomer] = useState({firstname: '', lastname: '', email: '', phone: '', streetaddress: '', postcode: '', city: ''})
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
		setCustomer({...customer, [event.target.name]: event.target.value })
    }

	const handleSave = () => {
		saveCustomer(customer);
		setShowDialog(false);
	}
  
    return (
    <>
     <Button style={{margin: "5px"}} variant="outlined" onClick={handleShowDialog}>New Customer</Button>
            <Dialog
            open={showDialog}
            onClose={handleCloseDialog}
            >
                <DialogTitle>New Customer</DialogTitle>
                <DialogContent>
                    <TextField 
                    label="First name"
					name="firstname"
                    value={customer.firstname}
                    onChange={handleInputChange}
                    />
					<TextField 
                    label="Last name"
					name="lastname"
                    value={customer.lastname}
                    onChange={handleInputChange}
                    />
                    <TextField 
                    label="Email"
					name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    />
                    <TextField 
                    label="Phone"
					name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    />
                    <TextField 
                    label="Street address"
					name="streetaddress"
                    value={customer.streetaddress}
                    onChange={handleInputChange}
                    />
                    <TextField 
                    label="Postcode"
					name="postcode"
                    value={customer.postcode}
                    onChange={handleInputChange}
                    />
                    <TextField 
                    label="City"
					name="city"
                    value={customer.city}
                    onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
					<Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
    </>
  );
}