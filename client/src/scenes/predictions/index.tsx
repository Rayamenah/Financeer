import FlexBetween from "@/components/FlexBetween"
import DashboardBox from "@/components/dasboardBox"
import { useGetKpisQuery } from "@/state/api"
import { Box, Button, Typography, useTheme } from "@mui/material"
import { useMemo, useState } from "react"
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import regression, { DataPoint } from "regression"

const Predictions = () => {
    const { palette } = useTheme()
    const [isPrediction, setIsPrediction] = useState(false)
    const { data: kpiData } = useGetKpisQuery()

    const formattedData = useMemo(() => {
        if (!kpiData) return [0]
        const monthData = kpiData[0].monthlyData

        const formatted: Array<DataPoint> = monthData.map(({ revenue }, i: number) => {
            return [i, revenue]
        })
        const regressionLine = regression.linear(formatted)

        return monthData.map(({ month, revenue }, i: number) => {
            return {
                name: month,
                "Actual revenue": revenue,
                "Regression Line": regressionLine.points[i][1],
                "Predicted Revenue": regressionLine.predict(i + 12)[1]
            }
        })
    }, [kpiData])

    return (
        <DashboardBox width='100' height='100%' p='1rem' overflow='hidden'>
            <FlexBetween m='1rem 2rem' gap='1rem'>
                <Box>
                    <Typography variant='h3'>Revenue and Predictions</Typography>
                    <Typography variant='h6'>Charted revenue and predicted revenue on a simple linear regression model</Typography>
                </Box>
                <Button
                    onClick={() => setIsPrediction(!isPrediction)}
                    sx={{
                        color: palette.grey[900],
                        bgcolor: palette.grey[700],
                        boxShadow: '0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4'
                    }}
                >
                    Show predicted revenue for next year
                </Button>
            </FlexBetween>
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                    width={500}
                    height={400}
                    data={formattedData}
                    margin={{
                        top: 20,
                        right: 75,
                        left: 20,
                        bottom: 80,
                    }}
                >

                    <CartesianGrid strokeDasharray='3 3' stroke={palette.grey[800]} />
                    <XAxis
                        dataKey='name'
                        tickLine={false}
                        style={{ fontSize: "10px" }}
                    >
                        <Label value='Month' offset={-5} position='insideBottom' />
                    </XAxis>
                    <YAxis
                        domain={[12000, 26000]}
                        tickLine={false}
                        axisLine={{ strokeWidth: '0' }}
                        style={{ fontSize: '10px' }}
                        tickFormatter={(v) => `$${v}`}
                    >
                        <Label value='Revenue in USD' angle={-90} position='insideLeft' offset={-5} />
                    </YAxis>

                    <Tooltip />
                    <Legend
                        verticalAlign='top'
                    />
                    <Line
                        type='monotone'
                        dataKey='Actual Revenue'
                        stroke={palette.primary.main}
                        strokeWidth={0}
                        dot={{ strokeWidth: 5 }}
                    />

                    <Line
                        type='monotone'
                        dataKey='Regression Line'
                        stroke='#8884db'
                        dot={false}
                    />
                    {isPrediction && (
                        <Line
                            strokeDasharray='5 5'
                            dataKey='Predicted Revenue'
                            stroke={palette.secondary[500]}
                            dot={false}
                        />)}
                </LineChart>
            </ResponsiveContainer>
        </DashboardBox >
    )
}
export default Predictions