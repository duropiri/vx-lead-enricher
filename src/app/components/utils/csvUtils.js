// src/app/components/utils/csvUtils.js

import Papa from 'papaparse';

export const processFile = (file, setEnrichedData, setErrorMessage) => {
    Papa.parse(file, {
        header: true,
        complete: (results) => {
            const enriched = loadLeads(results.data);
            setEnrichedData(enriched);
            setErrorMessage('');
        },
        error: (error) => {
            setErrorMessage(`Error reading file: ${error.message}`);
        },
    });
};

export const loadLeads = (leads) => {
    return leads.map((lead) => {
        const [firstName, ...lastName] = lead.realtorCardName ? lead.realtorCardName.split(' ') : [];
        return {
            Email: '',
            '(C) Phone Number': lead.realtorCardContactNumber || '',
            '(O) Phone Number': lead['realtorCardContactNumber 2'] || '',
            Company: lead.realtorCardOfficeName || '',
            'First Name': firstName || '',
            'Last Name': lastName.join(' ') || '',
            Title: lead.realtorCardTitle || '',
            Address: lead.realtorCardOfficeAddress || '',
            'A/Email': '',
            'Realtor Page': lead['realtorCardDetailsLink href'] || '',
            LinkedIn: lead['LinkedInSocialLink href'] || '',
            Twitter: '',
            Facebook: lead['FacebookSocialLink href'] || '',
            Instagram: '',
            Notes: '',
        };
    }).filter(lead => lead['First Name'] || lead['Last Name'] || lead['(C) Phone Number'] || lead.Company);
};

// Function to download CSV
export const downloadCSV = (data) => {
    if (data.length === 0) return;
  
    // Get headers from the first object in the array
    const headers = Object.keys(data[0]);
  
    // Create a CSV string
    const csvContent = [
      headers.join(","), // Join headers with commas
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || "")).join(",") // Align data with headers
      ),
    ]
      .map((e) => e.replace(/(\r\n|\n|\r)/gm, " ")) // Optional: remove new lines from data
      .join("\n");
  
    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "enriched_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  