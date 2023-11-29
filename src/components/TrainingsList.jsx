import {Button} from '@mui/material';

export default function TrainingList({setMode}) {
    return (
      <div>
        <Button onClick={() => setMode("Customers")}>Customers</Button>
      </div>
    );
  }