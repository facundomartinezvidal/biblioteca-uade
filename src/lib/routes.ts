export const routes = {
  home: "/",
  users: "/users",
  documentation: "/documentation",
  loans: "/loans",
  penalties: "/multas",
  profile: "/profile",
  webcampus: "https://www.webcampus.uade.edu.ar/",
  linkedinUade: "https://www.linkedin.com/school/uade/posts/?feedView=all",
  uadeWebsite: "https://www.uade.edu.ar/",
  getUserLoans: (userId: string) => `/loans/${userId}`,
};
