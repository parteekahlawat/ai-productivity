import React, { useRef, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Box, Card, CardContent } from "@mui/material";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import axios from "axios";
import html2canvas from "html2canvas";

const FileUploadGraph = () => {
    const [fileData, setFileData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [xColumn, setXColumn] = useState("");
    const [yColumn, setYColumn] = useState("");
    const [graphType, setGraphType] = useState("Bar");
    const [graphImage, setGraphImage] = useState(null);
    const [graphHtml, setGraphHtml] = useState("");
    const iframeRef = useRef(null);



    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            setFileData(parsedData);
            setColumns(Object.keys(parsedData[0] || {}));
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSendData = async () => {
        if (!xColumn || !yColumn) {
            alert("Please select both X and Y columns");
            return;
        }

        const selectedData = fileData.map((row) => ({
            [xColumn]: row[xColumn],
            [yColumn]: row[yColumn]
        }));

        try {
            // console.log(selectedData)
            console.log("Sending data:", {
                xColumn,
                yColumn,
                graphType,
                data: selectedData
            });

            const response = await axios.post("http://localhost:5000/generate-graph", {
                xColumn: xColumn,
                yColumn: yColumn,
                graphType: graphType,
                data: selectedData,
            });
            // console.log("API Response:", response.data);
            if (response.data.includes("<html")) {  // Check if response contains HTML
                // document.open();
                // document.write(response.data);
                // document.close();
                setGraphHtml(response.data);
                alert("Received an HTML page instead of an image.");
            } else {
                const imageUrl = URL.createObjectURL(response.data);
                setGraphImage(imageUrl);
            }

            alert("Data sent successfully!");
        } catch (error) {
            console.error("Error sending data", error);
        }
    };
    const downloadAsJPG = async () => {
        if (iframeRef.current) {
            try {
                const iframe = iframeRef.current;
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const graphElement = iframeDocument.body;

                if (!graphElement) {
                    alert("Graph not found in iframe.");
                    return;
                }

                // Create a hidden div to render the graph
                const hiddenDiv = document.createElement("div");
                hiddenDiv.style.position = "absolute";
                hiddenDiv.style.left = "-9999px";
                hiddenDiv.innerHTML = graphElement.innerHTML;
                document.body.appendChild(hiddenDiv);

                // Capture using html2canvas
                setTimeout(async () => {
                    const canvas = await html2canvas(hiddenDiv, {
                        backgroundColor: "#fff",
                        scale: 2,
                        useCORS: true,
                    });

                    const image = canvas.toDataURL("image/jpeg", 1.0);
                    const link = document.createElement("a");
                    link.href = image;
                    link.download = "graph.jpg";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Remove the hidden div after capturing
                    document.body.removeChild(hiddenDiv);
                }, 500);

            } catch (error) {
                console.error("Error capturing image:", error);
                alert("Error capturing the graph. Try again.");
            }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                File Upload and Graph Generator
            </Typography>
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />

            {fileData.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ mt: 3 }}>
                        Preview Data
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: "auto" }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell key={col}>{col}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fileData.slice(0, 5).map((row, index) => (
                                    <TableRow key={index}>
                                        {columns.map((col) => (
                                            <TableCell key={col}>{row[col]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>X Axis</InputLabel>
                            <Select value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
                                {columns.map((col) => (
                                    <MenuItem key={col} value={col}>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Y Axis</InputLabel>
                            <Select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
                                {columns.map((col) => (
                                    <MenuItem key={col} value={col}>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Graph Type</InputLabel>
                            <Select value={graphType} onChange={(e) => setGraphType(e.target.value)}>
                                <MenuItem value="Bar">Bar Chart</MenuItem>
                                <MenuItem value="Histogram">Histogram</MenuItem>
                                <MenuItem value="Line">Line</MenuItem>
                                <MenuItem value="Scatter">Scatter</MenuItem>
                                <MenuItem value="Box Plot">Box Plot</MenuItem>
                                <MenuItem value="Violin Plot">Violin Plot</MenuItem>
                                <MenuItem value="Pie Chart">Pie Chart</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Button variant="contained" sx={{ mt: 3 }} onClick={handleSendData}>
                        Send Data to Backend
                    </Button>


                    {graphImage && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6">Generated Graph</Typography>
                            <img src={graphImage} alt="Generated Graph" style={{ width: "100%", maxHeight: "400px" }} />
                        </Box>
                    )}
                    {graphHtml && (
                            <iframe
                                title="Graph Preview"
                                srcDoc={graphHtml}
                                style={{ width: "100%", height: "400px", border: "none" }}
                            />
                        )}
                    {/* {graphHtml && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={downloadAsJPG}
                            sx={{ mt: 2 }}
                        >
                            Download as JPG
                        </Button>
                    )} */}



                    {/* <Typography variant="h6" sx={{ mt: 4 }}>Graph Preview</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fileData.map(row => ({ x: row[xColumn], y: row[yColumn] }))}>
                            <XAxis dataKey="x" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="y" fill="#1976d2" />
                        </BarChart>
                    </ResponsiveContainer> */}
                </>
            )}
        </Container>
    );
};

export default FileUploadGraph;
