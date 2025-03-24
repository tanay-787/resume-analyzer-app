import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle } from "@progress/kendo-react-layout";
import { SvgIcon } from "@progress/kendo-react-common";
import { chartColumnRangeIcon, infoCircleIcon } from "@progress/kendo-svg-icons";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../config/firebaseConfig";
import { User } from "firebase/auth";

interface ApiUsageCardProps {
  user: User | null;
}

interface ApiUsageData {
  total: number;
  today: number;
  limit: number;
}

const ApiUsageCard: React.FC<ApiUsageCardProps> = ({ user }) => {
  const [apiUsage, setApiUsage] = useState<ApiUsageData>({ 
    total: 0, 
    today: 0, 
    limit: 15 
  });

  useEffect(() => {
    const fetchApiUsage = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Calculate today's usage
            const today = new Date().toISOString().split('T')[0];
            const todayUsage = userData.apiUsageDates?.[today] || 0;
            
            setApiUsage({
              total: userData.apiUsage || 0,
              today: todayUsage,
              limit: 15
            });
          }
        } catch (error) {
          console.error("Error fetching API usage:", error);
        }
      }
    };
    
    fetchApiUsage();
  }, [user]);

  if (!user) return null;

  return (
    <Card className="profile-card">
      <CardHeader className="profile-card-header">
        <SvgIcon icon={chartColumnRangeIcon} size="large" />
        <CardTitle>API Usage Statistics</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="section-description">
          Monitor your Gemini API usage to stay within the free tier limits.
        </p>
        
        <div className="usage-stats">
          <div className="usage-stat-item">
            <span className="stat-label">Today's Usage:</span>
            <div className="stat-value-container">
              <span className="stat-value">{apiUsage.today}</span>
              <span className="stat-max">/ {apiUsage.limit}</span>
            </div>
            <ProgressBar 
              value={apiUsage.today} 
              max={apiUsage.limit}
              labelVisible={false}
              className={`usage-progress ${apiUsage.today > 10 ? 'warning' : 'success'}`}
            />
          </div>
          
          <div className="usage-stat-item">
            <span className="stat-label">Total Analyses:</span>
            <span className="stat-value">{apiUsage.total}</span>
          </div>
          
          <div className="usage-info">
            <SvgIcon icon={infoCircleIcon} size="small" />
            <span>The Gemini API free tier resets daily at midnight Pacific Time.</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ApiUsageCard;