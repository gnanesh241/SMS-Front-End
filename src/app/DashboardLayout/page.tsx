"use client"
import React, { useState, useEffect } from 'react';
import { Grid, Box, CircularProgress } from '@mui/material';
import PageContainer from '@/app/DashboardLayout/components/container/PageContainer';
import ProfitExpenses from '@/app/DashboardLayout/components/dashboard/ProfitExpenses';
import TrafficDistribution from '@/app/DashboardLayout/components/dashboard/TrafficDistribution';
import UpcomingSchedules from '@/app/DashboardLayout/components/dashboard/UpcomingSchedules';
import TopPayingClients from '@/app/DashboardLayout/components/dashboard/TopPayingClients';
import Blog from '@/app/DashboardLayout/components/dashboard/Blog';
import ProductSales from '@/app/DashboardLayout/components/dashboard/ProductSales';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Simulate data loading delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust delay as needed
    return () => clearTimeout(timeout);
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <ProfitExpenses />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TrafficDistribution />
                </Grid>
                <Grid item xs={12}>
                  <ProductSales />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </PageContainer>
  );
};

export default Dashboard;
