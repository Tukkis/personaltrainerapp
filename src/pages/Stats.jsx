import { useState, useEffect } from "react";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Label } from "recharts";

export default function Stats() {

    const [trainingData, setTrainingData] = useState([])

    const getTrainings = () => {
        fetch("https://traineeapp.azurewebsites.net/gettrainings")
            .then(response => response.json())
            .then(data => {
            const processedData = []
            console.log(data)
            data.map(training => {
                let found = false
                for (let i = 0; i < processedData.length; i++){
                    if(processedData[i].activity == training.activity){
                        processedData[i].duration += Number(training.duration)
                        found = true
                    }
                }
                !found ? processedData.push({activity:training.activity, duration: Number(training.duration)}) : ''
            })
            setTrainingData(processedData)
        })
        .catch(error => {
            console.error("Error fetching trainings:", error);
        });
    }

    useEffect(()=>{
        getTrainings()
    },[])

    return(
        <div style={{ display:"flex", height: '80vh'}}>
            <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={trainingData} >
                    <XAxis dataKey="activity">
                    </XAxis>
                    <YAxis>
                        <Label value="duration (min)" position="insideLeft" angle={270} fill='rgba(0, 0, 0, 0.87)' />
                    </YAxis>
                    <Bar dataKey="duration"  fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}