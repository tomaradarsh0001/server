import React, { useState, useEffect } from "react";

const FileUploadComponent = ({ membershipAppId, clubType, existingFile }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedFileName, setGeneratedFileName] = useState(
        existingFile ? existingFile.split("/").pop() : ""
    );
    const [uploading, setUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(!!existingFile);
    const [uploadedFilePath, setUploadedFilePath] = useState(
        existingFile
            ? `http://edharti.eu-north-1.elasticbeanstalk.com/storage/documents/${existingFile
                  .split("/")
                  .pop()}`
            : ""
    );
    // const [uploadedFilePath, setUploadedFilePath] = useState(existingFile ? `http://192.168.0.62:30/storage/documents/${existingFile.split('/').pop()}` : '');

    // Update UI when `existingFile` changes (from API response)
    useEffect(() => {
        if (existingFile) {
            const fileName = existingFile.split("/").pop();
            setGeneratedFileName(fileName);
            setIsUploaded(true);
            setUploadedFilePath(
                `http://edharti.eu-north-1.elasticbeanstalk.com/storage/documents/${fileName}`
            );
            // setUploadedFilePath(`http://192.168.0.62:30/storage/documents/${fileName}`);
        }
    }, [existingFile]);

    // Generate a dynamic filename
    const generateFileName = () => {
        const timestamp = new Date()
            .toISOString()
            .replace(/[-:T]/g, "")
            .split(".")[0];
        return `${membershipAppId}_${clubType}_${timestamp}.pdf`;
    };

    // Handle file selection
    const handleFileChange = event => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            console.error("Only PDF files are allowed!");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            console.error("File size should be less than 5MB!");
            return;
        }

        setSelectedFile(file);
        setGeneratedFileName(generateFileName());
    };

    // Handle file upload to backend and update UI on success
    const handleFileUpload = async () => {
        if (!selectedFile) {
            console.error("No file selected!");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("document", selectedFile);

        try {
            const response = await fetch(
                `http://edharti.eu-north-1.elasticbeanstalk.com/api/upload-document/${clubType}/${membershipAppId}`,
                {
                    method: "POST",
                    body: formData,
                    headers: { Accept: "application/json" }
                }
            );

            // const response = await fetch(
            //   `http://localhost:8000/api/upload-document/${clubType}/${membershipAppId}`,
            //   {
            //     method: "POST",
            //     body: formData,
            //     headers: { Accept: "application/json" },
            //   }
            // );
            if (response.ok) {
                const result = await response.json();
                console.log("File uploaded successfully:", result);

                // Extract filename from API response or use generated filename
                const uploadedFileName = result.file_path.split("/").pop();

                // Update UI after successful upload
                setIsUploaded(true);
                setSelectedFile(null);
                setUploadedFilePath(
                    `http://edharti.eu-north-1.elasticbeanstalk.com/storage/documents/${uploadedFileName}`
                );
                // setUploadedFilePath(`http://192.168.0.62:30/storage/documents/${uploadedFileName}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            {isUploaded && uploadedFilePath ? (
                <>
                    <span className="text-green-600">✔ File Uploaded</span>
                    <a
                        href={uploadedFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        View
                    </a>
                </>
            ) : (
                <>
                    <input
                        type="file"
                        id={`file-upload-${membershipAppId}`}
                        style={{ display: "none" }}
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() =>
                            document
                                .getElementById(
                                    `file-upload-${membershipAppId}`
                                )
                                .click()
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded-md"
                    >
                        Upload
                    </button>
                    {generatedFileName && (
                        <>
                            <span className="text-gray-700">
                                {generatedFileName}
                            </span>
                            <button
                                onClick={handleFileUpload}
                                className="bg-green-500 text-white px-3 py-1 rounded-md"
                                disabled={uploading}
                            >
                                {uploading ? "Saving..." : "Save"}
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default FileUploadComponent;
