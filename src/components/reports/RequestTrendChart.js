import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const RequestTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="created" name="Created" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="closed" name="Closed" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RequestTrendChart
