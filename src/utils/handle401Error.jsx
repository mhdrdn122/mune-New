// Utility function to handle 401 errors
export const handle401Error = (error) => {
  if (error?.status === 401) {
    localStorage.clear();
    window.location.href = "/super_admin/login";
    // console.log(error)
    // navigate("/super_admin/login"); // Redirect to login page
  }
};

export const handle401ErrorAdmin = (error) => {
  if (error?.status === 401) {
    localStorage.clear();
    window.location.href = "/admin/login";
  }
};
