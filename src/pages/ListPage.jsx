import { useState } from "react";
import CustomerList from "../components/CustomerList";
import TrainingList from "../components/TrainingsList";

export default function ListPage() {

    const [mode, setMode] = useState("Customers")

    return (
      <div>
        {mode === "Customers" ? 
        <CustomerList setMode={setMode} />
        :
        <TrainingList setMode={setMode} />
        }
      </div>
    );
  }
  