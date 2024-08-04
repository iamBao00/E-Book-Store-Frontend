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
  const [selectedMonth, setSelectedMonth] = useState(
    moment().startOf("month").utc()
  );

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
      setOrders(data);
      setFilteredOrders(data);
      calculateTotalRevenue(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const calculateTotalRevenue = (orders) => {
    const total = orders.reduce((sum, order) => sum + order.amount, 0);
    setTotalRevenue(total);
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) {
      setFilteredOrders(orders);
      calculateTotalRevenue(orders);
      return;
    }

    const [start, end] = dates;
    const filtered = orders.filter((order) => {
      const orderDate = moment.utc(order.createdAt);
      return orderDate.isBetween(start, end, null, "[]");
    });

    setFilteredOrders(filtered);
    calculateTotalRevenue(filtered);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(
      date
        ? date.clone().startOf("month").utc()
        : moment().startOf("month").utc()
    );
  };

  const generateChartData = () => {
    const daysInMonth = selectedMonth.daysInMonth();
    const chartData = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = selectedMonth.clone().date(i).startOf("day").utc(); // Ensure date is in UTC

      const dailyOrders = orders.filter((order) => {
        const orderDate = moment.utc(order.createdAt).startOf("day");
        return orderDate.isSame(date, "day");
      });

      const dailyRevenue = dailyOrders.reduce(
        (sum, order) => sum + order.amount,
        0
      );

      chartData.push({
        date: date.format("YYYY-MM-DD"),
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
      render: (createdAt) => moment.utc(createdAt).format("YYYY-MM-DD"),
    },
    {
      title: "Date Completed",
      dataIndex: "updatedAt",
      key: "dateCompleted",
      render: (updatedAt) => moment.utc(updatedAt).format("YYYY-MM-DD"),
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
