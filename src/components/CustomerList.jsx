import {Button} from '@mui/material';

export default function CustomerList({setMode}) {
    return (
      <div>
        <Button onClick={() => setMode("Trainings")}>Trainings</Button>
      </div>
    );
  }