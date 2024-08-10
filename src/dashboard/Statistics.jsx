import React, { useState, useEffect } from "react";
import { Table, DatePicker, Card, Statistic, Row, Col } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";

const { RangePicker, MonthPicker } = DatePicker;

const Statistics = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(moment().startOf("month"));
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/order/get-orders?status=Delivered",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();
      // Convert createdAt to string format for consistent comparison
      const ordersWithStringDates = data.map((order) => ({
        ...order,
        createdAt: moment.utc(order.createdAt).format("YYYY-MM-DD"),
        updatedAt: moment.utc(order.updatedAt).format("YYYY-MM-DD"),
      }));

      setOrders(ordersWithStringDates);
      updateFilteredOrders(ordersWithStringDates, selectedDateRange);
      calculateTotalRevenue(ordersWithStringDates, selectedDateRange);
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateFilteredOrders = (orders, dateRange) => {
    if (!dateRange[0] || !dateRange[1]) {
      setFilteredOrders(orders);
    } else {
      const [start, end] = dateRange.map((date) =>
        moment.utc(date).format("YYYY-MM-DD")
      );
      const filtered = orders.filter((order) => {
        const orderDate = order.createdAt;
        return orderDate >= start && orderDate <= end;
      });

      setFilteredOrders(filtered);
    }
  };

  const calculateTotalRevenue = (orders, dateRange) => {
    let filteredOrders = orders;

    if (dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange.map((date) =>
        moment.utc(date).format("YYYY-MM-DD")
      );
      filteredOrders = orders.filter((order) => {
        const orderDate = order.createdAt;
        return orderDate >= start && orderDate <= end;
      });
    }

    const total = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
    setTotalRevenue(total);
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setSelectedDateRange([null, null]);
      updateFilteredOrders(orders, [null, null]);
      calculateTotalRevenue(orders, [null, null]);
      return;
    }

    const [start, end] = dates;
    const formattedDates = [
      start.format("YYYY-MM-DD"),
      end.format("YYYY-MM-DD"),
    ];

    setSelectedDateRange(formattedDates);
    updateFilteredOrders(orders, formattedDates);
    calculateTotalRevenue(orders, formattedDates);
  };

  const handleMonthChange = (date) => {
    if (date) {
      const startOfMonth = date.startOf("month").format("YYYY-MM-DD");
      const endOfMonth = date.endOf("month").format("YYYY-MM-DD");

      setSelectedMonth(date);
      setSelectedDateRange([startOfMonth, endOfMonth]); // Set date range for the chart
      updateFilteredOrders(orders, [startOfMonth, endOfMonth]); // Update data for table
      calculateTotalRevenue(orders, [startOfMonth, endOfMonth]); // Calculate revenue for date range
    } else {
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

      setSelectedMonth(moment().startOf("month"));
      setSelectedDateRange([startOfMonth, endOfMonth]); // Reset date range for the chart
      updateFilteredOrders(orders, [startOfMonth, endOfMonth]); // Show all data in table
      calculateTotalRevenue(orders, [startOfMonth, endOfMonth]); // Calculate total revenue for all data
    }
  };

  const generateChartData = () => {
    const startDate = selectedMonth
      .clone()
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = selectedMonth.clone().endOf("month").format("YYYY-MM-DD");
    const daysInRange = moment(endDate).diff(moment(startDate), "days") + 1;
    const chartData = [];

    for (let i = 0; i < daysInRange; i++) {
      const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");

      const dailyOrders = orders.filter((order) => order.createdAt === date);

      const dailyRevenue = dailyOrders.reduce(
        (sum, order) => sum + order.amount,
        0
      );

      chartData.push({
        date: date,
        orders: dailyOrders.length,
        revenue: dailyRevenue,
      });
    }

    return chartData;
  };

  const columns = [
    {
      title: "Username",
      dataIndex: ["user_id", "username"],
      key: "username",
    },
    {
      title: "Num of Books",
      dataIndex: "orderDetails",
      key: "numOfBooks",
      render: (orderDetails) => orderDetails.length,
    },
    {
      title: "Total Money",
      dataIndex: "amount",
      key: "totalMoney",
    },
    {
      title: "Date Ordered",
      dataIndex: "createdAt",
      key: "dateOrdered",
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD"),
    },
    {
      title: "Date Completed",
      dataIndex: "updatedAt",
      key: "dateCompleted",
      render: (updatedAt) => moment(updatedAt).format("YYYY-MM-DD"),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={16}>
          <RangePicker onChange={handleDateChange} />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <MonthPicker
            onChange={handleMonthChange}
            placeholder="Select month"
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={generateChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="orders" stroke="#8884d8" />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="_id"
        pagination={{ position: ["bottomCenter"] }}
      />
    </div>
  );
};

export default Statistics;
