import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Document, Page, Text, View, PDFDownloadLink, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 10 },
});

const GenerateReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "donations"));
      setData(snapshot.docs.map(doc => doc.data()));
    };

    fetchData();
  }, []);

  const ReportDocument = (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Donations Report</Text>
        {data.map((donation, index) => (
          <View key={index} style={styles.section}>
            <Text>Donor: {donation.donorId}</Text>
            <Text>Food Type: {donation.foodType}</Text>
            <Text>Quantity: {donation.quantity}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div>
      <h2>Download Donations Report</h2>
      <PDFDownloadLink document={ReportDocument} fileName="donations_report.pdf">
        {({ loading }) => (loading ? "Generating..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
};

export default GenerateReport;
