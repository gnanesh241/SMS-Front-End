import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft } from "@tabler/icons-react";
import axios from 'axios';

import DashboardCard from "@/app/DashboardLayout/components/shared/DashboardCard";
import { useEffect, useState } from "react";

const TrafficDistribution = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const error = theme.palette.error.main;
  const secondary = theme.palette.secondary.light;
  const successlight = theme.palette.success.light;

  // State to hold overall attendance
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceResponse = await axios.get('https://sms-1-a8o4.onrender.com/getAttendance');
        // Calculate total attendance
        const totalAttendance = attendanceResponse.data.reduce((total, record) => {
          return total + (record.status === 'Present' ? 1 : 0);
        }, 0);
        setOverallAttendance(totalAttendance);

        const studentsResponse = await axios.get('http://localhost:8080/getStudents');
        setTotalStudents(studentsResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // chart options and series
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 170,
    },
    colors: [secondary, error, primary],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart: any = [overallAttendance, totalStudents - overallAttendance];

  return (
    <DashboardCard title="Overall Attendance">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={6} sm={7}>
          <Typography variant="h3" fontWeight="700">
            {overallAttendance}
          </Typography>
          {/* your content... */}
        </Grid>
        {/* column */}
        <Grid item xs={6} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            width={"100%"}
            height="150px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default TrafficDistribution;
