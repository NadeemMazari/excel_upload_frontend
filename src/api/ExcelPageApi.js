import axios from "axios";

export const uploadFile = async (file) => {
  try {
    // Create a new FormData object
    const formData = new FormData();

    // console.log("formData", formData);
    // Append the file to the FormData object
    // The first argument is the name of the field the server expects
    formData.append('file', file);

    const response = await axios.post('https://pakhims.com/test/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
    // Handle other errors
    throw new Error('An unexpected error occurred');
  }
};

export const getData = async () => {
    try {
        const response = await axios.get('https://pakhims.com/test/get-data?page=1&limit=1000');
        return response.data;

    } catch (error) {
        console.log("error", error);
    }
}