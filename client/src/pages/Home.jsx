import React, { useState, useEffect } from "react";
import { Card, List, Avatar, Row, Col } from "antd";
import axios from "axios";

const Home = () => {
  const [companyCount, setCompanyCount] = useState(0);
  const [latestCompanies, setLatestCompanies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/company")
      .then((res) => {
        if (res.status === 200) {
          const sortedCompanies = [...res.data.companies].sort((a, b) => new Date(b.date) - new Date(a.date));
          setCompanyCount(sortedCompanies.length);
          setLatestCompanies(sortedCompanies.slice(0, 3));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch companies:", err);
      });
  }, []);

  return (
    <div>
      <Row>
        <Col span={6} style={{ padding: "10px" }}>
          <Card>
            <h2>Companies in the system</h2>
            <h1 style={{ display: "flex", justifyContent: "center", fontSize: "60px" }}>{companyCount}</h1>
          </Card>
        </Col>
        <Col span={18} style={{ padding: "10px" }}>
          <Card>
            <h2>Lastly added companies</h2>
            <div style={{ padding: "20px" }}>
              <List
                itemLayout="horizontal"
                dataSource={latestCompanies}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                      title={<h2>{item.name}</h2>}
                      description={
                        <div>
                          <a href={item.website}>{item.website}</a>
                          <p>Added on : {new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      }
                    />
                    <img
                      width={200}
                      alt="logo"
                      src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
