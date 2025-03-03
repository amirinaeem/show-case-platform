
import bcrypt from "bcryptjs";

const users = [
    {
      name: 'Admin User',
      email: 'admin@email.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: true,
      avatar: 'https://example.com/avatar1.jpg', // Add avatar URL
    },
    {
      name: 'Neem',
      email: 'publicamiri@email.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
      avatar: 'https://example.com/avatar2.jpg', // Add avatar URL
    },
    {
      name: 'water Melon',
      email: 'water@email.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
      avatar: 'https://example.com/avatar3.jpg', // Add avatar URL
    },
    {
      name: 'Cucumber',
      email: 'cucumber@email.com',
      password: bcrypt.hashSync('123456', 10),
      isAdmin: false,
      avatar: 'https://example.com/avatar4.jpg', // Add avatar URL
    },
  ];


  export default users;