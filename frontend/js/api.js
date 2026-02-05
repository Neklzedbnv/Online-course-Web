const API_URL = "http://localhost:3000"; 


async function postData(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
    throw error;
  }
}


async function getData(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    throw error;
  }
}


const registerUser = async (userData) => {
  try {
    const result = await postData("/api/auth/register", userData);
    return result;
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
  }
};


const loginUser = async (credentials) => {
  try {
    const result = await postData("/api/auth/login", credentials);
    return result;
  } catch (error) {
    console.error("Ошибка при входе:", error);
  }
};


const getCourses = async () => {
  try {
    const courses = await getData("/api/courses");
    return courses;
  } catch (error) {
    console.error("Ошибка при получении курсов:", error);
  }
};


const enrollInCourse = async (userId, courseId) => {
  try {
    const result = await postData(`/api/enrollments`, { userId, courseId });
    return result;
  } catch (error) {
    console.error("Ошибка при записи на курс:", error);
  }
};


export { registerUser, loginUser, getCourses, enrollInCourse };
