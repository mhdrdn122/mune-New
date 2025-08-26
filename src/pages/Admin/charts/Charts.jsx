/**
 * Charts.jsx
 * 
 * This component is part of the admin interface and is responsible for:
 * - Fetching and displaying employee performance data over time.
 * - Applying filters (date range + employee type) to chart data.
 * - Rendering the response time as a line chart using `recharts`.
 * - Allowing dynamic filtering and tooltip breakdowns.
 */

import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../utils/Breadcrumb';
import { Col, Row, Spinner } from 'react-bootstrap';
import Header from '../../../utils/Header';
import { baseURLLocalPublic } from '../../../Api/baseURLLocal';
import { Button, FormControl, InputLabel, MenuItem, Select, Grid } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import DateFilter from '../../../utils/DateFilter';
import { ToastContainer } from 'react-toastify';
import notify from '../../../utils/useNotification';

// Breadcrumb navigation definition
const breadcrumbs = [
  { label: " تفاصيل الموظفين" },
  { label: " الرئيسية", to: "/admin" },
];

// Main component to visualize employee statistics
const Charts = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  // Local states
  const [data, setData] = useState([]); // Raw API data
  const [chartData, setChartData] = useState([]); // Processed chart data
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  /**
   * Fetches all employee types to populate the filter dropdown.
   */
  const getTypesEmp = async () => {
    try {
      const response = await fetch(`${baseURLLocalPublic}/admin_api/types`, {
        headers: { Authorization: `Bearer ${adminInfo.token}` }
      });
      const result = await response.json();
      if (result.status) setEmployeeTypes(result.data);
    } catch (error) {
      console.error('Error fetching employee types:', error);
    }
  };

  /**
   * Converts an object into a URL search string.
   * Only includes keys with truthy values.
   */
  const buildQueryParams = (params) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val) q.append(key, val);
    });
    return q.toString();
  };

  /**
   * Fetches the employee chart data from API based on filters.
   */
  const getInf = async (startDate = null, endDate = null, type = '') => {
    try {
      setLoading(true);
      const query = buildQueryParams({ startDate, endDate, type_id: type });
      const response = await fetch(`${baseURLLocalPublic}/admin_api/show_employee_details?${query}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminInfo.token}`
        }
      });
      const result = await response.json();
      if (result.status) {
        setData(result.data);
        setChartData(processChartData(result.data));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    getInf();
    getTypesEmp();
  }, []);

  /**
   * Applies selected filters and re-fetches data.
   * Includes validations for date fields.
   */
  const applyFilters = () => {
    const today = new Date().toISOString().split('T')[0];

    if (!startDate && !endDate && !selectedType) {
      return getInf();
    }

    if ((startDate && !endDate) || (!startDate && endDate)) {
      return notify('Both Start Date and End Date are required.', 'warn');
    }

    if (new Date(startDate) > new Date(endDate)) {
      return notify('Start Date must be smaller than or equal to End Date.', 'warn');
    }

    if (new Date(endDate) > new Date(today)) {
      return notify("End Date cannot be greater than today's date.", 'warn');
    }

    getInf(startDate, endDate, selectedType);
  };

  /**
   * Converts HH:MM:SS format time to minutes (as float).
   */
  const convertTimeToMinutes = (time) => {
    const [h, m, s] = time.split(":").map(Number);
    return h * 60 + m + s / 60;
  };

  /**
   * Converts raw employee data into chart format.
   * Groups data by date and maps employee response times accordingly.
   */
  const processChartData = (data) => {
    if (!data?.length) return [];

    const dates = [...new Set(data.flatMap(emp => emp.response_times.map(res => res.date)))];
    
    return dates.map(date => {
      const row = { date };
      data.forEach(emp => {
        const res = emp.response_times.find(r => r.date === date);
        row[emp.name] = res ? convertTimeToMinutes(res.average_response_time) : 0;
        row[`number_${emp.name}`] = res?.number ?? 0;
      });
      return row;
    });
  };

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />

      <Row className="d-flex justify-content-between" style={{ flexDirection: "row-reverse" }}>
        <Col><Header heading="الرسم البياني للموظفين" /></Col>
      </Row>

      {/* Filter Controls */}
      <div className="d-flex justify-content-center align-items-start gap-3 row mb-3">
        <Grid className='col' item xs={12} sm={4} md={3}>
          <DateFilter value={startDate} setValue={setStartDate} name="startDate" label="Start Date" />
        </Grid>
        <Grid className='col' item xs={12} sm={4} md={3}>
          <DateFilter value={endDate} setValue={setEndDate} name="endDate" label="End Date" />
        </Grid>
        <Grid className='col' item xs={12} sm={4} md={3}>
          <FormControl fullWidth>
            <InputLabel id="employee-type-label" shrink>Employee Type</InputLabel>
            <Select
              labelId="employee-type-label"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              displayEmpty
              label="Employee Type"
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {employeeTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid className='col'>
          <Button
            variant="outlined"
            onClick={applyFilters}
            style={{
              backgroundColor: '#1F2A40',
              color: 'white',
              height: '50px',
              width: '50%',
              padding: '10px 0'
            }}
          >
            {loading ? <Spinner /> : 'Apply Filters'}
          </Button>
        </Grid>
      </div>

      {/* Chart Area */}
      <Row>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {data.map((emp, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={emp.name}
                activeDot={{ r: 8 }}
                stroke={`hsl(${index * 60}, 70%, 50%)`} // Color generation per employee
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Row>

      <ToastContainer />
    </div>
  );
};

/**
 * Custom Tooltip component for showing detailed data on hover.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ccc" }}>
      <p>{`Date: ${label}`}</p>
      {payload.map((item, index) => (
        <p key={index}>
          {`${item.dataKey}: ${item.payload[`number_${item.dataKey}`] || "0"} responses`}
        </p>
      ))}
    </div>
  );
};

export default Charts;
